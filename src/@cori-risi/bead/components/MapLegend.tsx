import React from 'react';
import { useSelector } from "react-redux";
import { FilterState, HoverInfoState } from "../models/index";
import { selectMapFilters, setMapFilters } from "../features";
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

    const filterState: FilterState = useSelector(selectMapFilters);

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
                        <InfoTooltip text={beadDefinitions[category[i]].toString()}/>
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
        <div style={category[0] === 'match'? {height: "auto"} : {height: "95px"}} className={style["map-legend"]}>
                <h5>{title}{filterState.excludeDSL && category[0] === 'match'? "*" :  ""}</h5>
                {category[0] === 'match' ? renderMatchLegend() : null}
                {category[0] === 'interpolate' ? renderInterpolateLegend() : null}
                <div>
                    {filterState.excludeDSL && category[0] === 'match'? <span>*Excluding DSL</span> :  <></>}
                </div>
            </div> 
    </>
    );
}

export default MapLegend;

