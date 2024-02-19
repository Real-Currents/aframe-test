import React from 'react';
import style from "./styles/MapLegend.module.css";

import InfoTooltip from "./InfoTooltip";

import { format } from 'd3-format';
import { beadDefinitions } from '../utils/constants.ts';
const numberFormat = format(',');

interface MapLegendProps {
    title: string,
        category: any
}

const MapLegend: React.FC < MapLegendProps > = ({ title, category }) => {

    // console.log("category:", category);

    const renderMatchLegend = () => {
        const legendItems = [];

        for (let i = 2; i < category.length-1; i++) {
            if ((i % 2) === 0 && category[i] !== "Not Reported") {
                legendItems.push(
                    <div className={style["legend-row"]} key={i}>
                        <div style={{backgroundColor: category[i+1]}} className={style["legend-box"]}></div><p>{category[i]}</p>
                        <InfoTooltip text={beadDefinitions[category[i]]}/>
                    </div>
                );
            }
        }

        return legendItems;
    };

    const renderInterpolateLegend = () => {

        return (
            <div className={style['interpolate-wrapper']}>
                <p>{numberFormat(category[3])}</p>
                <div 
                    className={style['interpolate-bar']} 
                    style={{"background": "linear-gradient(to right, " + category[6] + ", " + category[category.length-1] + ")"}} >
                </div>
                <p>{numberFormat(category[category.length-2])}+</p>
            </div>
        );
    };

    return ( 
    <>
        <div style={category[0] === 'match'? {height: "170px"} : {height: "95px"}} className={style["map-legend"]}>
                <h5>{title}</h5>
                {category[0] === 'match' ? renderMatchLegend() : null}
                {category[0] === 'interpolate' ? renderInterpolateLegend() : null}
            </div> 
    </>
    );
}

export default MapLegend;

