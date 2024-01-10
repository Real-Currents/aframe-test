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

export function getFillColor(color_scheme: "BEAD category" | "ISP count"): any[] | string {  

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
            "match", ["get", "cnt_isp"],
            0, "pink",
            1, "#2F2CBA",
            2, "#58B4ED",
            3, "#f0cf48",
            4, "#FA804A",
            5, "#B11A00",
            6, "#B11A00",
            7, "#B11A00",
            8, "#B11A00",
            9, "#B11A00",
            10, "#B11A00",
            "dimgray"
        ]
  }

  return "red";
                        
}