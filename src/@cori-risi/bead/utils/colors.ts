export const colors = {
    "legend_colors": {
        "bb_bead_categories": {
            "served_area": "rgba(0, 131, 93, 0.4)",
            "underserved_area": "rgba(255, 228, 115, 0.4)",
            "unserved_area": "rgba(177, 26, 0, 0.4)",
            "not_reported": "rgba(0, 0, 0, 0.25)",
            "default": "rgba(0, 0, 0, 0.25)"
        }
    }
};

export const colors_excludeDSL = {
  "legend_colors": {
    "bb_bead_categories": {
      "served_area": "rgba(9, 99, 73, 0.4)",
      "underserved_area": "rgba(217, 178, 17, 0.4)",
      "unserved_area": "rgba(231, 79, 42, 0.4)",
      "not_reported": "rgba(0, 0, 0, 0.25)",
      "default": "rgba(0, 0, 0, 0.25)"
    }
  }
};


export function getBEADColor(bead_category: string): string {
    
    if (bead_category === "Served") {
        return colors["legend_colors"]["bb_bead_categories"]["served_area"];
    }

    if (bead_category === "Underserved") {
        return colors["legend_colors"]["bb_bead_categories"]["underserved_area"];
    }

    if (bead_category === "Unserved") {
        return colors["legend_colors"]["bb_bead_categories"]["unserved_area"];
    }

    return colors["legend_colors"]["bb_bead_categories"]["not_reported"];
}

export function getFillColor(color_scheme: string, excludeDSL: boolean): any {  

  if (color_scheme === "BEAD service level") {

    let color_palette = colors;
    let category_variable = "bead_category";
    if (excludeDSL === true) {
      color_palette = colors_excludeDSL;
      category_variable = "bead_category_dsl_excluded";
    }

    return [
      "match", ["get", category_variable],
      "Served", color_palette["legend_colors"]["bb_bead_categories"]["served_area"],
      "Underserved", color_palette["legend_colors"]["bb_bead_categories"]["underserved_area"],
      "Unserved", color_palette["legend_colors"]["bb_bead_categories"]["unserved_area"],
      "Not Reported", color_palette["legend_colors"]["bb_bead_categories"]["not_reported"],
      color_palette["legend_colors"]["bb_bead_categories"]["default"]
    ];
  }

  if (color_scheme === "ISP count") {

    return [
        'interpolate',
        ['linear'],
        ["get", "cnt_isp"],
            0,
            "rgba(0, 0, 0, 0.25)",
            1,
            "rgba(163, 226, 181, 0.7)",
            2,
            "rgba(125, 179, 149, 0.7)",
            4,
            "rgba(99, 147, 127, 0.7)",
            6,
            "rgba(73, 115, 105, 0.7)",
            8,
            "rgba(48, 84, 84, 0.7)",
            10,
            "rgba(22, 52, 62, 0.7)"
    ]
  }

  if (color_scheme === "Total locations") {

    return [
        'interpolate',
        ['linear'],
        ['get', 'cnt_total_locations'],
        0,
        "rgba(0, 0, 0, 0.25)",
        1,
        'rgba(22, 52, 62, 0.5)',
        25,
        'rgba(93, 139, 122, 0.5)',
        100, // The max value is 1015, but its rare so cap the scale at 100
        'rgba(163, 226, 181, 0.5)'
    ]

  }

  return "red";
                        
}