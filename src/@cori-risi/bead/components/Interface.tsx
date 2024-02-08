import React, { useState } from 'react';

import GlMap from './GlMap';
import Sidebar from './Sidebar';
import DetailedView from './DetailedView';
import Navbar from './Navbar';

import style from "./styles/Interface.module.css";

import { getFillColor } from './../utils/controls';

export type FilterProps = {
    bb_service: {
        served: boolean,
        underserved: boolean,
        unserved: boolean
    },
    isp_count: number[],
    total_locations: number[],
    isp_combos: string[],
    counties: string[],
    broadband_technology: string[],
    has_award: {
        yes: boolean,
        no: boolean
    }
}

const maxWidthTrigger: number = 600;

const Interface = () => {

    const [filter, setFilter] = useState < FilterProps > ({
        bb_service: {
            served: true,
            underserved: true,
            unserved: true
        },
        isp_count: [0, 10],
        total_locations: [0, 1015],
        isp_combos: [],
        counties: [],
        broadband_technology: [],
        has_award: {
            yes: true,
            no: true
        }
    });

    const [fillColor, setFillColor] = useState < any[] > (getFillColor("BEAD category"));
    const [multipleISP, setMultipleISP] = useState < string > ("");
    const [isDrawerShowing, setDrawerShowing] = useState < boolean > (true);
    const [focusBlock, setFocusBlock] = useState < string > ("");
    const [detailedInfo, setDetailedInfo] = useState < any[] > ([]);
    const [colorVariable, setColorVariable] = useState < string > ("BEAD category");

    const handleColorVariableChange = (newColorVariable: string) => {
        setColorVariable(newColorVariable);
    }

    const handleDetailedInfo = (newDetailedInfo: any[]) => {
        setDetailedInfo(newDetailedInfo);
    }

    const handleFocusBlockClick = (newFocusBlock: string) => {
        setFocusBlock(newFocusBlock);
    }

    const handleFillColorChange = (newFillColor: any[]) => {
        setFillColor(newFillColor);
    };

    const handleFilterChange = (newFilter: FilterProps) => {
        setFilter(newFilter);
    };

    const MAPBOX_TOKEN = typeof process.env.MAPBOX_TOKEN === 'string' ? process.env.MAPBOX_TOKEN : '';

    const handleToggleDrawer = () => {
        setDrawerShowing(!isDrawerShowing);
    };

    window.addEventListener('resize', function(event) {

        if (window.innerWidth > 600 && isDrawerShowing === false) {
            setDrawerShowing(true);
        }
    });

    return ( <
        >
        <div className={style['interface']}>
            <Navbar />
            <div style={{marginTop: "80px"}}>
            <button className={style["open-button"]} onClick={handleToggleDrawer}>
                {isDrawerShowing ? "Hide filters" : "Show filters"}
            </button>
            <div className={style["map-interface"]}>
                <Sidebar<FilterProps> 
                    onFilterChange={handleFilterChange} 
                    onFillColorChange={handleFillColorChange} 
                    onColorVariableChange={handleColorVariableChange}
                    filter={filter} 
                    isShowing={isDrawerShowing} 
                />
                <GlMap 
                    mapboxToken={MAPBOX_TOKEN} 
                    filter={filter} 
                    fillColor={fillColor}
                    colorVariable={colorVariable}
                    onFocusBlockChange={handleFocusBlockClick}
                    onDetailedInfoChange={handleDetailedInfo}
                />
            </div>
            </div>
            <DetailedView detailedInfo={detailedInfo} />
        </div>

        <
        />
    );

}

export default Interface;