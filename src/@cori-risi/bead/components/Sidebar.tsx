import React, { useState} from 'react';

import { useSpring, animated } from "react-spring";

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
import isp_dict from './../data/isp_dict.json';
import county_name_geoid from './../data/geoid_co_name_crosswalk.json';

interface IspLookup {
  [key: string]: string;
}

const isp_lookup: IspLookup = isp_dict;

function Sidebar<T>({ 
  onFilterChange, 
  onFillColorChange, 
  filter,
  isShowing
}: 
  {
    onFilterChange: (newFilter: T) => void, 
    onFillColorChange: (newFillColor: any[]) => void,
    filter: any,
    isShowing: boolean
 }) {

  const props = useSpring({
    left: isShowing ? "0px": "-300px"
  });  

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

    let valid_isp_combos: string[] = [];
    for (let isp of newValue) {
      
      for (let key of Object.keys(isp_lookup)) {

        if (key.includes(isp)) {
          let combo_id: string = isp_lookup[key]
          valid_isp_combos.push(combo_id);
        }
      }
    }
    
    onFilterChange({...filter, isp_combos: valid_isp_combos});
  }

  function handleCountiesChange (event: any, newValue: any): void {

    let valid_geoid_co: string[] = [];
    for (let county_name of newValue) {

      let filtered_records = county_name_geoid.filter(d => d.label === county_name);

      if (filtered_records.length > 0 && typeof filtered_records[0].id === 'string') {
        valid_geoid_co.push(filtered_records[0].id);
      }
    }

    onFilterChange({...filter, counties: valid_geoid_co});
  }

  return (
    <>
        <animated.div style={props} className={style["sidebar"]}>
          <div className={style["color-dropdown"]}>
            <Autocomplete
              disablePortal
              disableClearable
              id="map-colors"
              defaultValue={"BEAD category"}
              options={["BEAD category", "ISP count", "Total locations"]}
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
                label="Filter ISPs"
                placeholder="Filter ISPs"
              />
            )}
          />      
          <h3>County</h3>
          <Autocomplete
            multiple
            id="tags-standard"
            options={county_name_geoid.map(d => d.label)}
            // defaultValue={""}
            onChange={handleCountiesChange}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label="Filter counties"
                placeholder="Filter counties"
              />
            )}
          />    
      </animated.div>
    </>
  );

}

export default Sidebar;