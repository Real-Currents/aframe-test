import React from "react";
import IntrinsicAttributes = React.JSX.IntrinsicAttributes;
import bbox from '@turf/bbox';
import centroid from '@turf/centroid';
import { multiPolygon } from "@turf/helpers";
import { Feature , FeatureCollection } from "geojson";
import { MapRef } from "react-map-gl";

export function convertStrToNum (num: number) {
    console.log(num.toString().substring(1));

    // if (num.toString().match(/^+/) !== null || num.toString().match(/^-/) !== null) {
    //     return +num.toString().substring(1);
    // } else {
    return +num;
    // }
}

/**
 *
 * @param longitude
 * @param latitude
 *
 * From https://stackoverflow.com/questions/14329691/convert-latitude-longitude-point-to-a-pixels-x-y-on-mercator-projection
 *
 * > The Mercator map projection is a special limiting case of the Lambert Conic Conformal map projection
 * >   with the equator as the single standard parallel. All other parallels of latitude are straight lines
 * >   and the meridians are also straight lines at right angles to the equator, equally spaced. It is the
 * >   basis for the transverse and oblique forms of the projection. It is little used for land mapping purposes
 * >   but is in almost universal use for navigation charts. As well as being conformal, it has the particular
 * >   property that straight lines drawn on it are lines of constant bearing. Thus navigators may derive their
 * >   course from the angle the straight course line makes with the meridians.
 *
 * Mercator projection
 *
 * The formulas to derive projected Easting and Northing coordinates from spherical latitude φ and longitude λ are:
 *
 * E = FE + R (λ – λₒ)
 * N = FN + R ln[tan(π/4 + φ/2)]
 *
 * where λO is the longitude of natural origin and FE and FN are false easting and false northing. In spherical Mercator those values are actually not used, so you can simplify the formula to
 *
 * derivation of the mercator projection (wikipedia)
 *
 * Sources:
 *
 * 1) [OGP Geomatics Committee, Guidance Note Number 7, part 2: Coordinate Conversions and Transformation](https://ge0mlib.com/papers/Guide/IOGP/373-07-2_2015.pdf)
 * 2) [Derivation of the Mercator projection](http://en.wikipedia.org/wiki/Mercator_projection#Derivation_of_the_Mercator_projection)
 * 3) [National Atlas: Map Projections](http://www.nationalatlas.gov/articles/mapping/a_projections.html)
 * 4) [Mercator Map projection](https://stackoverflow.com/questions/1019997/convert-lat-longs-to-x-y-co-ordinates)
 *
 */
export function convertLonLatToMercatorXY (longitude: number, latitude: number) {
    const mapWidth = 200;
    const mapHeight = 100;
    const PI = Math.PI;
    const ln = Math.log;
    const tan = Math.tan;

    // get x value
    const x = 1000 * (longitude + 180) * (mapWidth / 360)

    // convert from degrees to radians
    const latRad = latitude * PI / 180;

    // get y value
    const mercN = ln(tan((PI / 4) + (latRad / 2)));
    const y = 1000 * (mapHeight / 2) - (mapWidth * mercN / (2 * PI));

    console.log("converted spherical coords (" + longitude + ", " + latitude + ") to mercator ("
        + x + ", " + y +") in meters"
    )

    return [ x, y ];
}

/**
 *
 * @param minLonLat
 * @param maxLonLat
 *
 * From https://gis.stackexchange.com/questions/19632/how-to-calculate-the-optimal-zoom-level-to-display-two-or-more-points-on-a-map
 *
 * To get the zoom level, you'll need to know the pixel dimensions of your map.
 *   You'll also need to do your math in spherical mercator coordinates.
 *
 * 1) Convert latitude, longitude to spherical mercator x, y.
 * 2) Get distance between your two points in spherical mercator.
 * 3) The equator is about 40m meters long projected and tiles are 256 pixels wide,
 *   so the pixel length of that map at a given zoom level is about 256 * distance/40000000 * 2^zoom.
 *   Try zoom=0, zoom=1, zoom=2 until the distance is too long for the pixel dimensions of your map.
 *
 */
export function getZoomExtentFromPoints (minLonLat: number[], maxLonLat: number[]) {
    const [ min_x, min_y ] = convertLonLatToMercatorXY(minLonLat[0], minLonLat[1]);
    const [ max_x, max_y ] = convertLonLatToMercatorXY(maxLonLat[0], maxLonLat[1]);
    const distance_x = max_x - min_x;
    const distance_y = max_y - min_y;

    // 420px = 256 * distance_x / 40000000 * 2 ^ zoom
    // 420 / (256 * distance_x / 40000000) = 2 ^ zoom
    // 420 / (256 * distance_x / 40000000) = Math.pow(2, zoom)
    const zoom = Math.log(420 / (256 * distance_x / 40000000)) / Math.log(2)

    console.log("calculated zoom: ", zoom);

    return zoom;
}

export function getLonLatFromFeature (feature: (Feature<any> | FeatureCollection<any>)) {

    let ctr_lon: number | null = null,
        ctr_lat: number | null = null,
        zoom_ext: number | null = null;

    if (feature) try {
        console.log("Use bounding box as boundary...");
        const [min_lon, min_lat, max_lon, max_lat] = bbox(feature);
        console.log("[min_lon, min_lat, max_lon, max_lat]: ",
            [min_lon, min_lat, max_lon, max_lat]); // [ -81.843916, 35.543057, -81.826445, 35.559111 ]

        // const boundary = multiPolygon(
        //     [
        //         [
        //             [min_lon, min_lat],
        //             [max_lon, min_lat],
        //             [max_lon, max_lat],
        //             [min_lon, max_lat],
        //             [min_lon, min_lat]
        //         ]
        //     ]);
        // console.log(boundary);

        ctr_lon = (min_lon + max_lon) / 2;
        ctr_lat = (min_lat + max_lat) / 2;

        if (
            ("geometry" in feature
                && "coordinates" in feature.geometry)
        ) {

            try {
                const boundary = multiPolygon(feature.geometry.coordinates);
                console.log(boundary);

                const c = centroid(boundary);
                const lon = c.geometry.coordinates[0],
                    lat  = c.geometry.coordinates[1];
                ctr_lon = lon;
                ctr_lat = lat;
            } catch (e) {
                // TODO:
                //   Fix TypeError: (intermediate value)(...) is not iterable
                //   Fix Uncaught Error: Each LinearRing of a Polygon must have 4 or more Positions.
                console.log("turf error:", e);
                if (("properties" in feature
                    && feature.properties !== null
                    && "lon" in feature.properties
                    && "lat" in feature.properties)
                ) {
                    ctr_lon = convertStrToNum(feature.properties.lon);
                    ctr_lat = convertStrToNum(feature.properties.lat);
                }
            }
        }

        zoom_ext = getZoomExtentFromPoints([ min_lon, min_lat ], [ max_lon, max_lat ]);

    } catch (e) {
        console.log(e);
    }

    return [ ctr_lon, ctr_lat, zoom_ext ];
}

export function jumpMapToFeature (map: MapRef, feature: (Feature<any> | FeatureCollection<any>), zoom: number | null) {
    console.log(feature);

    let [ ctr_lon, ctr_lat, zoom_ext ] = getLonLatFromFeature(feature);

    console.log("calculated zoom_ext: ", zoom_ext);

    if (
        ctr_lon !== null && ctr_lon === ctr_lon
        && ctr_lat !== null && ctr_lat === ctr_lat
    ) {

        if (map) {
            console.log("centroid: ", ctr_lon, ctr_lat);
            // map.flyTo({ // flyTo is a shortcut for zoomTo + panTo
            //     center: [
            //         ctr_lon,
            //         ctr_lon
            //     ],
            //     zoom: 9
            // });
            setTimeout(() => {
                map.flyTo({ // flyTo is a shortcut for zoomTo + panTo
                    center: [
                        ctr_lon!,
                        ctr_lat!
                    ],
                    zoom: (zoom_ext) ? Math.floor(zoom_ext - 9) : (zoom !== null) ? zoom : map.getZoom() // zoom
                });
            }, 533);
        }
    }
}

//
// function compareFeaturePriorityToF(feature: { layer: (IntrinsicAttributes & LayerProps) }, f: { layer: (IntrinsicAttributes & LayerProps) }) {
//     if (f.layer.source === "auction-904-defaults-blocks") {
//         return f;
//     } else if (feature.layer.source !== "auction-904-defaults-blocks"
//         && f.layer.source === "auction-904-ready-blocks"
//     ) {
//         return f;
//     } else if (feature.layer.source !== "auction-904-defaults-blocks"
//         && feature.layer.source !== "auction-904-ready-blocks"
//         && f.layer.source === "auction-904-authorized-blocks"
//     ) {
//         return f;
//     } else if (feature.layer.source !== "auction-904-defaults-blocks"
//         && feature.layer.source !== "auction-904-ready-blocks"
//         && feature.layer.source !== "auction-904-authorized-blocks"
//     ) {
//         return f;
//     }
//     return feature;
// }
