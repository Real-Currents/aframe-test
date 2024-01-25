import React, { useState} from 'react';

import GlMap from './GlMap';
import Sidebar from './Sidebar';
import DetailedView from './DetailedView';

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
    counties: string[]
}

const maxWidthTrigger: number = 600;

const Interface = () => {

    const [filter, setFilter] = useState<FilterProps>({
        bb_service:  {
            served: true,
            underserved: true,
            unserved: true
        },
        isp_count: [0, 10],
        total_locations: [0, 500],
        isp_combos: [],
        counties: []
    });

    const [fillColor, setFillColor] = useState<any[]>(getFillColor("BEAD category"));
    const [multipleISP, setMultipleISP] = useState<string>("");
    const [isDrawerShowing, setDrawerShowing] = useState<boolean>(true);
    const [focusBlock, setFocusBlock] = useState<string>("");
    const [detailedInfo, setDetailedInfo] = useState<string[]>([]);

    const handleDetailedInfo = (newDetailedInfo: string) => {
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

    const MAPBOX_TOKEN =  typeof process.env.MAPBOX_TOKEN === 'string'? process.env.MAPBOX_TOKEN: '';

    const handleToggleDrawer = () => {
        setDrawerShowing(!isDrawerShowing);
    };    

    window.addEventListener('resize', function(event) {

        if (window.innerWidth > 600 && isDrawerShowing === false) {
          setDrawerShowing(true);
        }
    });    

    return (
    <>
        <div>
            <button className={style["open-button"]} onClick={handleToggleDrawer}>
                {isDrawerShowing ? "Hide filters" : "Show filters"}
            </button>
            <div className={style["map-interface"]}>
                <Sidebar<FilterProps> 
                    onFilterChange={handleFilterChange} 
                    onFillColorChange={handleFillColorChange} 
                    filter={filter} 
                    isShowing={isDrawerShowing} 
                />
                <GlMap 
                    mapboxToken={MAPBOX_TOKEN} 
                    filter={filter} 
                    fillColor={fillColor} 
                    onFocusBlockChange={handleFocusBlockClick}
                    onDetailedInfoChange={handleDetailedInfo}
                />              
            </div>
            <DetailedView detailedInfo={detailedInfo} />
        </div>

        </>
    );

}

export default Interface;