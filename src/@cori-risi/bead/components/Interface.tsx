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

const maxWidthTrigger: number = 600;

const Interface = () => {

    const [fillColor, setFillColor] = useState < any[] > (getFillColor("BEAD service level"));
    const [multipleISP, setMultipleISP] = useState < string > ("");
    const [isDrawerShowing, setDrawerShowing] = useState < boolean > (false);
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

    const handleToggleDrawer = () => {
        setDrawerShowing(!isDrawerShowing);
    };

    const MAPBOX_TOKEN = typeof process.env.MAPBOX_TOKEN === 'string' ? process.env.MAPBOX_TOKEN : '';

    return ( 
        <>
        <div className={style['interface']}>
            <Navbar />
            <div style={{marginTop: "75px"}}>
            <WelcomeDialog />
            <div className={style["map-interface"]}>
                <Sidebar />
                <GlMap
                    mapboxToken={MAPBOX_TOKEN}
                    // filter={filter}
                    // fillColor={fillColor}
                    // colorVariable={colorVariable}
                    // onFocusBlockChange={handleFocusBlockClick}
                    // onDetailedInfoChange={handleDetailedInfo}
                    // ispNameLookup={isp_name_lookup_rev}
                    // isShowing={isDrawerShowing}
                />
            </div>
            </div>
            <DetailedView detailedInfo={detailedInfo} />
        </div>

        </>
    );

}

export default Interface;