import React, { useState} from 'react';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

import GlMap from './../components/GlMap';

const MAPBOX_TOKEN = 'pk.eyJ1IjoicnVyYWxpbm5vIiwiYSI6ImNqeHl0cW0xODBlMm0zY2x0dXltYzRuazUifQ.zZBovoCHzLIW0wCZveEKzA';

import style from "./styles/Interface.module.css";

type FilterProps = {
    bb_service: string,
    state: string
}


const Interface= () => {

    function handleChange(event: any) {

        if (event.target.name === "bb-radio" && typeof event.target.value === 'string') {
          setFilter({...filter, bb_service: event.target.value});
        }
    }

    const [filter, setFilter] = useState<FilterProps>({
        bb_service: "all",
        state: "all",
    });


    return (
    <>
        <div className={style["interface"]}>
          <div className={style["controls"]}>
            <h1>Broadband access</h1>

            <FormControl>
              <FormLabel id="bb-service-radio">Broadband service level</FormLabel>
              <RadioGroup
                row
                aria-labelledby="bb-service-radio"
                defaultValue="all"
                name="bb-radio"
                onChange={handleChange}
              >
                <FormControlLabel value="all" control={<Radio />} label="All" />
                <FormControlLabel value="served" control={<Radio />} label="Served" />
                <FormControlLabel value="underserved" control={<Radio />} label="Underserved" />
                <FormControlLabel value="unserved" control={<Radio />} label="Unserved" />
              </RadioGroup>
            </FormControl>   

            <Autocomplete
              disablePortal
              id="state-select"
              options={["NH", "MA", "VT", "ME"]}
              sx={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label="State Abbr" />}
              onChange={(event, newValue) => {
                if (typeof newValue === 'string') {
                    setFilter({...filter, state: newValue});
                }
                else if (newValue === null) {
                    setFilter({...filter, state: "all"});
                }
              }}
            />

          </div>  
          <div className="map-container">
            <GlMap mapboxToken={MAPBOX_TOKEN} filter={filter} />
          </div>          
        </div>

        </>
    );

}

export default Interface;