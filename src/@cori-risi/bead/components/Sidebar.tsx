import React, { useState} from 'react';

import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

import Slider from '@mui/material/Slider';

import style from "./styles/Sidebar.module.css";

import { getFillColor } from './../utils/controls';

import isp_name from './../data/isp_name.json';
import isp_lookup from './../data/isp_dict.json';

function Sidebar<T>({ 
  onFilterChange, 
  onFillColorChange, 
  filter }: 
  {
    onFilterChange: (newFilter: T) => void, 
    onFillColorChange: (newFillColor: any[]) => void,
    filter: any 
 }) {

  const handleISPChange = (event: Event, newValue: number | number[]) => {
    let slider_vals: number[] = newValue as number[];
    onFilterChange({...filter, isp_count: slider_vals});
  };

  const handleTotalLocationsChange = (event: Event, newValue: number | number[]) => {
    let slider_vals: number[] = newValue as number[];
    onFilterChange({...filter, total_locations: slider_vals});
  };

  function handleBroadbandChange(event: any) {

    if (typeof event.target.checked === 'boolean') {
      onFilterChange({...filter, bb_service: {...filter.bb_service, [event.target.name]: event.target.checked}});
    }
  }

  function handleFillColorChange(event: React.SyntheticEvent, newValue: string): void {
    if (typeof newValue === "string") {
      onFillColorChange(getFillColor(newValue));
    }
  };

  function handleMultipleISPChange(event: any, newValue: any ): void {

    let sortedISPs = newValue.slice().sort().join();
    let isp_combo = isp_lookup[sortedISPs];
    
    if (typeof isp_combo === "string") {
      onFilterChange({...filter, isp_combo: isp_combo});
    }
  }

  return (
    <>
      <div className={style["sidebar"]}>
        <div className={style["color-dropdown"]}>
          <Autocomplete
            disablePortal
            disableClearable
            id="map-colors"
            defaultValue={"BEAD category"}
            options={["BEAD category", "ISP count"]}
            sx={{ width: "100%" }}
            renderInput={(params) => <TextField {...params} label="Color map by" />}
            onChange={handleFillColorChange}
          />
        </div>
        <hr />
        <h1>Filters</h1>
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
        <h3>ISP Count</h3>
        <div className={style["slider"]}>
          <Slider
            getAriaLabel={() => 'ISP Count'}
            value={filter.isp_count}
            onChange={handleISPChange}
            valueLabelDisplay="auto"
            min={0}
            max={10}
          />
        </div>
        <h3>Total locations</h3>
        <div className={style["slider"]}>
          <Slider
            getAriaLabel={() => 'Total locations'}
            value={filter.total_locations}
            onChange={handleTotalLocationsChange}
            valueLabelDisplay="auto"
            min={0}
            max={500}
          />
        </div>
        <h3>ISPs</h3>
        <Autocomplete
          multiple
          id="tags-standard"
          options={isp_name}
          defaultValue={[]}
          onChange={handleMultipleISPChange}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              label="Multiple values"
              placeholder="ISPs"
            />
          )}
        />        
      </div>  
    </>
  );

}

export default Sidebar;