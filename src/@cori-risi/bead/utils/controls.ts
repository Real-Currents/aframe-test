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

export function getFillColor(color_scheme: string): any {  

  if (color_scheme === "BEAD category") {
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

  return "red";
                        
}