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