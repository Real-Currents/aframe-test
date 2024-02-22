import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import MUIDataTable from "mui-datatables";
import { CustomButton } from "./CustomInputs";

import isp_name_dict from "../data/isp_name_lookup_rev.json";
import { selectMapSelection, setMapSelection } from "../features";
import { HoverInfoState } from "../models/index";
import { parseIspId, swapKeysValues } from "../utils/utils";
import "./styles/DetailedView.scss";
import GeoJSONFeature from "maplibre-gl";

interface IspNameLookup {
    [key: string]: string;
}
const isp_name_lookup: IspNameLookup = isp_name_dict;

const block_columns = [
    "geoid_bl",
    "geoid_tr",
    "geoid_co",
    "geoid_st",
    "cnt_isp",
    "isp_id",
    "cnt_25_3",
    "has_fiber",
    "cnt_100_20",
    "pct_served",
    "bl_25_3_area",
    "combo_isp_id",
    "bead_category",
    "bl_100_20_area",
    "has_copperwire",
    "only_water_flag",
    "has_lbr_wireless",
    "has_coaxial_cable",
    "cnt_total_locations",
    "has_previous_funding",
    "has_licensed_wireless"
];

const block_labels = {
    "geoid_bl": "Block ID",
    "isp_id": "ISPs in Block",
    "cnt_isp": "cnt_isp",
    "cnt_25_3": "cnt_25_3",
    "geoid_co": "County ID",
    "geoid_st": "State ID",
    "geoid_tr": "Tract ID",
    "has_fiber": "has_fiber",
    "cnt_100_20": "cnt_100_20",
    "pct_served": "pct_served",
    "bl_25_3_area": "bl_25_3_area",
    "combo_isp_id": "combo_isp_id",
    "bead_category": "bead_category",
    "bl_100_20_area": "bl_100_20_area",
    "has_copperwire": "has_copperwire",
    "only_water_flag": "only_water_flag",
    "has_lbr_wireless": "has_lbr_wireless",
    "has_coaxial_cable": "has_coaxial_cable",
    "cnt_total_locations": "cnt_total_locations",
    "has_previous_funding": "has_previous_funding",
    "has_licensed_wireless": "has_licensed_wireless"
};

const dt_columns = [
    "Name",
    "Company",
    "City",
    "State"
];

const dt_data = [
    ["Joe James", "Test Corp", "Yonkers", "NY"],
    ["John Walsh", "Test Corp", "Hartford", "CT"],
    ["Bob Herm", "Test Corp", "Tampa", "FL"],
    ["James Houston", "Test Corp", "Dallas", "TX"],
];

function getLabel (col: string, labels: any) {
    return (labels.hasOwnProperty(col)) ?
        labels[col].trim() : col.trim();
}

const isp_name_lookup_rev = swapKeysValues(isp_name_lookup);

export default function DetailedView () {

    const [ block_info, setBlockInfo ] = useState<GeoJSONFeature[]>([]);
    const [ geoid_bl, setGeoid ] = useState<string>("")
    const [ isp_names, setISPNames ] = useState<string[]>([]);
    const [ award_applicants, setAwardApplicants ] = useState<string[]>([]);

    const dispatch = useDispatch();
    const mapSelection = useSelector(selectMapSelection);

    useEffect(() => {

        console.log("mapSelection:", mapSelection);
        console.log("filter function:", typeof mapSelection.block_features.filter);

        if (mapSelection.hasOwnProperty("block_features")
            && typeof mapSelection.block_features.filter === "function"
        ) {

            const block_info = mapSelection.block_features
                .filter((d: any) => (d.hasOwnProperty("properties")
                    && d.properties.hasOwnProperty("type")
                    && d.properties["type"] === "geojson"
                ))
                // .map((d: any) => {
                //     let props = [];
                //     if (d.properties.hasOwnProperty("geoid_bl")) {
                //         setGeoid(d.properties["geoid_bl"]);
                //         props.push("geoid_bl: " + d.properties["geoid_bl"]);
                //     }
                //     for (let p in d.properties) {
                //         if (d.properties.hasOwnProperty(p)
                //             && p !== "geoid_bl"
                //             && p !== "type"
                //         ) {
                //             props.push(p + ": " + d.properties[p]);
                //         }
                //     }
                //     console.log("Block properties detailedInfo:", props);
                //     return props;
                // });

            setBlockInfo(block_info);
        } else {
            setBlockInfo([]);
        }

        // let names: string[] = detailedInfo
        //     .filter((d: any) => d.properties.hasOwnProperty("type")
        //         && d.properties["type"] === "isp_tech"
        //         && d.properties.hasOwnProperty("new_alias")
        //     )
        //     .map((d: any) => (d.properties.hasOwnProperty("new_alias")) ?
        //         // "properties": {
        //         //     "type": "isp_tech",
        //         //     "isp_id": "156",
        //         //     "max_up": 1,
        //         //     "geoid_bl": "010539698023004",
        //         //     "max_down": 10,
        //         //     "new_alias": "AT&T Inc",
        //         //     "technology": "71"
        //         // }
        //         `[${d.properties["geoid_bl"]!}] ${d.properties["new_alias"]!}: ${d.properties["max_down"]!} down / ${d.properties["max_up"]!} up (${d.properties["technology"]!})` :
        //         "N/A"
        //     );
        //
        // console.log("ISP names in detailedInfo:", names);
        // setISPNames(names);

        // let applicants: string[] = detailedInfo
        //     .filter((d: any) => d.properties.hasOwnProperty("type")
        //         && d.properties["type"] === "award"
        //         && d.properties.hasOwnProperty("applicant")
        //     )
        //     .map((d: any) => (d.properties.hasOwnProperty("applicant")) ?
        //         d.properties["applicant"]! :
        //         "N/A"
        //     );
        //
        // console.log("RDOF applicants in detailedInfo:", applicants);
        // setAwardApplicants(applicants);

    }, [ mapSelection ]);

    return (
        <>
            <div id="detail" className={"detailed-view"}
                 style={{ display: "none" }}>

                <button className={"detail-button top"}
                        onClick={(evt) => {
                            window.document.getElementById("info-wrapper")
                                .style.paddingTop = "calc(100vh - 75px)";
                            setTimeout(() => {
                                window.document.getElementById("detail")
                                    .style.display = "none";
                            }, 233);
                        }} >
                    {/*<a href="#main-interface">*/}
                        <svg viewBox="0 0 22 14" aria-hidden="true">
                            <polygon points="18.8743237 0 22 3.62676411 10.6828079 14 0 3.57495046 3.2339044 0.0505492411 10.7824379 7.41694926"></polygon>
                        </svg>
                        Broadband Map
                    {/*</a>*/}
                </button>
                <br />
                <br />
                <br />

                <h4 className={"detailed-header"}>Broadband Information for Census Blocks in selection
                    <button value={"TODO: Cancel"} />
                    <button value={"TODO: See On Map"} />
                    <span className={"button-group"}>
                        <span className={"button-padding"}>
                            <CustomButton
                                className={"button"}
                                onClick={(evt) => dispatch(setMapSelection({"block_features": []}))}
                                variant="outlined">
                                Cancel
                            </CustomButton>
                        </span>
                        <span className={"button-padding"}>
                            <CustomButton
                                className={"affirmative button"}
                                onClick={(evt) => console.log("TODO: See on map")}
                                variant="outlined">
                                TODO: See On Map
                            </CustomButton>
                        </span>
                    </span>
                </h4>
                <hr />

                {
                    (block_info.length === 0 )?
                        <p>Select a block on the map to view Broadband info<br /></p> :
                        <MUIDataTable
                            columns={block_columns.map((col) => getLabel(col, block_labels))}
                            data={[ ...block_info
                                .filter((b: any) => {
                                    // console.log("b: ", b);
                                    return !!b && b !== null && b.hasOwnProperty("properties")
                                })
                                .map((b: any) => {
                                    const values: string[] = [];

                                    for (let col of block_columns) {
                                        // b.map((i: string) => {
                                        if (b.properties.hasOwnProperty(col)
                                            && typeof b.properties[col] !== "undefined"
                                        ) {
                                            // const tuple = i.toString().split(":");
                                            // const key = tuple[0].toString().trim();
                                            // if (col === key) {
                                                const value = (col === "isp_id") ?
                                                    // tuple[1].toString().trim()
                                                    //     .replace("{", "")
                                                    //     .replace("}", "")
                                                    //     .split(",")
                                                    //     .map((id) =>
                                                    //         parseIspId(tuple[1].toString().trim(), isp_name_lookup_rev)
                                                    //     ) :
                                                    (!!b.properties[col]) ?
                                                        parseIspId(b.properties[col].toString().trim(), isp_name_lookup_rev) :
                                                        "N/A"
                                                    :
                                                    b.properties[col].toString().trim();
                                                // console.log([col, value]);
                                                values.push(value);
                                            // }
                                        }
                                        // });
                                    }

                                    return values;
                                })
                            ]}
                            options={{
                                "filterType": "checkbox",
                                "onRowsDelete": (rowsDeleted: { data: { index: number, dataIndex: number }[], lookup: { [dataIndex: number]: boolean } }, newTableData: any[]) => {
                                    console.log("Delete Row(s):", {
                                        rowsDeleted: {
                                            data: rowsDeleted.data,
                                            lookupIndex: rowsDeleted.lookup
                                        },
                                        newTableData: {
                                            ...newTableData
                                        }
                                    });

                                    const block_features: any = [];

                                    for (let d of newTableData) {
                                        if (!!d[0] && d[0].toString().match(/^\d{15}/)) {
                                            const geoid_bl = d[0].toString();
                                            if (mapSelection.hasOwnProperty("block_features")
                                                && typeof mapSelection.block_features.filter === "function"
                                            ) {
                                                mapSelection.block_features
                                                    .filter((f) => geoid_bl === f.properties.geoid_bl)
                                                    .map((f) => block_features.push(f));
                                            }
                                        }
                                    }

                                    dispatch(setMapSelection({
                                        ...mapSelection,
                                        block_features
                                    }));
                                }
                            }}
                            title={"Census Blocks"}
                        />
                }
                <br />

                <h5>Internet Service Providers</h5>
                <div>{
                    (isp_names.length === 0) ? "N/A" : isp_names.map((n, i) => <p key={`ISP-${i}`}>{n.toString().trim()}</p>)
                }</div>
                <br />

                <h5>Applicants Previously Awarded Federal Funding</h5>
                <div>{
                    (award_applicants.length === 0) ? "N/A" : award_applicants.map((a, i) => <p key={`Award-${i}`}>{a.toString().trim()}</p>)
                }</div>
                <br />

                <h4 className={"detailed-header"}>Demographics for Census Tracts in selection
                </h4>
                <hr />

                {
                    (block_info.length === 0) ?
                        <p>Select a block on the map to view ACS data for the relevant Census Tract(s)<br/></p>
                        :
                        <p>TODO: Get ACS data for the relevant Census Tract(s)</p>
                        // <MUIDataTable
                        //     columns={dt_columns}
                        //     data={dt_data}
                        //     options={{
                        //         "filterType": "checkbox"
                        //     }}
                        //     title={"TODO: Get ACS data for the relevant Census Tract(s)"}
                        // />
                }

            </div>
        </>
    );
}
