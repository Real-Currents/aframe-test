import React, {useState, useCallback, useEffect, useRef, useMemo, useContext} from 'react';
import IntrinsicAttributes = React.JSX.IntrinsicAttributes;
import { Map as MapboxMap } from 'mapbox-gl';
import Map, { Source, Layer,  LayerProps, MapRef } from 'react-map-gl';
import { fitBounds } from 'viewport-mercator-project';
import { useSpring, animated } from "react-spring";

import axios, {AxiosInstance} from "axios";
import { ApiContext } from "../../contexts/ApiContextProvider";

import { parseIspId, formatBroadbandTechnology } from '../utils/utils';
import { getBEADColor } from '../utils/colors';

import { format } from 'd3-format';
import "mapbox-gl/dist/mapbox-gl.css";
import {
    bead_dev,
    // bb_tr_100_20,
    contourStyle
} from '../styles';
import { GeoJSONFeature } from "maplibre-gl";

import MapLegend from './MapLegend';
import style from "./styles/GlMap.module.css";

import broadband_technology_dict from './../data/broadband_technology.json';
const broadband_technology: Record<string, string> = broadband_technology_dict;

const percentFormat = format('.1%');

type GlMapProps = {
    mapboxToken: string,
    filter: {
        bb_service: {
            served: boolean,
            underserved: boolean,
            unserved: boolean
        },
        isp_count: number[],
        total_locations: number[],
        isp_combos: string[],
        counties: string[],
        broadband_technology: string[],
        has_previous_funding: {
            yes: boolean,
            no: boolean
        }
    },
    fillColor: any,
    colorVariable: string,
    onFocusBlockChange: (newFocusBlock: string) => void,
    onDetailedInfoChange: (newDetailedInfo: any[]) => void,
    onZoomChange: (newZoom: number) => void,
    ispNameLookup: { [key: string]: string },
    isShowing: boolean
};

const USA_BOUNDS: [
    [number, number],
    [number, number]
] = [
    [-125, 24], // Southwest coordinates: [Longitude, Latitude]
    [-66, 49] // Northeast coordinates: [Longitude, Latitude]
];

const GlMap: React.FC < GlMapProps > = ({
  mapboxToken, 
  filter, 
  fillColor, 
  colorVariable,
  onFocusBlockChange,
  onDetailedInfoChange,
  onZoomChange,
  ispNameLookup,
  isShowing
}: GlMapProps) => {

    const apiContext = useContext(ApiContext);

    const mapRef = useRef < MapRef | null > (null);

    const MIN_ZOOM_LEVEL = 9;

    const selection_color = '#00835D';

    const { longitude, latitude, zoom } = fitBounds({
        width: window.innerWidth,
        height: window.innerHeight,
        bounds: USA_BOUNDS,
        padding: 20 // Optional padding around the bounds
    });

    const [ layerAttributes, setLayerAttributes] = useState < (IntrinsicAttributes & LayerProps) > ({ ...bead_dev.layers[0] });

    const [ hoverInfo, setHoverInfo] = useState < any > (null); // Specify the type of hoverInfo if known
    const  [layerFilter, setLayerFilter] = useState < any > (['all']); // Specify the type of layerFilter if known
    const [ mapZoom, setMapZoom] = useState < number > (zoom);
    const [ clickedBlock, setClickedBlock] = useState < string > ("");

    const [ selected_features, selectFeatures ] = useState<GeoJSONFeature[]>([]);
    const [ selected_geoids, selectGeoIDs ] = useState<string[]>([]);

    const props = useSpring({
        width: isShowing ? window.innerWidth - 375 + "px": window.innerWidth + "px"
    });  

    const onMove = (event: any) => { // Specify the type of event if known
        setMapZoom(event.viewState!.zoom!);
        onZoomChange(event.viewState!.zoom!);
    };

    const onHover = useCallback((event: any) => { // Specify the type of event if known
        if (mapRef !== null && mapRef.current !== null) {
            const {
                features,
                point: { x, y }
            } = event;
            const hoveredFeature = features && features[0];

            // console.log("hoveredFeature is ", hoveredFeature);

            setHoverInfo(hoveredFeature && { feature: hoveredFeature, x, y });

        }
    }, []);

    const getBlockInfoFromApi = (geoid_bl: string, token: string) => {
        // console.log("API Context state: ", apiContext);

        const client: AxiosInstance | null = (apiContext.hasOwnProperty("apiClient") && apiContext.apiClient !== null
            && apiContext.apiClient.hasOwnProperty("get") && typeof apiContext.apiClient.get === "function"
        ) ?
            apiContext.apiClient: null;

        if (client !== null && client.hasOwnProperty("get") && typeof client.get === "function") {

            client.get("/rest/bead/all?geoid_bl=" + geoid_bl)
                .then(result => {

                    // TODO: How is this used?
                    // onFocusBlockChange(geoid_bl);

                    console.log("result is ", result);

                    if (result.data
                        && result.data.hasOwnProperty("features")
                        && result.data.features.length > 0
                    ) {
                        onDetailedInfoChange(result.data.features);

                        const block_features = result.data.features.filter((f: GeoJSONFeature) => {
                            // class GeoJSONFeature {
                            // 	type: "Feature";
                            // 	_geometry: GeoJSON.Geometry;
                            // 	properties: {
                            // 		[name: string]: any;
                            // 	};
                            // 	id: number | string | undefined;
                            // 	_vectorTileFeature: VectorTileFeature;
                            // 	constructor(vectorTileFeature: VectorTileFeature, z: number, x: number, y: number, id: string | number | undefined);
                            // 	get geometry(): GeoJSON.Geometry;
                            // 	set geometry(g: GeoJSON.Geometry);
                            // 	toJSON(): any;
                            // }
                            if (f.hasOwnProperty("properties")
                                && f["properties"].hasOwnProperty("type")
                                && f["properties"]["type"] === "geojson"
                            ) {
                                console.log("GeoJSON for this feature:", f);
                                return true;
                            }
                        });
                        selectFeatures([ ...block_features ]);
                    }
                })
                .catch(error => {
                    console.error("Error fetching data:", error);
                    if (error.hasOwnProperty("code")) {
                        console.log("Error code:", error.code!);
                        if (error.code! === "ERR_BAD_REQUEST"
                            || error.code! === "ERR_NETWORK"
                        ) {
                            window.alert("Please refresh session by clicking the browser's reload button!");
                            apiContext.autoSignOut();
                        }
                    } else {
                        window.alert("Please refresh session by clicking the browser's reload button!");
                        apiContext.autoSignOut();
                    }
                });

        } else {
            console.log("API Client Error:", client);
            // window.alert("Please refresh session by clicking the browser's reload button!");
            // apiContext.autoSignOut();
        }
    }

    // const onClick =
    const makeOnClick = (token: string) => {
        // Create OnClick Callback with API token

        return (event: any) => {
                console.log("Click event:", event);
                if (mapRef !== null && mapRef.current !== null) {
                    const {
                        features
                    } = event;

                    if ((!!features && features.length > 0)) {
                        const clickedFeature = features[0]!;
                        const clickedGeoID = clickedFeature.properties.geoid_bl.toString();
                        const geoids = [
                            ...selected_geoids,
                            clickedGeoID
                        ];

                        console.log(`Feature clicked (${clickedGeoID}):`, clickedFeature);
                        console.log("Feature clicked:", clickedFeature);
                        setClickedBlock(clickedGeoID);
                        selectGeoIDs(geoids);
                        getBlockInfoFromApi(geoids.join(","), token);
                    }
                }
            };
    }

    useEffect(() => {

        let bb_array: any[] = [];

        if (filter.bb_service.served === true) {
            bb_array = [...bb_array, "Served"];
        }

        if (filter.bb_service.underserved === true) {
            bb_array = [...bb_array, "Underserved"];
        }

        if (filter.bb_service.unserved === true) {
            bb_array = [...bb_array, "Unserved"];
        }

        bb_array = [ ...bb_array, "Not Reported" ];

        let isp_filter: any = [
            'all',
            ['>=', ['get', 'cnt_isp'], filter.isp_count[0]],
            ['<=', ['get', 'cnt_isp'], filter.isp_count[1]]
        ];

        let total_locations_filter: any = [
            'all',
            ['>=', ['get', 'cnt_total_locations'], filter.total_locations[0]],
            ['<=', ['get', 'cnt_total_locations'], filter.total_locations[1]]
        ];

        let new_filter: any = ["all", ['in', ['get', 'bead_category'],
            ['literal', bb_array]
        ], isp_filter, total_locations_filter];

        if (filter.isp_combos.length !== 0) {
            let isp_combo_filter = ['in', ['get', 'combo_isp_id'],
                ['literal', filter.isp_combos]
            ];
            new_filter.push(isp_combo_filter);
        }

        if (filter.counties.length !== 0) {
            let counties_filter = ['in', ['get', 'geoid_co'],
                ['literal', filter.counties]
            ];
            new_filter.push(counties_filter);
        }

        if (filter.broadband_technology.length !== 0) {
            for (let i = 0; i < filter.broadband_technology.length; i++) {
                let broadband_technology_filter = ['==', ['get', broadband_technology[filter.broadband_technology[i]]], true];
                new_filter.push(broadband_technology_filter);
            }
        }

        if (filter.has_previous_funding.yes !== filter.has_previous_funding.no) {

            if (filter.has_previous_funding.yes === true) {
                let has_previous_funding_filter = ['==', ['get', 'has_previous_funding'], true];
                new_filter.push(has_previous_funding_filter);
            }
            else {
                let has_previous_funding_filter = ['==', ['get', 'has_previous_funding'], false];
                new_filter.push(has_previous_funding_filter);
            }
        }
        else {
            if (filter.has_previous_funding.yes === false) {
                let has_previous_funding_filter = ['==', ['get', 'has_previous_funding'], null];
                new_filter.push(has_previous_funding_filter);
            }
        }

        setLayerFilter(new_filter);

    }, [filter]);


    useEffect(() => {

        const newLayerAttributes: (LayerProps & IntrinsicAttributes) = {
            ...layerAttributes
        };

        (newLayerAttributes as any) !["paint"] = {
            "fill-color": fillColor
        };

        setLayerAttributes(newLayerAttributes);

    }, [fillColor]);

    useEffect(() => {
        setTimeout(() => {
            // console.log("Add map to global window object:", mapRef);
            if (mapRef !== null && mapRef.current !== null) {
                const map: MapboxMap = mapRef.current!.getMap();
                (map as { [key: string]: any })["map"] = map;
                (window as { [key: string]: any })["map"] = (map as unknown) as MapRef;
            }
        }, 2533);
    }, [ mapRef ]);

    return ( /*Wait for ApiToken*/
        (apiContext.hasOwnProperty("token") && apiContext.token !== null) ? (
            <div className={style["map-wrapper"]}>
                {mapZoom < MIN_ZOOM_LEVEL && (
                  <animated.div style={props} className={style["zoom-message"]}>Zoom in further to view and filter data</animated.div>
                )}
                {mapZoom >= MIN_ZOOM_LEVEL && (
                  <MapLegend title={colorVariable} category={fillColor} />
                )}
                {clickedBlock.length > 0 && (
                  <a href="#detail">
                    <button className={style["detail-button"]}>
                        Detailed View
                        <svg viewBox="0 0 22 14" aria-hidden="true"><polygon points="18.8743237 0 22 3.62676411 10.6828079 14 0 3.57495046 3.2339044 0.0505492411 10.7824379 7.41694926"></polygon></svg>
                    </button>
                  </a>
                )}
                <Map
                    ref={mapRef}
                    initialViewState={{
                      latitude: latitude,
                      longitude: longitude,
                      zoom: zoom
                    }}
                    mapStyle="mapbox://styles/mapbox/light-v9"
                    mapboxAccessToken={mapboxToken}
                    interactiveLayerIds={
                        (bead_dev.layers !== null && bead_dev.layers[0].hasOwnProperty('id') ) ? [
                            bead_dev.layers[0]['id']!
                        ] : []
                    }
                    onMouseMove={onHover}
                    onMove={onMove}
                    onClick={makeOnClick(apiContext.token!.toString())}
                >

                    <Source id={"mapbox-terrain"} type={"vector"} url={"mapbox://mapbox.mapbox-terrain-v2"} >
                        <Layer {...contourStyle} >
                        </Layer>
                    </Source>

                    <Source {...bead_dev.sources[0]} >
                        <Layer
                          {...layerAttributes}
                          filter={layerFilter}
                        />
                        {hoverInfo && (
                        <div className={style["tooltip"]} style={{left: hoverInfo.x, top: hoverInfo.y}}>
                            <h5>BEAD status: <span className={style["bead-category"]} style={{textDecorationColor: getBEADColor(hoverInfo.feature.properties.bead_category)}}>{hoverInfo.feature.properties.bead_category}</span></h5> 
                            <div>
                                <div>
                                    <p><b>Broadband access</b></p>
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td>Locations</td>
                                                <td>{hoverInfo.feature.properties.cnt_total_locations}</td>
                                            </tr>
                                            <tr>
                                                <td>{"Pct. unserved (<25/3)"}</td>
                                                <td>{percentFormat(1-hoverInfo.feature.properties.pct_served)}</td>
                                            </tr>
                                            <tr>
                                                <td>{"Pct un- and underserved (<100/20) "}</td>
                                                <td>{percentFormat(hoverInfo.feature.properties.cnt_25_3 / hoverInfo.feature.properties.cnt_total_locations)}</td>
                                            </tr>
                                            <tr>
                                                <td>{"Pct served (>100/20)"}</td>
                                                <td>{percentFormat(hoverInfo.feature.properties.cnt_100_20 / hoverInfo.feature.properties.cnt_total_locations)}</td>
                                            </tr>   
                                        </tbody>                             
                                    </table>
                                </div>
                                <div>
                                    <p><b>Broadband technologies</b>: {formatBroadbandTechnology(
                                            [
                                                hoverInfo.feature.properties.has_coaxial_cable,
                                                hoverInfo.feature.properties.has_copperwire,
                                                hoverInfo.feature.properties.has_fiber,
                                                hoverInfo.feature.properties.has_lbr_wireless,
                                                hoverInfo.feature.properties.has_licensed_wireless
                                            ]
                                        )}
                                    </p>
                                <p><b>Previous federal funding?</b> {hoverInfo.feature.properties.has_previous_funding? "Yes": "No"}</p>
                                <p><b>Internet service providers:</b> {hoverInfo.feature.properties.combo_isp_id ? parseIspId(hoverInfo.feature.properties.isp_id, ispNameLookup): "N/A"}</p>
                            </div>
                          </div>
                        </div>
                        )}
                    </Source>
                    {/*{(selected_features.length > 0) ?*/}
                        <Source type="geojson" id="bead_block" data={{
                            "type": "FeatureCollection",
                            "features": selected_features
                        }} >
                            <Layer {...{
                                id: "bead_block-fill",
                                source: "bead_block",
                                type: "fill",
                                paint: {
                                    "fill-color": "#ffffff",
                                    "fill-opacity": 0.25
                                }
                            }}></Layer>
                            <Layer {...{
                                id: "bead_block-line",
                                source: "bead_block",
                                type: "line",
                                paint: {
                                    "line-color": selection_color,
                                }
                            }}></Layer>
                        </Source>{/*    : <></>*/}
                    {/*}*/}
                </Map>
            </div>
        ) :
            <div className={style["map-wrapper"]}></div>
    );
}

export default GlMap;
