import React, { useState } from 'react';

import Navbar from './Navbar';
import GlMap from './GlMap';
import Sidebar from './Sidebar';
import WelcomeDialog from './WelcomeDialog';
import InfoPanel from "./InfoPanel";

import style from "./styles/Interface.module.css";

import { getFillColor } from '../utils/colors';

import isp_name_dict from './../data/isp_name_lookup_rev.json';
import isp_id_dict from './../data/isp_dict_latest.json';

import { swapKeysValues } from '../utils/utils';

interface IspIdLookup {
    [key: string]: string[];
}

interface IspNameLookup {
  [key: string]: string;
}
const isp_name_lookup: IspNameLookup = isp_name_dict;
const isp_name_lookup_rev = swapKeysValues(isp_name_lookup);

const isp_id_lookup: IspIdLookup = isp_id_dict;

const maxWidthTrigger: number = 600;

const Interface = () => {

    const [multipleISP, setMultipleISP] = useState < string > ("");
    const [isDrawerShowing, setDrawerShowing] = useState < boolean > (false);
    const [focusBlock, setFocusBlock] = useState < string > ("");
    const [detailedInfo, setDetailedInfo] = useState < any[] > ([]);
    const [colorVariable, setColorVariable] = useState < string > ("BEAD service level");
    const [fillColor, setFillColor] = useState < any[] > (getFillColor("BEAD service level", false));

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

    const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

    return ( 
        <>
        <div id="main-interface" className={style['interface']}>
            <Navbar />
            <div className={"main-wrapper"}
                 style={{position: "relative", top: 0, marginTop: "75px", minHeight: "calc(100vh - 75px)"}}>
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

            <InfoPanel />

        </div>

        </>
    );

}

export default Interface;