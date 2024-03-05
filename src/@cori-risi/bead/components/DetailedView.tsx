import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import MUIDataTable from "mui-datatables";
import bbox from '@turf/bbox';
import { Feature, FeatureCollection } from "geojson";
import { CustomButton } from "./CustomInputs";

import isp_name_dict from "../data/isp_name_lookup_rev.json";
import { selectMapSelection, setMapSelection } from "../features";
import { HoverInfoState } from "../models/index";
import { parseIspId, swapKeysValues } from "../utils/utils";
import "./styles/DetailedView.scss";
import GeoJSONFeature from "maplibre-gl";
import {MapRef} from "react-map-gl";
import { jumpMapToFeature } from '../utils/mapUtils';

interface IspNameLookup {
    [key: string]: string;
}
const isp_name_lookup: IspNameLookup = isp_name_dict;

// const dt_columns = [
//     "Name",
//     "Company",
//     "City",
//     "State"
// ];

// const dt_data = [
//     ["Joe James", "Test Corp", "Yonkers", "NY"],
//     ["John Walsh", "Test Corp", "Hartford", "CT"],
//     ["Bob Herm", "Test Corp", "Tampa", "FL"],
//     ["James Houston", "Test Corp", "Dallas", "TX"],
// ];

interface BlockLevelFeature {
    "properties": {
        [key: string]: string | number | boolean;
        "geoid_bl": string;
    };
}

const block_columns = [
    "geoid_bl",
    "geoid_tr",
    "geoid_co",
    "geoid_st",
    "bead_category",
    // "bl_100_20_area",
    // "bl_25_3_area",
    "cnt_total_locations",
    "cnt_25_3",
    "cnt_100_20",
    "isp_id",
    "cnt_isp",
    // "combo_isp_id",
    // "pct_served",
    "has_fiber",
    "has_coaxial_cable",
    "has_copperwire",
    "has_wireless",
    // "has_lbr_wireless",
    // "has_licensed_wireless",
    "has_previous_funding",
    // "only_water_flag",
];

const block_labels = {
    "geoid_bl": "Block ID",
    "geoid_co": "County ID",
    "geoid_st": "State ID",
    "geoid_tr": "Tract ID",
    "isp_id": "ISPs in Block",
    "cnt_isp": "cnt_isp",
    "cnt_total_locations": "cnt_total_locations",
    "cnt_100_20": "cnt_100_20",
    "cnt_25_3": "cnt_25_3",
    "pct_served": "pct_served",
    "bl_100_20_area": "bl_100_20_area",
    "bl_25_3_area": "bl_25_3_area",
    "combo_isp_id": "combo_isp_id",
    "bead_category": "bead_category",
    "has_fiber": "has_fiber",
    "has_coaxial_cable": "has_coaxial_cable",
    "has_copperwire": "has_copperwire",
    "has_previous_funding": "has_previous_funding",
    "has_wireless": "has_lbr_wireless",
    "only_water_flag": "only_water_flag"
};

const isp_columns = [
    "geoid_bl",
    "new_alias",
    "isp_id",
    "technology",
    "max_down",
    "max_up",
    "type"
];

const isp_labels = {
};

const award_columns = [
    "geoid_bl",
    "applicant",
    "latency",
    "tier",
    "authorized",
    "default",
    "geoid_co",
    "county",
    "state",
    "da_numbers",
    "frn",
    "sac",
    "winning_bi",
    "winning_bidder",
    "winning_bid_total_in_state",
    "number_of_locations_in_state",
    "type",
    "version"
];

const award_labels = {
};

const acs_columns = [
    "geoid_tr",
    // "geoid_bl",
    "year",
    "total_population",
    "total_households",
    "total_housing_units",
    "broadband_usage",
    "hh_using_broadband",
    "hh_w_computer",
    "share_w_computer",
    "hh_w_smartphone_only",
    "share_w_smartphone_only",
    "hh_wo_device",
    "share_wo_device",
];

const acs_labels = {
    "geoid_tr": "Tract ID",
    // "geoid_bl": "Block ID(s)",
    "year": "ACS Year",
    "total_population": "total_population",
    "total_households": "total_households",
    "total_housing_units": "total_housing_units",
    "broadband_usage": "broadband_usage",
    "hh_using_broadband": "hh_using_broadband",
    "hh_w_computer": "hh_w_computer",
    "share_w_computer": "share_w_computer",
    "hh_w_smartphone_only": "hh_w_smartphone_only",
    "share_w_smartphone_only": "share_w_smartphone_only",
    "hh_wo_device": "hh_wo_device",
    "share_wo_device": "share_wo_device",
};

function getLabel (col: string, labels: any) {
    return (labels.hasOwnProperty(col)) ?
        labels[col].trim() : col.trim();
}

const isp_name_lookup_rev = swapKeysValues(isp_name_lookup);

export default function DetailedView () {

    const dispatch = useDispatch();
    const mapSelection = useSelector(selectMapSelection);

    const [ block_info, setBlockInfo ] = useState<GeoJSONFeature[]>([]);
    const [ isp_info, setISPInfo ] = useState<GeoJSONFeature[]>([]);
    const [ award_info, setAwardInfo ] = useState<GeoJSONFeature[]>([]);
    const [ acs_info, setACSInfo ] = useState<GeoJSONFeature[]>([]);

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
                ));

            setBlockInfo(block_info);
        } else {
            setBlockInfo([]);
        }

        if (mapSelection.hasOwnProperty("isp_tech_features")
            && typeof mapSelection.isp_tech_features.filter === "function"
        ) {

            const isps = mapSelection.isp_tech_features
                .filter((d: any) => (d.hasOwnProperty("properties")
                    && d.properties.hasOwnProperty("type")
                    && d.properties["type"] === "isp_tech"
                ));

            setISPInfo(isps);
        } else {
            setISPInfo([]);
        }

        if (mapSelection.hasOwnProperty("award_features")
            && typeof mapSelection.award_features.filter === "function"
        ) {

            const awards = mapSelection.award_features
                .filter((d: any) => (d.hasOwnProperty("properties")
                    && d.properties.hasOwnProperty("type")
                    && d.properties["type"] === "award"
                ));

            setAwardInfo(awards);
        } else {
            setAwardInfo([]);
        }

        if (mapSelection.hasOwnProperty("acs_features")
            && typeof mapSelection.acs_features.filter === "function"
        ) {

            const acs = mapSelection.acs_features
                .filter((d: any) => (d.hasOwnProperty("properties")
                    && d.properties.hasOwnProperty("type")
                    && d.properties["type"] === "acs"
                ));

            setACSInfo(acs);
        } else {
            setACSInfo([]);
        }

    }, [ mapSelection ]);

    function showMap (evt: any) {
        const infoWrapper = window.document.getElementById("info-wrapper");
        if (infoWrapper !== null) {
            infoWrapper
                .style.paddingTop = "calc(100vh - 75px)";
            const detailPanel = window.document.getElementById("detail");
            if (detailPanel !== null) {
                setTimeout(() => {
                    detailPanel
                        .style.display = "none";
                }, 233);
            }
        }
    }

    function goToFeatures(features: FeatureCollection<any>, map: MapRef) {
        console.log("Call jumpMapToFeature");

        jumpMapToFeature(map, features, null);
    }

    return (
        <>
            <div id="detail" className={"detailed-view"}
                 style={{ display: "none" }}>

                <button className={"detail-button top"}
                        onClick={showMap} >
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
                    <span className={"button-group"}>
                        <span className={"button-padding"}>
                            <CustomButton
                                className={"button"}
                                onClick={(evt) => {
                                    dispatch(setMapSelection({
                                        "block_features": [],
                                        "isp_tech_features": [],
                                        "award_features": [],
                                        "acs_features": []
                                    }));
                                }}
                                variant="outlined">
                                Cancel
                            </CustomButton>
                        </span>
                        <span className={"button-padding"}>
                            <CustomButton
                                className={"affirmative button"}
                                onClick={(evt) => {
                                    console.log(block_info.length);
                                    if (block_info.length > 0) {
                                        const featureCollection = {
                                            "type": "FeatureCollection",
                                            "features": [
                                                ...block_info
                                            ]
                                        };
                                        goToFeatures((featureCollection as FeatureCollection<any>), (window as { [key: string]: any })["map"] as MapRef);
                                    }

                                    showMap(evt);
                                }}
                                variant="outlined">
                                See All On Map
                            </CustomButton>
                        </span>
                    </span>
                </h4>
                <hr />

                {
                    (!(block_info.length > 0))?
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
                                    const isp_tech_features: any = [];
                                    const award_features: any = [];
                                    const acs_features: any = [];

                                    for (let d of newTableData) {
                                        console.log("Still selected:", d);
                                        if (!!d[0] && d[0].toString().match(/^\d{15}/)) {
                                            const geoid_bl = d[0].toString();
                                            const geoid_tr = d[1].toString();
                                            if (mapSelection.hasOwnProperty("block_features")) {
                                                if (typeof mapSelection.block_features.filter === "function") {
                                                    mapSelection.block_features
                                                        .filter((f: BlockLevelFeature) => geoid_bl === f.properties.geoid_bl)
                                                        .map((f) => {
                                                            block_features.push(f)
                                                        });
                                                }
                                                if (typeof mapSelection.isp_tech_features.filter === "function") {
                                                    mapSelection.isp_tech_features
                                                        .filter((f: BlockLevelFeature) => geoid_bl === f.properties.geoid_bl)
                                                        .map((f) => {
                                                            isp_tech_features.push(f)
                                                        });
                                                }
                                                if (typeof mapSelection.award_features.filter === "function") {
                                                    mapSelection.award_features
                                                        .filter((f: BlockLevelFeature) => geoid_bl === f.properties.geoid_bl)
                                                        .map((f) => {
                                                            award_features.push(f)
                                                        });
                                                }
                                                if (typeof mapSelection.acs_features.filter === "function") {
                                                    mapSelection.acs_features
                                                        .filter((f: BlockLevelFeature) => geoid_tr === f.properties.geoid_tr)
                                                        .map((f) => {
                                                            acs_features.push(f)
                                                        });
                                                }
                                            }
                                        }
                                    }

                                    if (block_features.length < 1) {
                                        dispatch(setMapSelection({
                                            "block_features": [],
                                            "isp_tech_features": [],
                                            "award_features": [],
                                            "acs_features": []
                                        }));
                                    } else {
                                        dispatch(setMapSelection({
                                            ...mapSelection,
                                            block_features,
                                            isp_tech_features,
                                            // award_features, // <= 2020 block geoids will not match 2010 award geoids
                                            acs_features
                                        }));
                                    }
                                },
                                "rowsPerPage": 5,
                                "rowsPerPageOptions": [ 5, 10, 25, 50]
                            }}
                            title={"Census Blocks (BB)"}
                        />
                }
                <br />

                <h5>Internet Service Providers by Technology</h5>
                {
                    (!(isp_info.length > 0))?
                        <p>Select a block on the map to view Broadband info<br /></p> :
                        <MUIDataTable
                            columns={isp_columns.map((col) => getLabel(col, isp_labels))}
                            data={[ ...isp_info
                                .filter((b: any) => {
                                    // console.log("b: ", b);
                                    return !!b && b !== null && b.hasOwnProperty("properties")
                                })
                                .map((b: any) => {
                                    const values: string[] = [];

                                    for (let col of isp_columns) {
                                        // b.map((i: string) => {
                                        if (b.properties.hasOwnProperty(col)
                                            && typeof b.properties[col] !== "undefined"
                                        ) {
                                            // const tuple = i.toString().split(":");
                                            // const key = tuple[0].toString().trim();
                                            // if (col === key) {
                                            const value = (b.properties[col] !== null && typeof b.properties[col].toString !== "undefined") ?
                                                b.properties[col].toString().trim() : "N/A";
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
                                },
                                "rowsPerPage": 5,
                                "rowsPerPageOptions": [ 5, 10, 25, 50]
                            }}
                            title={"Internet Service Providers"}
                        />
                }
                <br />

                <h5>Federal Funding Award Applicants By Block</h5>
                {
                    (!(award_info.length > 0))?
                        <p>Select a block on the map to view Broadband info<br /></p> :
                        <MUIDataTable
                            columns={award_columns.map((col) => getLabel(col, award_labels))}
                            data={[ ...award_info
                                .filter((b: any) => {
                                    // console.log("b: ", b);
                                    return !!b && b !== null && b.hasOwnProperty("properties")
                                })
                                .map((b: any) => {
                                    const values: string[] = [];

                                    for (let col of award_columns) {
                                        // b.map((i: string) => {
                                        if (b.properties.hasOwnProperty(col)
                                            && typeof b.properties[col] !== "undefined"
                                        ) {
                                            // const tuple = i.toString().split(":");
                                            // const key = tuple[0].toString().trim();
                                            // if (col === key) {
                                            const value = (b.properties[col] !== null && typeof b.properties[col].toString !== "undefined") ?
                                                b.properties[col].toString().trim() : "N/A";
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
                                },
                                "rowsPerPage": 5,
                                "rowsPerPageOptions": [ 5, 10, 25, 50]
                            }}
                            title={"Federal Funding Applicants"}
                        />
                }
                <br />

                <h4 className={"detailed-header"}>Demographics for Census Tracts in selection
                </h4>
                <hr />

                {
                    (!(block_info.length > 0)) ?
                        <p>Select a block on the map to view ACS data for the relevant Census Tract(s)<br/></p> :
                        <MUIDataTable
                            columns={acs_columns.map((col) => getLabel(col, acs_labels))}
                            data={[ ...acs_info
                                .filter((b: any) => {
                                    // console.log("b: ", b);
                                    return !!b && b !== null && b.hasOwnProperty("properties")
                                })
                                .map((b: any) => {
                                    const values: string[] = [];

                                    for (let col of acs_columns) {
                                        // b.map((i: string) => {
                                        if (b.properties.hasOwnProperty(col)
                                            && typeof b.properties[col] !== "undefined"
                                        ) {
                                            // const tuple = i.toString().split(":");
                                            // const key = tuple[0].toString().trim();
                                            // if (col === key) {
                                            const value = (b.properties[col] !== null && typeof b.properties[col].toString !== "undefined") ?
                                                b.properties[col].toString().trim() : "N/A";
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
                                },
                                "rowsPerPage": 5,
                                "rowsPerPageOptions": [ 5, 10, 25, 50]
                            }}
                            title={"Census Tracts (ACS)"}
                        />
                }

            </div>
        </>
    );
}
