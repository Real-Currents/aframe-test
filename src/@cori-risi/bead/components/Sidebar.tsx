import React, { useState} from 'react';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Slider from '@mui/material/Slider';

import style from "./styles/Sidebar.module.css";

function valuetext(value: number) {
  return `${value}°C`;
}

const Sidebar = ({ onFilterChange, filter }: { onFilterChange: Function, filter: any }) => {

  const handleChange = (event: Event, newValue: number | number[]) => {
    console.log("changed", newValue as number[]);
    onFilterChange({...filter, isp_count: newValue as number[]});
  };

  function handleBroadbandChange(event: any) {
    if (event.target.name === "bb-radio" && typeof event.target.value === 'string') {
      onFilterChange({...filter, bb_service: event.target.value});
    }
  }

  return (
    <>
      <div className={style["sidebar"]}>
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
        <Slider
          getAriaLabel={() => 'ISP Count'}
          value={filter.isp_count}
          onChange={handleChange}
          valueLabelDisplay="auto"
          min={0}
          max={10}
        />

      </div>  
    </>
  );

}

export default Sidebar;