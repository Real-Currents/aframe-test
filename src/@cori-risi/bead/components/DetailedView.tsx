import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import MUIDataTable from "mui-datatables";
import { FeatureCollection } from "geojson";
import GeoJSONFeature from "maplibre-gl";
import { MapRef } from "react-map-gl";
import { CustomButton } from "./CustomInputs";
import { selectMapSelection, setMapSelection } from "../features";
import { IspNameLookup } from "../app/models";

import { parseIspId, swapKeysValues, reduceBBServiceBlockInfo } from "../../utils/utils";
import { 
    acs_columns, acs_labels, block_labels, block_columns, isp_columns, isp_labels, 
    award_columns, award_labels  
} from '../../utils/constants';
import { PrettyTableInput, BlockLevelFeature } from '../../types';
import { jumpMapToFeature } from '../../utils/mapUtils';

import style from "./styles/DetailedView.module.css";

import PrettyTable from './PrettyTable';

import isp_name_dict from "../../data/isp_name_lookup_rev.json";
const isp_name_lookup: IspNameLookup = isp_name_dict;

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

    // Table variables
    const [ bbServiceSummary, setBBServiceSummary ] = useState<PrettyTableInput | undefined>(undefined);
    const [ countyGEOIDs, setCountyGEOIDs ] = useState<string[]>([]);

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

            const bb_service_summary = reduceBBServiceBlockInfo(block_info);
            setBBServiceSummary(bb_service_summary);
            
            
            const county_geoids: string[] = [...new Set(block_info.map(function(d: any) {
                if (d.hasOwnProperty("properties")) {
                    if (d.properties.hasOwnProperty("geoid_co")) {
                        return d.properties.geoid_co;
                    }
                }
            }))];
            setCountyGEOIDs(county_geoids);
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
            <div id="detail" className={style["detailed-view"]}
                 style={{ display: "none" }}>

                <button 
                    className={"detail-button top"}
                    onClick={showMap} 
                >
                    <svg viewBox="0 0 22 14" aria-hidden="true">
                        <polygon points="18.8743237 0 22 3.62676411 10.6828079 14 0 3.57495046 3.2339044 0.0505492411 10.7824379 7.41694926"></polygon>
                    </svg>
                    Broadband map
                </button>
                <div className={style['container']}>
                    <div className={style['header-wrapper']}>
                        <h3>
                            Broadband service, technology, and funding information for selected 
                            census blocks<sup>&dagger;</sup>
                        </h3>
                        <div>
                            <CustomButton
                                className={style["affirmative-button"]}
                                onClick={(evt) => {
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
                            <CustomButton
                                onClick={(evt) => {
                                    dispatch(setMapSelection({
                                        "block_features": [],
                                        "isp_tech_features": [],
                                        "award_features": [],
                                        "acs_features": []
                                    }));
                                }}
                                variant="outlined">
                                Clear selection
                            </CustomButton>
                        </div>
                    </div>                            
                    {
                        (
                            bbServiceSummary !== undefined? 
                                <PrettyTable data={bbServiceSummary} title={"Broadband service data"} subtitle={"For blocks in selection"} />: 
                                <></>
                        )
                    }
                    {
                        countyGEOIDs.length > 0 ?
                            countyGEOIDs.map((geoid, index) => (
                                <p>
                                    <a key={index} href={"https://broadband-county-summary.ruralinnovation.us/?geoid=" + geoid} target="_blank">
                                        Click here to view county data for the blocks in selection.
                                    </a>
                                </p>
                            ))
                        : <></>
                    }
                    {
                        (!(isp_info.length > 0))?
                            <p>Select blocks on the map to view reported broadband technology data<sup>&dagger;</sup></p> :
                            <div className={style['mui-table-wrapper']}>
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
                                                    let value = (b.properties[col] !== null && typeof b.properties[col].toString !== "undefined") ?
                                                        b.properties[col].toString().trim() : "N/A";
                                                    
                                                    if (col === "technology") {
                                                        if (value === "10") {
                                                            value = "Copper wire (DSL)";
                                                        }
                                                        if (value === "40") {
                                                            value = "Coaxial cable/HFC";
                                                        }
                                                        if (value === "50") {
                                                            value = "Optical Carrier/Fiber to the Premises";
                                                        }
                                                        if (value === "60") {
                                                            value = "Geostationary Satellite";
                                                        }
                                                        if (value === "61") {
                                                            value = "Non-geostationary Satellite";
                                                        }
                                                        if (value === "70") {
                                                            value = "Unlicensed Terrestrial Fixed Wireless";
                                                        }
                                                        if (value === "71") {
                                                            value = "Licensed Terrestrial Fixed Wireless";
                                                        }
                                                        if (value === "72") {
                                                            value = "Licensed-by-Rule Terrestrial Fixed Wireless";
                                                        }
                                                        if (value === "0") {
                                                            value = "Other technology";
                                                        }
                                                    }
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
                                    title={"Internet service providers by technology"}
                                />
                            </div>
                    }
                    {
                        (!(award_info.length > 0))?
                            <p>Select blocks on the map which have received prior federal funding to view detailed award data</p> :
                            <div className={style['mui-table-wrapper']}>
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
                                    title={"Federal funding award applicants by block"}
                                />
                            </div>
                    }
                    <div className={style['footnotes']}>
                        <div>
                            <p id="fcc-bdc-footnote">
                                &dagger; Based on analysis of Broadband Serviceable Locations (BSL) by census block, as 
                                reported to the Federal Communications Commission (FCC). The FCC has publicly released this 
                                data as <a href={"https://broadbandmap.fcc.gov/data-download/nationwide-data"} target={"_blank"}>BDC (Broadband Data Collection) Public Data</a>.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
