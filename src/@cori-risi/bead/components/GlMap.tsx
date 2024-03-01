import React, {useState, useCallback, useEffect, useRef, useMemo, useContext, MutableRefObject} from 'react';
import IntrinsicAttributes = React.JSX.IntrinsicAttributes;
import { fitBounds } from 'viewport-mercator-project';
import { useDispatch, useSelector } from "react-redux";
import { useSpring, animated } from "react-spring";
import { AxiosInstance } from "axios";
import { Map as MapboxMap } from 'mapbox-gl';
import { GeoJSONFeature } from "maplibre-gl";
import Map, {
    Source,
    Layer,
    LayerProps,
    MapRef,
    FullscreenControl,
    GeolocateControl,
    NavigationControl,
    ScaleControl
} from 'react-map-gl';

import { ApiContext } from "../../contexts/ApiContextProvider";
import MapLegend from './MapLegend';
import style from "./styles/GlMap.module.css";
import "mapbox-gl/dist/mapbox-gl.css";
import {
    bead_dev,
    isp_footprint_line,
    isp_footprint_fill,
    contourStyle,
    mapboxStyle
} from '../styles';

import {
    selectMapFilters,
    setMapFilters,
    setMapHover,
    selectMapSelection,
    setMapSelection
} from "../features";
import { FilterState } from "../models/index";
import { HoverInfo } from "./HoverInfo";

import {
    // getBEADColor,
    getFillColor
} from '../utils/colors';
// import {
//     formatBroadbandTechnology,
//     parseIspId, swapKeysValues
// } from '../utils/utils';

import broadband_technology_dict from './../data/broadband_technology.json';
import isp_name_dict from "../data/isp_name_lookup_rev.json";

const broadband_technology: Record<string, string> = broadband_technology_dict;

type GlMapProps = {
    mapboxToken: string
};

const USA_BOUNDS: [
    [number, number],
    [number, number]
] = [
    [-105, 24], // Southwest coordinates: [Longitude, Latitude]
    [-70, 49] // Northeast coordinates: [Longitude, Latitude]
];

const GlMap: React.FC < GlMapProps > = ({
  mapboxToken, 
  // filter,
  // fillColor,
  // colorVariable,
  // onFocusBlockChange,
  // onDetailedInfoChange,
  // ispNameLookup,
  // isShowing
}: GlMapProps) => {

    console.log("GLMap is re-rendering");

    const apiContext = useContext(ApiContext);

    const dispatch = useDispatch();

    const filterState: FilterState = useSelector(selectMapFilters);

    const mapRef: MutableRefObject<MapRef | null> = useRef < MapRef | null > (null);

    const MIN_ZOOM_LEVEL = 9;

    const selection_color = '#00835D';

    const [fillColor, setFillColor] = useState < any[] > (getFillColor(filterState.colorVariable, filterState.excludeDSL));
    const isShowing = false;

    const { longitude, latitude, zoom } = fitBounds({
        width: window.innerWidth,
        height: window.innerHeight,
        bounds: USA_BOUNDS,
        padding: 20 // Optional padding around the bounds
    });

    const [ layerAttributes, setLayerAttributes ] = useState < (IntrinsicAttributes & LayerProps) > ({ ...bead_dev.layers[0] });

    const [ hoverInfo, setHoverInfo ] = useState < any > (null); // Specify the type of hoverInfo if known
    const [ layerFilter, setLayerFilter ] = useState < any > (['all']); // Specify the type of layerFilter if known
    const [ footprintFilter, setFootprintFilter ] = useState < any > (["all"]);
    const [ mapZoom, setMapZoom ] = useState < number > (zoom);
    const [ clickedBlock, setClickedBlock ] = useState < string > ("");

    const mapSelection = useSelector<any>(selectMapSelection); // { "...": GeoJSONFeature[] }
    const [ selected_features, selectFeatures ] = useState<GeoJSONFeature[]>([]);
    const [ selected_geoids, selectGeoIDs ] = useState<string[]>([]);

    const props = useSpring({
        width: filterState.showSidebar ? window.innerWidth - 375 + "px": window.innerWidth + "px"
    });

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
                        // onDetailedInfoChange(result.data.features);

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

                        const isp_tech_features = result.data.features.filter((f: GeoJSONFeature) => {
                            const columns = [];
                            if (f.hasOwnProperty("properties")
                                && f["properties"].hasOwnProperty("type")
                                && f["properties"]["type"] === "isp_tech"
                            ) {
                                console.log("ISP for this feature:", f);
                                for (let p in f["properties"]) {
                                    columns.push(p);
                                }
                                console.log(columns);
                                return true;
                            }
                        });

                        const award_features = result.data.features.filter((f: GeoJSONFeature) => {
                            const columns = [];
                            if (f.hasOwnProperty("properties")
                                && f["properties"].hasOwnProperty("type")
                                && f["properties"]["type"] === "award"
                            ) {
                                console.log("Award for this feature:", f);
                                for (let p in f["properties"]) {
                                    columns.push(p);
                                }
                                console.log(columns);
                                return true;
                            }
                        });

                        const acs_features = result.data.features.filter((f: GeoJSONFeature) => {
                            const columns = [];
                            if (f.hasOwnProperty("properties")
                                && f["properties"].hasOwnProperty("type")
                                && f["properties"]["type"] === "acs"
                            ) {
                                console.log("Tract ACS for this feature:", f);
                                for (let p in f["properties"]) {
                                    columns.push(p);
                                }
                                console.log(columns);
                                return true;
                            }
                        });

                        dispatch(setMapSelection({
                            block_features,
                            isp_tech_features,
                            award_features,
                            acs_features
                        }));
                    }
                })
                .catch(error => {
                    console.error("Error fetching data:", error);
                    if (error.hasOwnProperty("code")) {
                        console.log("Error code:", error.code!);
                        if (error.code! === "ERR_BAD_REQUEST"
                            || error.code! === "ERR_NETWORK"
                        ) {
                            window.alert("Please refresh this session by clicking the browser's reload button!");
                            apiContext.autoSignOut();
                        }
                    } else {
                        window.alert("Please refresh this session by clicking the browser's reload button!");
                        apiContext.autoSignOut();
                    }
                });

        } else {
            console.log("API Client Error:", client);
            // window.alert("Please refresh session by clicking the browser's reload button!");
            // apiContext.autoSignOut();
        }
    };

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

                    console.log(`Feature clicked (${clickedGeoID}):`, clickedFeature);

                    const geoids = (selected_geoids.filter(geoid => geoid === clickedGeoID).length < 1) ?
                        [
                            ...selected_geoids,
                            clickedGeoID
                        ] :
                        [
                            ...selected_geoids.filter(geoid => geoid !== clickedGeoID)
                        ];

                    if (geoids.length < 1) {
                        dispatch(setMapSelection({
                            "block_features": [],
                            "isp_tech_features": [],
                            "award_features": []
                        }));
                    } else {
                        setClickedBlock(clickedGeoID);
                        selectGeoIDs(geoids);
                        getBlockInfoFromApi(geoids.join(","), token);
                    }
                }
            }
        };
    };

    const onHover = (event: any) => {
        if (mapRef !== null && mapRef.current !== null) {
            const {
                features,
                point: { x, y }
            } = event;

            if (!!features && features.length > 0 && features[0].hasOwnProperty("properties")) {
                const hoveredFeature = {
                    "x": x,
                    "y": y,
                    "feature": {
                        "properties": {
                            ...features[0].properties
                        }
                    }
                };
                // console.log("hoveredFeature is ", hoveredFeature);
                // setHoverInfo(hoveredFeature && { feature: hoveredFeature, x, y });
                dispatch(setMapHover(hoveredFeature));
            } else {
                dispatch(setMapHover({
                    "x": 0,
                    "y": 0
                }))
            }
        }
    };

    const onMove = (event: any) => {
        if (event.hasOwnProperty("viewState") && event["viewState"].hasOwnProperty("zoom")) {
            setMapZoom(event.viewState!.zoom!);

            if (filterState.disableSidebar !== (event.viewState!.zoom! < MIN_ZOOM_LEVEL)) {
                dispatch(setMapFilters({
                    "disableSidebar": (event.viewState!.zoom! < MIN_ZOOM_LEVEL)
                }));
            }

        }
    };

    useEffect(() => {
        const selection = mapSelection as {[index: string]: GeoJSONFeature[]};
        if (
            selection.hasOwnProperty("block_features")
            && selection.block_features !== null
            && selection.block_features.length > 0
        ) {
            selectGeoIDs(selection.block_features.map((f) => f.properties.geoid_bl));
            selectFeatures(selection.block_features)
        } else {
            selectGeoIDs([]);
            selectFeatures([]);
        }
    }, [ mapSelection ]);

    useEffect(() => {

        let bb_array: any[] = [];

        if (filterState.bb_service.served === true) {
            bb_array = [...bb_array, "Served"];
        }

        if (filterState.bb_service.underserved === true) {
            bb_array = [...bb_array, "Underserved"];
        }

        if (filterState.bb_service.unserved === true) {
            bb_array = [...bb_array, "Unserved"];
        }

        bb_array = [ ...bb_array, "Not Reported" ];

        let isp_filter: any = [
            'all',
            ['>=', ['get', 'cnt_isp'], filterState.isp_count[0]],
            ['<=', ['get', 'cnt_isp'], filterState.isp_count[1]]
        ];

        let total_locations_filter: any = [
            'all',
            ['>=', ['get', 'cnt_total_locations'], filterState.total_locations[0]],
            ['<=', ['get', 'cnt_total_locations'], filterState.total_locations[1]]
        ];

        let new_filter: any = ["all", ['in', ['get', 'bead_category'],
            ['literal', bb_array]
        ], isp_filter, total_locations_filter];

        if (filterState.isp_combos.length !== 0) {
            let isp_combo_filter = ['in', ['get', 'combo_isp_id'],
                ['literal', filterState.isp_combos]
            ];
            new_filter.push(isp_combo_filter);
        }

        if (filterState.counties.length !== 0) {
            let counties_filter = ['in', ['get', 'geoid_co'],
                ['literal', filterState.counties]
            ];
            new_filter.push(counties_filter);
        }

        if (filterState.broadband_technology.length !== 0) {
            for (let i = 0; i < filterState.broadband_technology.length; i++) {
                let broadband_technology_filter = ['==', ['get', broadband_technology[filterState.broadband_technology[i]]], true];
                new_filter.push(broadband_technology_filter);
            }
        }

        if (filterState.has_previous_funding.yes !== filterState.has_previous_funding.no) {

            if (filterState.has_previous_funding.yes === true) {
                let has_previous_funding_filter = ['==', ['get', 'has_previous_funding'], true];
                new_filter.push(has_previous_funding_filter);
            }
            else {
                let has_previous_funding_filter = ['==', ['get', 'has_previous_funding'], false];
                new_filter.push(has_previous_funding_filter);
            }
        }
        else {
            if (filterState.has_previous_funding.yes === false) {
                let has_previous_funding_filter = ['==', ['get', 'has_previous_funding'], null];
                new_filter.push(has_previous_funding_filter);
            }
        }

        setLayerFilter(new_filter);

        let footprint_filter = ['==', ['get', 'isp_id'], filterState.isp_footprint]
        setFootprintFilter(footprint_filter);

        if (filterState.hasOwnProperty("colorVariable")) {
            setFillColor(getFillColor(filterState.colorVariable, filterState.excludeDSL));
        }

    }, [filterState]);


    useEffect(() => {

        const newLayerAttributes: (LayerProps & IntrinsicAttributes) = {
            ...layerAttributes
        };

        (newLayerAttributes as any)!["paint"] = {
            "fill-color": fillColor
        };

        setLayerAttributes(newLayerAttributes);

    }, [fillColor]);

    useEffect(() => {
        setTimeout(() => {
            // console.log("Add map to global window object:", mapRef);
            if (mapRef.hasOwnProperty("current") && mapRef.current !== null) {
                const map: MapboxMap = mapRef.current!.getMap();
                (map as { [key: string]: any })["map"] = map;
                (window as { [key: string]: any })["map"] = (map as unknown) as MapRef;
            }
        }, 2533);
    }, [ mapRef ]);

    return ( /*Wait for ApiToken*/
        (apiContext.hasOwnProperty("token") && apiContext.token !== null) ? (
            <div className={style["map-wrapper"]}>

                <Map
                    ref={mapRef}
                    initialViewState={{
                      latitude: latitude,
                      longitude: longitude,
                      zoom: zoom
                    }}
                    // mapStyle="mapbox://styles/ruralinno/cl010e7b7001p15pe3l0306hv"
                    mapStyle={mapboxStyle}
                    mapboxAccessToken={mapboxToken}
                    interactiveLayerIds={
                        (bead_dev.layers !== null && bead_dev.layers[0].hasOwnProperty('id') ) ? [
                            bead_dev.layers[0]['id']!
                        ] : []
                    }
                    onClick={makeOnClick(apiContext.token!.toString())}
                    onMouseMove={onHover}
                    onMove={onMove}
                >

                    <Source id={"mapbox-terrain"}
                            type={"vector"}
                            url={"mapbox://mapbox.mapbox-terrain-v2"} >
                        {/*{mapZoom >= MIN_ZOOM_LEVEL && (*/}
                            <Layer {...contourStyle} />
                        {/*)}*/}
                    </Source>

                    <Source {...bead_dev.sources[0]} >
                        {(!!filterState.displayDataLayers) ?
                            <Layer
                              {...layerAttributes}
                              filter={layerFilter}
                            /> :
                            <></>
                        }
                    </Source>

                    <Source {...isp_footprint_fill.sources[0]} >
                        <Layer
                            { ...isp_footprint_fill.layers[0] }
                            filter={footprintFilter}
                        />
                    </Source>

                    <Source {...isp_footprint_line.sources[0]} >
                        <Layer
                            { ...isp_footprint_line.layers[0] }
                            filter={footprintFilter}
                        />
                    </Source>

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
                                    "fill-opacity": 0.05
                                }
                            }} />
                            <Layer {...{
                                id: "bead_block-fill-pattern",
                                // source: "bead_block",
                                "type": "fill",
                                "source": "composite",
                                "minzoom": 5,
                                "paint": {
                                    // "fill-color": "hsla(303, 73%, 74%, 0.66)",
                                    "fill-color": "#FFFFFF",
                                    "fill-opacity": 0.25,
                                    // "fill-pattern": "circle-1"
                                    "fill-pattern": [
                                        "step",
                                        // ["get","cnt_isp"],
                                        ['zoom'],
                                        "circle-4", 5,
                                        "circle-3", 6,
                                        "circle-3", 7,
                                        "circle-3", 8,
                                        "circle-3", 9,
                                        "circle-2", 10,
                                        "circle-2", 11,
                                        "circle-2", 12,
                                        "circle-2", 13,
                                        "circle-2", 14,
                                        "circle-2", 15,
                                        "circle-1"
                                    ]
                                }
                            }} />
                            <Layer {...{
                                id: "bead_block-line",
                                source: "bead_block",
                                type: "line",
                                paint: {
                                    "line-color": selection_color,
                                    "line-width": 2
                                }
                            }} />
                        </Source>

                    <HoverInfo />

                    <div className={"mapboxgl-ctrl-top-left"}>
                        <NavigationControl position="top-left" />
                        <FullscreenControl position="top-left" />
                        <GeolocateControl position="top-left" />
                        <ScaleControl unit="imperial" />
                    </div>

                    {mapZoom < MIN_ZOOM_LEVEL && (
                        <animated.div style={props} className={style["zoom-message"]}>Zoom in further to view and filter data</animated.div>
                    )}
                    {mapZoom >= MIN_ZOOM_LEVEL && (
                        <MapLegend title={filterState.colorVariable} category={fillColor} />
                    )}


                </Map>

                {selected_features.length > 0 && (
                    <button className={"detail-button bottom"}
                            onClick={(evt) => {
                                const detailPanel = window.document.getElementById("detail");
                                if (detailPanel !== null) {
                                    setTimeout(() => {
                                        detailPanel
                                            .style.display = "block";
                                    }, 233);
                                const infoWrapper = window.document.getElementById("info-wrapper");
                                if (infoWrapper !== null) {
                                    infoWrapper
                                        .style.paddingTop = "0px";
                                    }
                                }
                            } }>
                        {/*<a href="#detail">*/}
                            Detailed Info
                            <svg viewBox="0 0 22 14" aria-hidden="true"><polygon points="18.8743237 0 22 3.62676411 10.6828079 14 0 3.57495046 3.2339044 0.0505492411 10.7824379 7.41694926"></polygon></svg>
                        {/*</a>*/}
                    </button>
                )}

            </div>
        ) :
            <div className={style["map-wrapper"]}></div>
    );
}

export default GlMap;
