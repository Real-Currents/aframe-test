import React from "react";
import { LayerProps, SourceProps, MapStyle } from "react-map-gl";
import IntrinsicAttributes = React.JSX.IntrinsicAttributes;
import { colors } from '../utils/colors';
// import MAP_STYLE from './mapbox_style.json';
import MAP_STYLE from '../../mapbox/styles/ruralinno/cl010e7b7001p15pe3l0306hv/style.json';

// For more information on data-driven styles, see https://www.mapbox.com/help/gl-dds-ref/

// Make a copy of the main basemap style
export const mapboxStyle: MapStyle = ({
    ...MAP_STYLE
}) as MapStyle;

export type MapboxSourceLayerStyles = {
    sources: [(IntrinsicAttributes & SourceProps)];
    layers: [(IntrinsicAttributes & LayerProps)];
};

export const isp_footprint_fill: MapboxSourceLayerStyles = {
    "sources": [{
        "id": "isp_footprint",
        "type": "vector",
        "url": "mapbox://ruralinno.isp_states"
    }],
    "layers": [{
        "id": "isp_footprint.style_fill",
        "source": "proj_beadisp_states",
        "source-layer": "proj_beadisp_states",
        "type": "fill",
        "paint": {
            "fill-color": "black",
            "fill-opacity": [
                "interpolate", ["linear"],
                ["zoom"],
                0, 0.2,
                8, 0.2,
                9, 0.1,
                10, 0.1,
                18, 0.05
            ]
        }
    }]
};

export const isp_footprint_line: MapboxSourceLayerStyles = {
    "sources": [{
        "id": "isp_footprint",
        "type": "vector",
        "url": "mapbox://ruralinno.isp_states"
    }],
    "layers": [{
        "id": "isp_footprint.style_line",
        "source": "proj_beadisp_states",
        "source-layer": "proj_beadisp_states",
        "type": "line",
        "paint": {
            "line-color": "black",
            "line-width": 1,
            "line-opacity": [
                "interpolate", ["linear"],
                ["zoom"],
                0, 1,
                8, 1,
                9, 0.5,
                10, 0.3,
                18, 0.1
            ]
        }
    }]
};

export const bead_dev: MapboxSourceLayerStyles = {
    "sources": [{
        "id": "bead_dev",
        "type": "vector",
        "url": "mapbox://ruralinno.bead_blockv1b"
    }],
    "layers": [{
            "id": "bead_dev.style",
            "source": "bead_dev",
            "source-layer": "proj_beadbead_blockv1b",
            "type": "fill",
            "paint": {
                // "fill-color": "#0080ff", // blue color fill
                "fill-color": [
                    'case',
                    ['boolean', ['feature-state', 'hover'], true],
                    'rgba(255, 255, 255, 0.5)',
                    [
                        "match", ["get", "bead_category"],
                        ...((obj) => {
                            const array = [];
                            for (let k in obj) {
                                if (obj.hasOwnProperty(k)) {
                                    let category = "Not Reported";
                                    if (k === "served_area") {
                                        category = ("Served");
                                    } else if (k === "underserved_area") {
                                        category = ("Underserved");
                                    } else if (k === "unserved_area") {
                                        category = ("Unserved");
                                    } else if (k === "not_reported") {
                                        category = ("Not Reported");
                                    } else break;
                                    array.push(category);
                                    array.push(obj[k]);
                                    console.log(`${category}:  ${obj[k]}`);
                                }
                            }
                            return array;
                        })(colors["legend_colors"]["bb_bead_categories"]),
                        colors["legend_colors"]["bb_bead_categories"]["default"]
                    ]
                ],
                // "fill-opacity": 0.25,
                "fill-opacity": [
                    "interpolate", ["linear"],
                    ["zoom"],
                    0, 0,
                    8, 0.01,
                    9, 0.25,
                    10, 0.5,
                    11, 0.75,
                    12, 1.0,
                    17, 1.0,
                    18, 0.05
                ],
                "fill-pattern": "circle-1"
            },
        },
    ]
};

// Work-around:
//   Source has 2 element(s) but target allows only 1.
bead_dev.layers.push({
     "id": "bead_dev.style_line",
     "source": "bead_dev",
     "source-layer": "proj_beadvt_test3",
     "type": "line",
     "paint": {
         "line-color": "red", // Set the color of the border
         "line-width": 4 // Set the width of the border
     }
 });
//   "Property 'generateId' does not exist on type 'IntrinsicAttributes & SourceProps'."
(bead_dev.sources[0] as any) !["generateId"] = true;

export const bb_tr_100_20: MapboxSourceLayerStyles = {
    "sources": [{
        "id": "bb_tr_100_20",
        "type": "vector",
        "url": "mapbox://ruralinno.bb_map_tr_2022decareav3"
    }],
    "layers": [{
        "id": "bb_tr_100_20.style",
        "source": "bb_tr_100_20",
        "source-layer": "sch_broadbandbb_map_tr_category_2022decareav3e",
        "type": "fill",
        "paint": {
            // "fill-color": "#0080ff", // blue color fill
            "fill-color": [
                'case',
                ['boolean', ['feature-state', 'hover'], false],
                'rgba(255, 255, 255, 0.5)',
                [
                    "match", ["get", "category"], // "bl_100_20_area"],
                    // "Served", "rgba(19, 3, 50, 0.5)",
                    // "Underserved", "rgba(118, 88, 162, 0.75)",
                    // "Unserved", "rgba(203, 190, 220, 0.85)",
                    // "Not Reported", "rgba(105, 105, 105, 0)",
                    ...((obj) => {
                        const array = [];
                        for (let k in obj) {
                            if (obj.hasOwnProperty(k)) {
                                let category = "Not Reported";
                                if (k === "served_area") {
                                    category = ("Served");
                                } else if (k === "underserved_area") {
                                    category = ("Underserved");
                                } else if (k === "unserved_area") {
                                    category = ("Unserved");
                                } else if (k === "not_reported") {
                                    category = ("Not Reported");
                                } else break;
                                array.push(category);
                                array.push(obj[k]);
                                console.log(`${category}:  ${obj[k]}`);
                            }
                        }
                        return array;
                    })(colors["legend_colors"]["bb_bead_categories"]),
                    // "rgba(105, 105, 105, 0)",
                    colors["legend_colors"]["bb_bead_categories"]["default"]
                ]
            ],
            // "fill-opacity": 0.25,
            "fill-opacity": [
                "interpolate", ["linear"],
                ["zoom"],
                0, 0,
                8, 0.01,
                9, 0.25,
                10, 0.5,
                11, 0.5,
                12, 0.25,
                // 15, 1.0,
                // 18, 0.05
            ]
        },
    }]
};

// Work-around:
//   "Property 'generateId' does not exist on type 'IntrinsicAttributes & SourceProps'."
(bb_tr_100_20.sources[0] as any) !["generateId"] = true;

export const contourStyle: IntrinsicAttributes & LayerProps = {
    "id": "terrain-data",
    "source": "mapbox-terrain",
    "source-layer": "contour",
    "type": "line",
    "paint": {
        "line-color": "#26535c",
        "line-opacity": [
            "interpolate",
            [
                "linear"
            ],
            [
                "zoom"
            ],
            0,
            0,
            11,
            0.05,
            22,
            0.25
        ],
        "line-width": 1
    }
};