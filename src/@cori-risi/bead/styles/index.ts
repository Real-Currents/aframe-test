import React from "react";
import IntrinsicAttributes = React.JSX.IntrinsicAttributes;
import { LayerProps, SourceProps, MapStyle } from "react-map-gl";
import { colors } from '../utils/colors';
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


export const bead_dev: MapboxSourceLayerStyles = {
    "sources": [{
        "id": "bead_dev",
        "type": "vector",
        "url": "mapbox://ruralinno.bead_blocksv1"
    }],
    "layers": [{
            "id": "bead_dev.style",
            "source": "bead_dev",
            "source-layer": "proj_beadbead_blocksv1",
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
                    9, 0.05,
                    9.01, 0.25,
                    10, 0.5,
                    11, 0.75,
                    12, 0.75,
                    17, 0.75,
                    18, 0.5,
                    19, 0.25,
                    20, 0.05
                ]
            },
        },
    ]
};

// Work-around for "layers":
//   Source has 2 element(s) but target allows only 1.
(bead_dev.layers as any[]).push({
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

export const bead_merged_tr: MapboxSourceLayerStyles = {
    "sources": [{
        "id": "bead_merged_tr",
        "type": "vector",
        "url": "mapbox://ruralinno.eligibility_tr"
    }],
    "layers": [{
        "id": "bead_merged_tr.style",
        "source": "bead_merged_tr",
        "source-layer": "proj_beadeligibility_tr",
        "type": "fill",
        "paint": {
            // "fill-color": "#0080ff", // blue color fill
            "fill-color": [
                'case',
                ['boolean', ['feature-state', 'hover'], false],
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
                    // "rgba(105, 105, 105, 0)",
                    colors["legend_colors"]["bb_bead_categories"]["default"]
                ]
            ],
            // "fill-opacity": 1.0,
            "fill-opacity": [
                "interpolate", ["linear"],
                ["zoom"],
                0, 0.0,
                3, 0.0,
                4, 0.05,
                5, 0.5,
                7, 0.75,
                9, 0.75,
                9.01, 0.05,
                10, 0.0,
            ]
        },
    }]
};

// Work-around:
//   Source has 2 element(s) but target allows only 1.
(bead_merged_tr.layers as any[]).push({
    "id": "bead_merged_tr.style",
    "source": "bead_merged_tr",
    "source-layer": "proj_beadeligibility_tr",
    "type": "fill",
    "paint": {
        // "fill-color": "#0080ff", // blue color fill
        "fill-color": [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            'rgba(255, 255, 255, 0.5)',
            [
                'interpolate',
                ['linear'],
                ['get', 'cnt_total_locations'],
                0,
                "rgba(0, 0, 0, 0.25)",
                1,
                'rgba(22, 52, 62, 0.5)',
                100,
                'rgba(93, 139, 122, 0.5)',
                1000,
                'rgba(163, 226, 181, 0.5)'
            ]
        ],
        // "fill-opacity": 1.0,
        "fill-opacity": [
            "interpolate", ["linear"],
            ["zoom"],
            0, 0.0,
            3, 0.0,
            4, 0.05,
            5, 0.5,
            7, 0.75,
            9, 0.75,
            9.01, 0.05,
            10, 0.0,
        ]
    },
});
//   "Property 'generateId' does not exist on type 'IntrinsicAttributes & SourceProps'."
(bead_merged_tr.sources[0] as any) !["generateId"] = true;


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
        }
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