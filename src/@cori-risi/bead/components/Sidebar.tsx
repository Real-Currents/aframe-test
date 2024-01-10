import React, { useState} from 'react';

// import Radio from '@mui/material/Radio';
// import RadioGroup from '@mui/material/RadioGroup';
// import FormControl from '@mui/material/FormControl';

import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';

import Slider from '@mui/material/Slider';

import style from "./styles/Sidebar.module.css";

function Sidebar<T>({ onFilterChange, filter }: { onFilterChange: (newFilter: T) => void, filter: any }) {

  const handleISPChange = (event: Event, newValue: number | number[], activeThumb: number) => {
    let slider_vals: number[] = newValue as number[];
    onFilterChange({...filter, isp_count: slider_vals});
  };

  function handleBroadbandChange(event: any) {
    
    if (typeof event.target.checked === 'boolean') {
      onFilterChange({...filter, bb_service: {...filter.bb_service, [event.target.name]: event.target.checked}});
    }

  }

  return (
    <>
      <div className={style["sidebar"]}>
        <h1>Filters</h1>
        <hr />
        <h3>Broadband service level</h3>
        <FormGroup row>
          <FormControlLabel
            control={
              <Checkbox
                checked={filter.bb_service.served}
                onChange={handleBroadbandChange}
                name="served"
              />
            }
            label="Served"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={filter.bb_service.underserved}
                onChange={handleBroadbandChange}
                name="underserved"
              />
            }
            label="Underserved"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={filter.bb_service.unserved}
                onChange={handleBroadbandChange}
                name="unserved"
              />
            }
            label="Unserved"
          />                    
        </FormGroup>
{/*        <FormControl>
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
        </FormControl>*/}
        <hr />
        <h3>ISP County</h3>
        <Slider
          getAriaLabel={() => 'ISP Count'}
          value={filter.isp_count}
          onChange={handleISPChange}
          valueLabelDisplay="auto"
          min={0}
          max={10}
        />

      </div>  
    </>
  );

}

export default Sidebar;