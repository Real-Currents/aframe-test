import React, { useState} from 'react';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

import style from "./styles/Sidebar.module.css";

const Sidebar = ({ onFilterChange, filter }) => {

    function handleBroadbandChange(event: any) {
      if (event.target.name === "bb-radio" && typeof event.target.value === 'string') {
        onFilterChange({...filter, bb_service: event.target.value});
      }
    }

    return (
      <>
        <div className={style["controls"]}>
          <FormControl>
            <FormLabel id="bb-service-radio">Broadband service level</FormLabel>
            <RadioGroup
              row
              aria-labelledby="bb-service-radio"
              defaultValue="all"
              name="bb-radio"
              onChange={handleBroadbandChange}
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
                onFilterChange({...filter, state: newValue});
              }
              else if (newValue === null) {
                onFilterChange({...filter, state: "all"});
              }
            }}
          />
        </div>  
      </>
    );

}

export default Sidebar;