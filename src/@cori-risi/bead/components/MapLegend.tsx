import React from 'react';
import { format } from 'd3-format';
import InfoTooltip from "./InfoTooltip";
import style from "./styles/MapLegend.module.css";
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
            if ((i % 2) === 0) {
                legendItems.push(
                    <div className={style["legend-row"]} key={i}>
                        <div className={style["legend-box"]}
                             style={{
                                 backgroundColor: category[i+1]
                                     // .toString()
                                     // .replace("rgba", "rgb")
                                     // .replace(/,\s?[\d|\.]+\)/, ")")
                             }} />
                        <p>{category[i]}</p>
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
        <div style={category[0] === 'match'? {height: "205px"} : {height: "95px"}} className={style["map-legend"]}>
                <h5>{title}</h5>
                {category[0] === 'match' ? renderMatchLegend() : null}
                {category[0] === 'interpolate' ? renderInterpolateLegend() : null}
            </div> 
    </>
    );
}

export default MapLegend;

