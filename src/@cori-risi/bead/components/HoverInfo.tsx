import React, {useEffect} from "react";
import { useSelector } from "react-redux";
import { format } from "d3-format";
import { getBEADColor } from "../utils/colors";
import { selectMapFilters, setMapFilters } from "../features";
import { FilterState, HoverInfoState } from "../models/index";
import { selectMapHover } from "../features";
import style from "./styles/GlMap.module.css";
import {
    formatBroadbandTechnology,
    parseIspId, swapKeysValues
} from "../utils/utils";
import isp_name_dict from "../data/isp_name_lookup_rev.json";

const percentFormat = (num: number | string) => {
    // console.log(parseFloat(num));
    if (parseFloat("" + num) === parseFloat("" + num)) {
        return format('.1%')(parseFloat("" + num));
    } else {
        return "N/A";
    }
}

export function HoverInfo () {

    const filterState: FilterState = useSelector(selectMapFilters);
    const hoverInfo: HoverInfoState = useSelector(selectMapHover);
    const ispNameLookup =  swapKeysValues(isp_name_dict);

    const getPctUnserved = (properties: any) => {
        // console.log("pct_served:", properties.pct_served);
        // console.log("Pct. unserved (<25/3):", (1-properties.pct_served));
        return (!!properties.pct_served || properties.pct_served === 0) ?
            percentFormat((1-properties.pct_served)) : "N/A";
    };

    const getPctUnderserved = (properties: any) => {
        // console.log("cnt_25_3:", properties.cnt_25_3);
        // console.log("cnt_total_locations:", properties.cnt_total_locations);
        // console.log("Pct un- and underserved (<100/20):", properties.cnt_25_3 / properties.cnt_total_locations);
        return percentFormat(properties.cnt_25_3 / properties.cnt_total_locations);
    };

    const getPctServed = (properties: any) => {
        // console.log("cnt_100_20:", properties.cnt_100_20);
        // console.log("cnt_total_locations:", properties.cnt_total_locations);
        // console.log("Pct served (>100/20):", properties.cnt_100_20 / properties.cnt_total_locations);
        return percentFormat(properties.cnt_100_20 / properties.cnt_total_locations);
    };

    // useEffect(() => {
    //     console.log("Updated hoverInfo:", hoverInfo);
    // }, [ hoverInfo ]);

    return <>{
        !filterState.disableSidebar && hoverInfo
        && hoverInfo.hasOwnProperty("x") && hoverInfo.x > 0
        && hoverInfo.hasOwnProperty("y") && hoverInfo.y > 0
        && hoverInfo.hasOwnProperty("feature")
        && hoverInfo.feature.hasOwnProperty("properties")
        && hoverInfo.feature.properties.hasOwnProperty("bead_category")
        && !!hoverInfo.feature.properties.bead_category
        && (
            <div className={style["tooltip"]} style={{left: hoverInfo.x, top: hoverInfo.y}}>
                <h5><span>BEAD status</span>: <span className={style["bead-category"]} style={{textDecorationColor: getBEADColor(hoverInfo.feature.properties.bead_category)}}>{hoverInfo.feature.properties.bead_category}</span></h5>
                <p><span>Census Block ID</span>: {hoverInfo.feature.properties.geoid_bl}</p>
                <div>
                    <div>
                        <p><b>Broadband access</b></p>
                        <table>
                            <tbody>
                            <tr>
                                <td>Locations</td>
                                <td>{hoverInfo.feature.properties.cnt_total_locations}</td>
                            </tr>
                            <tr>
                                <td>{"Pct. unserved (<25/3)"}</td>
                                <td>{getPctUnserved(hoverInfo.feature.properties)}</td>
                            </tr>
                            <tr>
                                <td>{"Pct un- and underserved (<100/20)"}</td>
                                <td>{getPctUnderserved(hoverInfo.feature.properties)}</td>
                            </tr>
                            <tr>
                                <td>{"Pct served (>100/20)"}</td>
                                <td>{getPctServed(hoverInfo.feature.properties)}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <p><b>Broadband technologies</b>: {formatBroadbandTechnology(
                            [
                                hoverInfo.feature.properties.has_coaxial_cable,
                                hoverInfo.feature.properties.has_copperwire,
                                hoverInfo.feature.properties.has_fiber,
                                hoverInfo.feature.properties.has_lbr_wireless,
                                hoverInfo.feature.properties.has_licensed_wireless
                            ]
                        )}
                        </p>
                        <p><b>Previous federal funding?</b> {hoverInfo.feature.properties.has_previous_funding? "Yes": "No"}</p>
                        <p><b>Internet service providers:</b> {hoverInfo.feature.properties.combo_isp_id ? parseIspId(hoverInfo.feature.properties.isp_id, ispNameLookup): "N/A"}</p>
                    </div>
                    <div>
                        <p><em>Click to view detailed census block information</em></p>
                    </div>
                </div>
            </div>
        )}
    </>
}