export function swapKeysValues(json: { [key: string]: string; } ): { [key: string]: string; } {
  var ret: { [key: string]: string }  = {};
  for(let key in json){
    ret[json[key]] = key;
  }
  return ret;
}

export function parseIspId(isp_ids: string, isp_name_lookup: { [key: string]: string } ): string {

    if (isp_ids === undefined) {
        return "N/A";
    }
    const isp_id_array = isp_ids.substring(1, isp_ids.length - 1).split(",");
    let isp_name_str = "";
    for (let i = 0; i < isp_id_array.length; i++) {
        let isp_name = isp_name_lookup[isp_id_array[i]];

        if (i === 0) {
            isp_name_str = isp_name;
        }
        else {
            isp_name_str = isp_name_str + ", " + isp_name;
        }
    }

    return isp_name_str;

}

export function formatBroadbandTechnology(bb_tech_presence: boolean[]): string {

    let tech_list: string[] = [];
    if (bb_tech_presence[0] === true) {
        tech_list.push("Coaxial cable");
    }
    if (bb_tech_presence[1] === true) {
        tech_list.push("Copper wire (DSL)");
    }
    if (bb_tech_presence[2] === true) {
        tech_list.push("Fiber");
    }
    if (bb_tech_presence[3] === true || bb_tech_presence[4] === true) {
        tech_list.push("LBR/Licensed wireless")
    }


    if (tech_list.length == 0) {
        return "None";
    }
    return tech_list.join(", ")

}