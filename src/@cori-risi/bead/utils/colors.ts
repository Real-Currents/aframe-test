const colors = {
    "legend_colors": {
        "bb_bead_categories": {
            "served_area": "rgba(0, 131, 93, 0.4)",
            "underserved_area": "rgba(255, 228, 115, 0.4)",
            "unserved_area": "rgba(177, 26, 0, 0.4)",
            "not_reported": "rgba(105, 105, 105, 0)",
            "default": "rgba(105, 105, 105, 0)"
        }
    }
};

export function getBEADColor(bead_category: string): string {
    
    if (bead_category === "Served") {
        return "rgba(0, 131, 93)";
    }

    if (bead_category === "Underserved") {
        return "rgba(255, 228, 115)";
    }

    if (bead_category === "Unserved") {
        return "rgba(177, 26, 0)";
    }

    return "rgba(105, 105, 105)";
}

export function getFillColor(color_scheme: string): any {  

  if (color_scheme === "BEAD service level") {
    return [
      "match", ["get", "bead_category"],
      "Served", colors["legend_colors"]["bb_bead_categories"]["served_area"],
      "Underserved", colors["legend_colors"]["bb_bead_categories"]["underserved_area"],
      "Unserved", colors["legend_colors"]["bb_bead_categories"]["unserved_area"],
      "Not Reported", colors["legend_colors"]["bb_bead_categories"]["not_reported"],
      colors["legend_colors"]["bb_bead_categories"]["default"]
    ]
  }

  if (color_scheme === "ISP count") {

    return [
        'interpolate',
        ['linear'],
        ["get", "cnt_isp"],
            0,
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
        0, 'rgba(163, 226, 181, 0.7)',
        500, // The max value is 1015, but its rare so cap the scale at 500
        'rgba(22, 52, 62, 0.7)'
    ]

  }

  return "red";
                        
}