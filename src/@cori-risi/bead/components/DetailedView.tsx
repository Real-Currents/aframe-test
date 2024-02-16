import React, {useEffect, useState} from 'react';
import "./styles/DetailedView.scss";
import {CustomButton, CustomIconButton} from "./CustomInputs";
// import TuneIcon from "@mui/icons-material/Tune";

interface DetailedViewProps {
    detailedInfo: any[];
}

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
                d.properties["new_alias"]! :
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
                            {/*<CustomIconButton*/}
                            {/*    className={style["icon-button"]}*/}
                            {/*    onClick={(evt) => console.log("TODO: Cancel")}*/}
                            {/*>*/}
                            {/*    <TuneIcon />*/}
                            {/*</CustomIconButton>*/}
                        </span>
                        <span className={"button-padding"}>
                            <CustomButton
                                className={"affirmative button"}
                                onClick={(evt) => console.log("TODO: See on map")}
                                variant="outlined">
                                TODO: See On Map
                            </CustomButton>
                            {/*<CustomIconButton*/}
                            {/*    className={style["icon-button"]}*/}
                            {/*    onClick={(evt) => console.log("TODO: See On Map")}*/}
                            {/*>*/}
                            {/*    <TuneIcon />*/}
                            {/*</CustomIconButton>*/}
                        </span>
                    </span>
                </h4>
                <hr />
                {
                    (block_info.length === 0 )?
                        <p>Select a block on the map to view detailed Broadband info<br /></p> :
                        block_info
                            .filter((b: any) => {
                                console.log("b: ", b);
                                return !!b && b !== null
                            })
                            .map((b: string[]) => {
                                if (!!b && b !== null) {
                                    console.log(b);
                                    // TODO <row>... in a table
                                    return (b.map((i: string) => (
                                        // TODO <cell>... in row
                                        <p key={i.toString().split(":")[0]}
                                           style={{"display": "inline-block", "margin": "0.5em 1em 0.5em 0"}}>
                                            {i}</p>
                                    )));
                                }
                            })
                }
                <br />
                <h5>Internet Service Providers</h5>
                <p>{
                    (isp_names.length === 0) ? "N/A" : isp_names.join(", ")
                }</p>
                <br />
                <h5>Federal Funding Awards</h5>
                <p>{
                    (award_applicants.length === 0) ? "N/A" : award_applicants.join(", ")
                }</p>
                <br />
            </div>
        </>
    );
}

export default DetailedView;
