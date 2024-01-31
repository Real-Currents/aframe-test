import React from 'react';
import style from "./styles/MapLegend.module.css";

import { format } from 'd3-format';
const numberFormat = format(',');

interface MapLegendProps {
    title: string,
        category: any
}

const MapLegend: React.FC < MapLegendProps > = ({ title, category }) => {

    const renderMatchLegend = () => {
        const legendItems = [];

        for (let i = 2; i < category.length-1; i++) {
            if ((i % 2) === 0 && category[i] !== "Not Reported") {
                legendItems.push(
                    <div className={style["legend-row"]} key={i}>
                        <div style={{backgroundColor: category[i+1]}} className={style["legend-box"]}></div><p>{category[i]}</p>
                    </div>
                );
            }
        }

        return legendItems;
    };

    const renderInterpolateLegend = () => {

        return (
            <div className={style['interpolate-wrapper']}>
                <div 
                    className={style['interpolate-bar']} 
                    style={{"background": "linear-gradient(to bottom, " + category[4] + ", " + category[category.length-1] + ")"}} >
                </div>
                <p className={style['interpolate-top-label']}>{numberFormat(category[3])}</p>
                <p className={style['interpolate-bottom-label']}>{numberFormat(category[category.length-2])}</p>
            </div>
        );
    };

    return ( 
    <>
        <div className={style["map-legend"]}>
                <h5>{title}</h5>
                {category[0] === 'match' ? renderMatchLegend() : null}
                {category[0] === 'interpolate' ? renderInterpolateLegend() : null}
            </div> 
    </>
    );
}

export default MapLegend;

