import React, {useEffect, useState} from 'react';
import style from "./styles/DetailedView.module.css";

interface DetailedViewProps {
    detailedInfo: any[];
}

const DetailedView: React.FC<DetailedViewProps> = ({ detailedInfo }) => {

    const [ isp_names, setISPNames ] = useState<string[]>([]);
    const [ award_applicants, setAwardApplicants ] = useState<string[]>([]);

    useEffect(() => {
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

        let applicants: string[] = detailedInfo
            .filter((d: any) => d.properties.hasOwnProperty("type")
                && d.properties["type"] === "award"
                && d.properties.hasOwnProperty("applicant")
            )
            .map((d: any) => (d.properties.hasOwnProperty("applicant")) ?
                d.properties["applicant"]! :
                "N/A"
            );

        console.log("ISP names in detailedInfo:", names);
        setISPNames(names);

        console.log("RDOF applicants in detailedInfo:", applicants);
        setAwardApplicants(applicants);

    }, [ detailedInfo ]);

    return (
        <>
            <div id="detail" className={style["detailed-view"]}>
                <h2>Detailed information</h2>
                <h3>Internet Service Providers</h3>
                <p>{
                    isp_names.length === 0? "Click a block to view detailed ISP info" : isp_names.join(", ")
                }</p>
                <h3>Federal Funding Awards</h3>
                <p>{
                    award_applicants.length === 0? "Click a block to view detailed Award info" : award_applicants.join(", ")
                }</p>
            </div>
        </>
    );
}

export default DetailedView;
