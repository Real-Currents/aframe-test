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

const MAPBOX_TOKEN = 'pk.eyJ1IjoicnVyYWxpbm5vIiwiYSI6ImNqeHl0cW0xODBlMm0zY2x0dXltYzRuazUifQ.zZBovoCHzLIW0wCZveEKzA';

import style from "./styles/Interface.module.css";

type FilterProps = {
    bb_service: string,
    state: string
}

const Interface = () => {

    const [filter, setFilter] = useState<FilterProps>({
        bb_service: "all",
        state: "all",
    });

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
    };

    return (
    <>
        <div className={style["interface"]}>
            <Sidebar onFilterChange={handleFilterChange} filter={filter} />
            <div className="map-container">
                <GlMap mapboxToken={MAPBOX_TOKEN} filter={filter} />
            </div>          
        </div>

        </>
    );

}

export default Interface;