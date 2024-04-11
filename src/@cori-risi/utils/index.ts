import { PrettyTableInput, GeoJSONFeature } from "../types";
import county_name_geoid from "../data/geoid_co_name_crosswalk.json";
import federal_awards_programs from "../data/awards_programs.json";
import {FeatureCollection} from "geojson";
import {MapRef} from "react-map-gl";
import {jumpMapToFeature} from "./mapUtils.ts";

export function getLabel (col: string, labels: any) {
    return (labels.hasOwnProperty(col)) ?
        labels[col].trim() : col.trim();
}

export function getTableData (data: any, columns: string[]) {
    return data
        .filter((b: any) => {
            // console.log("b: ", b);
            return !!b && b !== null && b.hasOwnProperty("properties")
        })
        .map((b: any) => {
            const values: string[] = [];

            for (let col of columns) {

                if (b.properties.hasOwnProperty(col)
                    && typeof b.properties[col] !== "undefined"
                ) {

                    const value = (b.properties[col] !== null && typeof b.properties[col].toString !== "undefined") ?
                        (col === "geoid_co") ?
                            county_name_geoid
                                .filter((d) => b.properties[col].toString().trim() === d.id)
                                .map(d => d.label) :
                            (col === "program_id") ?
                                federal_awards_programs
                                    .filter((d) => parseInt(b.properties[col].toString().trim()) === d.program_id)
                                    .map(d => d.program_acronym || d.program_name) :
                                (col === "technology") ?
                                    getTechnologyLabel(b.properties[col].toString().trim()) :
                                    (col === "cnt_locations"
                                        || col === "max_down"
                                        || col === "max_up"
                                        || col === "maxdown"
                                        || col === "maxup"
                                        || col.match(/fund_(?:award|expended|grant|loan)/) !== null
                                    ) ?
                                        parseInt(b.properties[col].toString().trim()) :
                                        b.properties[col].toString().trim() : "N/A";

                    // console.log([col, value]);
                    values.push(value);

                }

            }

            return values;
        });
}

export function getTechnologyLabel (value: any) {
    return (value === "10") ?
        "Copper wire (DSL)" :
        (value === "40") ?
            "Coaxial cable/HFC" :
            (value === "50") ?
                "Optical Carrier/Fiber to the Premises" :
                (value === "60") ?
                    "Geostationary Satellite" :
                    (value === "61") ?
                        "Non-geostationary Satellite" :
                        (value === "70") ?
                            "Unlicensed Terrestrial Fixed Wireless" :
                            (value === "71") ?
                                "Licensed Terrestrial Fixed Wireless" :
                                (value === "72") ?
                                    "Licensed-by-Rule Terrestrial Fixed Wireless" :
                                    "Other technology";
}

// Convert from a list of ISP ids to their plain language names
export function parseIspId(isp_ids: string, isp_name_lookup: { [key: string]: string } ): string {

    if (isp_ids === undefined) {
        return "None";
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
        tech_list.push("Fixed wireless")
    }


    if (tech_list.length == 0) {
        return "None";
    }
    return tech_list.join(", ")

}

export function reduceBBServiceBlockInfo(block_info: GeoJSONFeature[]): PrettyTableInput {
    
    const blockInfoReducer = (accumulator: PrettyTableInput, currentValue: GeoJSONFeature): PrettyTableInput => {
        
        if (currentValue.hasOwnProperty('properties')) {

            if (currentValue.properties.has_previous_funding === true) {
                accumulator.has_previous_funding = true;
            }

            accumulator.cnt_total_locations += currentValue.properties.cnt_total_locations;
            accumulator.cnt_100_20 += currentValue.properties.cnt_100_20;
            accumulator.cnt_25_3 += currentValue.properties.cnt_25_3;

            return accumulator;
        }
        else {
            return accumulator;
        }
    };
      
    const bb_service_accumulator: PrettyTableInput = {
        cnt_total_locations: 0,
        cnt_100_20: 0,
        cnt_25_3: 0,
        has_previous_funding: false
    }
    
    return block_info.reduce(blockInfoReducer, bb_service_accumulator);

}

// Swap the keys and values in a dictionary
export function swapKeysValues(json: { [key: string]: string; } ): { [key: string]: string; } {
    var ret: { [key: string]: string }  = {};
    for(let key in json){
        ret[json[key]] = key;
    }
    return ret;
}

export function sum(...numbers: number[])  {
    return numbers.reduce((total, current) => total + current, 0);
}
