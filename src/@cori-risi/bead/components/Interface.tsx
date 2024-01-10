import React, { useState} from 'react';
// import Radio from '@mui/material/Radio';
// import RadioGroup from '@mui/material/RadioGroup';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import FormControl from '@mui/material/FormControl';
// import FormLabel from '@mui/material/FormLabel';
// import Autocomplete from '@mui/material/Autocomplete';
// import TextField from '@mui/material/TextField';

import GlMap from './GlMap';
import Sidebar from './Sidebar';

import style from "./styles/Interface.module.css";

export type FilterProps = {
    bb_service: {
        served: boolean,
        underserved: boolean,
        unserved: boolean
    },
    isp_count: number[]
}

const Interface = () => {

    const [filter, setFilter] = useState<FilterProps>({
        bb_service:  {
            served: true,
            underserved: true,
            unserved: true
        },
        isp_count: [0, 10],
    });

    const handleFilterChange = (newFilter: FilterProps) => {
        setFilter(newFilter);
    };

    const MAPBOX_TOKEN =  typeof process.env.MAPBOX_TOKEN === 'string'? process.env.MAPBOX_TOKEN: '';

    return (
    <>
        <div className={style["interface"]}>
            <Sidebar<FilterProps> onFilterChange={handleFilterChange} filter={filter}  />
            <GlMap mapboxToken={MAPBOX_TOKEN} filter={filter} />
        </div>

        </>
    );

}

export default Interface;