import React from 'react';
import style from "./styles/DetailedView.module.css";

interface DetailedViewProps {
    detailedInfo: string[];
}

const DetailedView: React.FC<DetailedViewProps> = ({ detailedInfo }) => {
    return (
        <>
            <div id="detail" className={style["detailed-view"]}>
                <h2>Detailed information</h2>
                <p>{detailedInfo.length === 0? "Click a block to view detailed info" : detailedInfo.join(", ")}</p>
            </div>
        </>
    );
}

export default DetailedView;
