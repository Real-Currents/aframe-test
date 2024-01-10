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

function Sidebar<T>({ onFilterChange, filter }: { onFilterChange: (newFilter: T) => void, filter: any }) {

  const handleChange = (event: Event, newValue: number | number[], activeThumb: number) => {

    let slider_vals: number[] = newValue as number[];

    // if (slider_vals[0] === slider_vals[1]) {
    //   if (slider_vals[1] === 10) {
    //     slider_vals[0] = 9;
    //   }
    //   else {
    //     slider_vals[1] = slider_vals[1] + 1;
    //   }
    // }

    onFilterChange({...filter, isp_count: slider_vals});

  };

  function handleBroadbandChange(event: any) {
    if (event.target.name === "bb-radio" && typeof event.target.value === 'string') {
      onFilterChange({...filter, bb_service: event.target.value});
    }
  }

  return (
    <>
      <div className={style["sidebar"]}>
        <h1>Filters</h1>
        <hr />
        <FormControl>
          <h3>Broadband service level</h3>
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
        <hr />
        <h3>ISP County</h3>
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