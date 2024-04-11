import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import MUIDataTable from "mui-datatables";
import { FeatureCollection } from "geojson";
import GeoJSONFeature from "maplibre-gl";
import { MapRef } from "react-map-gl";
import { CustomButton } from "./CustomInputs";
import { selectMapSelection, setMapSelection } from "../features";
import { IspNameLookup } from "../app/models";

import {
    // parseIspId,
    reduceBBServiceBlockInfo ,
    swapKeysValues
} from "../../utils";
import { 
    // acs_columns,
    // acs_labels,
    // block_labels,
    // block_columns,
    isp_columns,
    isp_labels,
    award_columns,
    award_labels
} from '../../utils/constants';
import { jumpMapToFeature } from '../../utils/mapUtils';
import { PrettyTableInput } from '../../types';

import style from "./styles/DetailedView.module.css";
import "./styles/DetailedView.scss";

import PrettyTable from './PrettyTable';

import county_name_geoid from '../../data/geoid_co_name_crosswalk.json';
import federal_awards_programs from '../../data/awards_programs.json';
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

    function goToFeatures (features: FeatureCollection<any>, map: MapRef) {
        console.log("Call jumpMapToFeature");

        jumpMapToFeature(map, features, null);
    }

    function getTechnologyLabel (value: any) {
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
                            census blocks<a href="#fcc-bdc-footnote" style={{textDecoration: "none"}}><sup>&dagger;</sup></a>
                        </h3>
                        <hr />
                    </div>                            
                    {
                        (
                            bbServiceSummary !== undefined?
                                <div className="block-summary">
                                    <PrettyTable data={bbServiceSummary} title={"Broadband service data"} subtitle={"For blocks in selection"} />
                                    { (block_info.length > 0) ? <div className="selection-controls">
                                        <CustomButton
                                            className={"affirmative-button"}
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
                                    </div> : <></> }
                                </div>
                                :
                                <></>
                        )
                    }

                    <div>
                        The blocks you've selected are located in the following counties. Click the link(s) 
                        below to view a data summary for the relevant county:<br/>
                        <ul>{
                        countyGEOIDs.length > 0 ?
                            countyGEOIDs.map((geoid, index) => (
                                <li key={index}>
                                    <a href={"https://broadband-county-summary.ruralinnovation.us/?geoid=" + geoid} target="_blank">
                                        {county_name_geoid.filter(d => d.id === geoid)[0].label}
                                    </a>
                                </li>
                            ))
                        : <></>
                        }</ul>
                    </div>
                    <br />

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
                                                        value = getTechnologyLabel(value);
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

                                            // TODO: Remove blocks from selection that are not
                                            //  associated with remaining isp tech records
                                            // ...

                                        },
                                        "rowsPerPage": 5,
                                        "rowsPerPageOptions": [ 5, 10, 25, 50]
                                    }}
                                    title={"Internet service providers by technology"}
                                />
                            </div>
                    }
                    <br />

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
                    <br />

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
