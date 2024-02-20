import React, {useEffect, useState} from 'react';
import MUIDataTable from "mui-datatables";
import { CustomButton } from "./CustomInputs";
import { parseIspId, swapKeysValues } from "../utils/utils";
import "./styles/DetailedView.scss";
// import { CustomMUIDatatable } from "../../mui-datatables/src/components/CustomMUIDatatable";
// import TableViewCol from "../../mui-datatables/src/components/TableViewCol";
// import { Table, TableHead, TableBody, TableRow, TableCell } from "@aws-amplify/ui-react";
// import { Paper, TableContainer } from "@mui/material";

import isp_name_dict from "../data/isp_name_lookup_rev.json";

interface IspNameLookup {
    [key: string]: string;
}
const isp_name_lookup: IspNameLookup = isp_name_dict;

interface DetailedViewProps {
    detailedInfo: any[];
}

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

const DetailedView: React.FC<DetailedViewProps> = ({ detailedInfo }) => {

    const [ block_info, setBlockInfo ] = useState<string[][]>([]);
    const [ geoid_bl, setGeoid ] = useState<string>("")
    const [ isp_names, setISPNames ] = useState<string[]>([]);
    const [ award_applicants, setAwardApplicants ] = useState<string[]>([]);

    useEffect(() => {

        const block_info = detailedInfo
            .filter((d: any) => (d.properties.hasOwnProperty("type")
                    && d.properties["type"] === "geojson"
            ))
            .map((d: any) => {
                let props = [];
                if (d.properties.hasOwnProperty("geoid_bl")) {
                    setGeoid(d.properties["geoid_bl"]);
                    props.push("geoid_bl: " + d.properties["geoid_bl"]);
                }
                for (let p in d.properties) {
                    if (d.properties.hasOwnProperty(p)
                        && p !== "geoid_bl"
                        && p !== "type"
                    ) {
                        props.push(p + ": " + d.properties[p]);
                    }
                }
                console.log("Block properties detailedInfo:", props);
                return props;
            });

        setBlockInfo(block_info);

        let names: string[] = detailedInfo
            .filter((d: any) => d.properties.hasOwnProperty("type")
                && d.properties["type"] === "isp_tech"
                && d.properties.hasOwnProperty("new_alias")
            )
            .map((d: any) => (d.properties.hasOwnProperty("new_alias")) ?
                // "properties": {
                //     "type": "isp_tech",
                //     "isp_id": "156",
                //     "max_up": 1,
                //     "geoid_bl": "010539698023004",
                //     "max_down": 10,
                //     "new_alias": "AT&T Inc",
                //     "technology": "71"
                // }
                `[${d.properties["geoid_bl"]!}] ${d.properties["new_alias"]!}: ${d.properties["max_down"]!} down / ${d.properties["max_up"]!} up (${d.properties["technology"]!})` :
                "N/A"
            );

        console.log("ISP names in detailedInfo:", names);
        setISPNames(names);

        let applicants: string[] = detailedInfo
            .filter((d: any) => d.properties.hasOwnProperty("type")
                && d.properties["type"] === "award"
                && d.properties.hasOwnProperty("applicant")
            )
            .map((d: any) => (d.properties.hasOwnProperty("applicant")) ?
                d.properties["applicant"]! :
                "N/A"
            );

        console.log("RDOF applicants in detailedInfo:", applicants);
        setAwardApplicants(applicants);

    }, [ detailedInfo ]);

    return (
        <>
            <div id="detail" className={"detailed-view"}>

                <h4 className={"detailed-header"}>Broadband Information for Census Blocks in selection
                    <button value={"TODO: Cancel"} />
                    <button value={"TODO: See On Map"} />
                    <span className={"button-group"}>
                        <span className={"button-padding"}>
                            <CustomButton
                                className={"button"}
                                onClick={(evt) => console.log("TODO: Cancel")}
                                variant="outlined">
                                TODO: Cancel
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
                        // <TableContainer component={Paper}>
                        //     <Table>
                        //         <TableHead>
                        //             <TableRow>{
                        //                 block_columns.map((col) =>
                        //                     (col.toString().match(/name/) !== null) ?
                        //                         <TableCell align="left" key={col.toString()}>
                        //                             <h3>{getLabel(col, labels)}</h3></TableCell> :
                        //                         <TableCell key={col.toString()}>{getLabel(col, labels)}</TableCell>
                        //                 )
                        //             }</TableRow>
                        //         </TableHead>
                        //         <TableBody>
                        //             { (block_info.filter((b: any) =>  !!b && b !== null).length > 0) ?
                        //                 block_info
                        //                     .filter((b: any) => {
                        //                         // console.log("b: ", b);
                        //                         return !!b && b !== null
                        //                     })
                        //                     .map((b: string[]) => {
                        //                         // console.log(b);
                        //                         const geoid = b[0].split(":")[1];
                        //                         // console.log(geoid);
                        //                         return <TableRow key={geoid}>{
                        //                             (b.map((i: string) => {
                        //                                 const tuple = i.toString().split(":");
                        //                                 const key = tuple[0].trim();
                        //                                 const value = tuple[1].trim();
                        //                                 // console.log([ key, value ]);
                        //                                 return <TableCell key={key}>{value}</TableCell>
                        //                             }))
                        //                         }</TableRow>
                        //                     }) :
                        //                 (<TableRow key={"null-row"}>&nbsp;</TableRow>)
                        //             }
                        //         </TableBody>
                        //     </Table>
                        // </TableContainer>
                        <MUIDataTable
                            columns={block_columns.map((col) => getLabel(col, block_labels))}
                            data={[ ...block_info
                                .filter((b: any) => {
                                    // console.log("b: ", b);
                                    return !!b && b !== null
                                })
                                .map((b: string[]) => {
                                    const values: string[] = [];

                                    for (let col of block_columns) {
                                        b.map((i: string) => {
                                            const tuple = i.toString().split(":");
                                            const key = tuple[0].toString().trim();

                                            if (col === key) {
                                                const value = (key === "isp_id") ?
                                                    // tuple[1].toString().trim()
                                                    //     .replace("{", "")
                                                    //     .replace("}", "")
                                                    //     .split(",")
                                                    //     .map((id) =>
                                                            parseIspId(tuple[1].toString().trim(), isp_name_lookup_rev)
                                                    //     )
                                                    :
                                                    tuple[1].trim();
                                                console.log([key, value]);
                                                values.push(value);
                                            }
                                        });
                                    }

                                    return values;
                                })
                            ]}
                            options={{
                                "filterType": "checkbox"
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
                        <p>Select a block on the map to view ACS data for the relevant Census Tract(s)<br/></p> :

                        <MUIDataTable
                            columns={dt_columns}
                            data={dt_data}
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
                                }
                            }}
                            title={"TODO: Get ACS data for the relevant Census Tract(s)"}
                        />
                }

            </div>
        </>
    );
}

export default DetailedView;
