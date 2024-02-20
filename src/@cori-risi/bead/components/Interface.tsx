import React, { useState } from 'react';

import GlMap from './GlMap';
import Sidebar from './Sidebar';
import DetailedView from './DetailedView';
import Navbar from './Navbar';
import WelcomeDialog from './WelcomeDialog';

import style from "./styles/Interface.module.css";

import { getFillColor } from '../utils/colors';

import isp_name_dict from './../data/isp_name_lookup_rev.json';
import isp_id_dict from './../data/isp_dict_latest.json';

import { swapKeysValues } from '../utils/utils';

interface IspNameLookup {
  [key: string]: string;
}
const isp_name_lookup: IspNameLookup = isp_name_dict;
const isp_name_lookup_rev = swapKeysValues(isp_name_lookup);

interface IspIdLookup {
  [key: string]: string[];
}
const isp_id_lookup: IspIdLookup = isp_id_dict;

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
    has_previous_funding: {
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
        has_previous_funding: {
            yes: true,
            no: true
        }
    });

    const [fillColor, setFillColor] = useState < any[] > (getFillColor("BEAD service level"));
    const [multipleISP, setMultipleISP] = useState < string > ("");
    const [isDrawerShowing, setDrawerShowing] = useState < boolean > (true);
    const [focusBlock, setFocusBlock] = useState < string > ("");
    const [detailedInfo, setDetailedInfo] = useState < any[] > ([]);
    const [colorVariable, setColorVariable] = useState < string > ("BEAD service level");

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

    const handleToggleDrawer = () => {
        setDrawerShowing(!isDrawerShowing);
    };

    const MAPBOX_TOKEN = typeof process.env.MAPBOX_TOKEN === 'string' ? process.env.MAPBOX_TOKEN : '';

    return ( 
        <>
        <div className={style['interface']}>
            <Navbar 
                onToggleDrawer={handleToggleDrawer} 
                isDrawerShowing={isDrawerShowing}
            />
            <div style={{marginTop: "75px"}}>
            <WelcomeDialog />
            <div className={style["map-interface"]}>
                <Sidebar<FilterProps> 
                    onFilterChange={handleFilterChange} 
                    onFillColorChange={handleFillColorChange} 
                    onColorVariableChange={handleColorVariableChange}
                    filter={filter} 
                    isShowing={isDrawerShowing} 
                    ispIdLookup={isp_id_lookup}
                    ispNameLookup={isp_name_lookup}
                />
                <GlMap 
                    mapboxToken={MAPBOX_TOKEN} 
                    filter={filter} 
                    fillColor={fillColor}
                    colorVariable={colorVariable}
                    onFocusBlockChange={handleFocusBlockClick}
                    onDetailedInfoChange={handleDetailedInfo}
                    ispNameLookup={isp_name_lookup_rev}
                    isShowing={isDrawerShowing}
                />
            </div>
            </div>
            <DetailedView detailedInfo={detailedInfo} />
        </div>

        </>
    );

}

export default Interface;