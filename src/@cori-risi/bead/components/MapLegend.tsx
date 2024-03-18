import React from 'react';
import { useSelector } from "react-redux";
import { FilterState, HoverInfoState } from "../app/models";
import { selectMapFilters, setMapFilters } from "../features";
import { format } from 'd3-format';
import InfoTooltip from "./InfoTooltip";
import style from "./styles/MapLegend.module.css";
import { beadDefinitions } from '../../utils/constants.ts';
import stripe_svg from "../assets/stripe-5.svg";

const numberFormat = format(',');

interface MapLegendProps {
    title: string,
        category: any
}

const MapLegend: React.FC < MapLegendProps > = ({ title, category }) => {

    const filterState: FilterState = useSelector(selectMapFilters);

    const continuous_legend_length = 5;

    const renderMatchLegend = () => {
        const legendItems = [];

        for (let i = 2; i < category.length-1; i++) {
            if ((i % 2) === 0) {
                legendItems.push(
                    <div className={style["legend-row"]} key={i}>
                        <div className={style["legend-box"]}
                             style={{
                                 backgroundColor: category[i] === "Not Reported" ? "rgba(0, 0, 0, 0.25)" : category[i+1]
                             }} >
                            {
                                category[i] === "Not Reported"? 
                                <div
                                    className={style["overlay-content"]}
                                    style={{background: "url(" + stripe_svg + ") repeat top left"}}
                                ></div>
                                : <></>
                            }
                        </div>
            
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
                <p>{numberFormat(category[4][3])}</p>
                <div 
                    className={style['interpolate-bar']} 
                    style={{"background": "linear-gradient(to right, " + category[4][4] + ", " + category[4][category[4].length-1] + ")"}} >
                </div>
                <p>{numberFormat(category[4][category[4].length-2])}+</p>
            </div>
        );
    };

    return ( 
    <>
        <div style={category.length > continuous_legend_length? {height: "auto"} : {height: "95px"}} className={style["map-legend"]}>
                <h5>{title}{filterState.excludeDSL && category[0] === 'match'? "*" :  ""}</h5>
                {category.length > continuous_legend_length ? renderMatchLegend() : null}
                {category.length <= continuous_legend_length ? renderInterpolateLegend() : null}
                <div>
                    {filterState.excludeDSL && category.length > continuous_legend_length? <div className={style["dsl-note"]}>*Counting all DSL-only locations as Underserved</div> :  <></>}
                </div>
            </div> 
    </>
    );
}

export default MapLegend;

