import React, { useState} from 'react';

import GlMap from './GlMap';
import Sidebar from './Sidebar';

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
    isp_combos: string[]
}

const Interface = () => {

    const [filter, setFilter] = useState<FilterProps>({
        bb_service:  {
            served: true,
            underserved: true,
            unserved: true
        },
        isp_count: [0, 10],
        total_locations: [0, 500],
        isp_combos: []
    });

    const [fillColor, setFillColor] = useState<any[]>(getFillColor("BEAD category"));
    const [multipleISP, setMultipleISP] = useState<string>("");

    const handleFillColorChange = (newFillColor: any[]) => {
        setFillColor(newFillColor);
    };

    const handleFilterChange = (newFilter: FilterProps) => {
        setFilter(newFilter);
    };

    const MAPBOX_TOKEN =  typeof process.env.MAPBOX_TOKEN === 'string'? process.env.MAPBOX_TOKEN: '';

    return (
    <>
        <div className={style["interface"]}>
            <Sidebar<FilterProps> onFilterChange={handleFilterChange} onFillColorChange={handleFillColorChange} filter={filter}  />
            <GlMap mapboxToken={MAPBOX_TOKEN} filter={filter} fillColor={fillColor} />
        </div>

        </>
    );

}

export default Interface;