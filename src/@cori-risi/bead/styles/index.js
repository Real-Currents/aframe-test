import MAP_STYLE from './mapbox_style.json';

export const CONTOUR_STYLE = {
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
      7,
      0.05,
      22,
      0.5
    ],
    "line-width": 1
  }
}

// For more information on data-driven styles, see https://www.mapbox.com/help/gl-dds-ref/

const colors = {
    "legend_colors": {
        "bb_bead_categories": {
            "served_area": "rgba(19, 3, 50, 0.5)",
            "underserved_area": "rgba(118, 88, 162, 0.75)",
            "unserved_area": "rgba(203, 190, 220, 0.85)",
            "not_reported": "rgba(105, 105, 105, 0)",
            "default": "rgba(105, 105, 105, 0)"
        }
    }
};

// Make a copy of the main basemap style
export const mapboxStyle = {
    ...MAP_STYLE,
};

// bb_map_tr_100_20_2022june (bb_tr_100_20)
export const bb_tr_100_20 = {
    "sources": [{
        "id": "bb_tr_100_20",
        "type": "vector",
        "url": "mapbox://ruralinno.bb_map_tr_2022decareav3", 
        "generateId": true
    }],
    "layers": [
        {
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
                        "match", ["get", "category" ], // "bl_100_20_area"],
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
                    "interpolate", [ "linear" ],
                    ["zoom"],
                    0, 0,
                    9, 0.01,
                    10, 1.0,
                    11, 1.0,
                    15, 1.0,
                    18, 0.05
                ]
            },
        }
    ]
};

export const contourStyle = {
    ...CONTOUR_STYLE
};
