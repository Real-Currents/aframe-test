import React, {useEffect, useState} from 'react';
import style from "./styles/DetailedView.module.css";

interface DetailedViewProps {
    detailedInfo: any[];
}

const DetailedView: React.FC<DetailedViewProps> = ({ detailedInfo }) => {

    const [ block_info, setBlockInfo ] = useState<string[]>([]);
    const [ geoid_bl, setGeoid ] = useState<string>("")
    const [ isp_names, setISPNames ] = useState<string[]>([]);
    const [ award_applicants, setAwardApplicants ] = useState<string[]>([]);

    useEffect(() => {
        detailedInfo
            .filter((d: any) => {
                if (d.properties.hasOwnProperty("type")
                    && d.properties["type"] === "geojson"
                ) {
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
                    setBlockInfo(props);
                    return d;
                }
            });

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
            <div id="detail" className={style["detailed-view"]}>
                <h4>Broadband Information for Census Block {geoid_bl}</h4>
                <hr />
                {
                    (block_info.length === 0 )?
                        "Click a block to view detailed block info" :
                        block_info.map((i: string) => {
                            console.log(i);
                            return  (<p key={i.toString().split(":")[0]}
                                        style={{"display": "inline-block", "margin": "0.5em 1em 0.5em 0"}} >
                                {i}</p>)
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
