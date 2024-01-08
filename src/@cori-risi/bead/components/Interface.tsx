import React, { useState} from 'react';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

import GlMap from './../components/GlMap';
import Sidebar from './../components/Sidebar';

import style from "./styles/Interface.module.css";

type FilterProps = {
    bb_service: string,
    isp_count: number[]
}

const Interface = () => {

    const [filter, setFilter] = useState<FilterProps>({
        bb_service: "all",
        isp_count: [0, 10],
    });

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
    };

    return (
    <>
        <div className={style["interface"]}>
            <Sidebar onFilterChange={handleFilterChange} filter={filter} />
            <GlMap mapboxToken={process.env.MAPBOX_TOKEN} filter={filter} />
        </div>

        </>
    );

}

export default Interface;