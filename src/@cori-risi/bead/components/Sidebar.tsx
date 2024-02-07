import React, { useState} from 'react';

import { useSpring, animated } from "react-spring";

import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

import Slider from '@mui/material/Slider';

import InfoTooltip from "./InfoTooltip";

import style from "./styles/Sidebar.module.css";

import { getFillColor } from '../utils/colors';

interface BroadbandTechnology {
  [key: string]: string;
}

import broadband_technology_dict from './../data/broadband_technology.json';
const broadband_technology: Record<string, string> = broadband_technology_dict;
import isp_name from './../data/isp_name.json';
import isp_dict from './../data/isp_blocksv1_dict.json';
import county_name_geoid from './../data/geoid_co_name_crosswalk.json';

interface IspLookup {
  [key: string]: string;
}

const isp_lookup: IspLookup = isp_dict;

function Sidebar<T>({ 
  onFilterChange, 
  onFillColorChange, 
  onColorVariableChange, 
  filter,
  isShowing
}: 
  {
    onFilterChange: (newFilter: T) => void, 
    onFillColorChange: (newFillColor: any[]) => void,
    onColorVariableChange: (newColorVariable: string) => void,
    filter: any,
    isShowing: boolean
 }) {

  const props = useSpring({
    display: isShowing ? "block": "none",
    opacity: isShowing ? 1: 0
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

  function handleAwardChange(event: any) {

    if (typeof event.target.checked === 'boolean') {
      onFilterChange({...filter, has_previous_funding: {...filter.has_previous_funding, [event.target.name]: event.target.checked}});
    }
  }

  function handleFillColorChange(event: React.SyntheticEvent, newValue: string): void {
    if (typeof newValue === "string") {
      onFillColorChange(getFillColor(newValue));
      onColorVariableChange(newValue);
    }
  };

  function handleBroadbandTechnologyChange(event: any, newValue: string[]): void {
    if (Array.isArray(newValue) && newValue.every((item) => typeof item === 'string')) {
      onFilterChange({...filter, broadband_technology: newValue});
    }
  }

  function handleMultipleISPChange(event: any, newValue: any ): void {

    console.log("newValue is ", newValue);
    let valid_isp_combos: string[] = [];
    for (let isp of newValue) {

      for (let key of Object.keys(isp_lookup)) {

        if (key.includes(isp)) {
          console.log("ALIVE!!!");
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
          <h4>Filters</h4>
          <div className={style["filter-header"]}>
            <h5>Broadband service level</h5>
            <InfoTooltip text={`Unserved refers to areas where at least 80% of locations have 25/3 Mbps service. 
            Underserved refers to areas where at least 80% of locations have 100/20 Mbps service. Served refers to 
            areas that are neither Unserved nor Underserved.`}/>
          </div>
          <FormGroup row className={style["form-control-group"]}>
            <FormControlLabel className={style["form-control-label"]}
              control={
                <Checkbox
                  checked={filter.bb_service.served}
                  onChange={handleBroadbandChange}
                  name="served"
                />
              }
              label="Served"
            />
            <FormControlLabel className={style["form-control-label"]}
              control={
                <Checkbox
                  checked={filter.bb_service.underserved}
                  onChange={handleBroadbandChange}
                  name="underserved"
                />
              }
              label="Underserved"
            />
            <FormControlLabel className={style["form-control-label"]}
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
          <div className={style["filter-header"]}>
            <h5>Previously Awarded Funding</h5>
            <InfoTooltip text={"Show blocks that have received prior federal broadband funding"}/>
          </div>
          <FormGroup row className={style["form-control-group"]}>
            <FormControlLabel className={style["form-control-label"]}
              control={
                <Checkbox
                  checked={filter.has_previous_funding.yes}
                  onChange={handleAwardChange}
                  name="yes"
                />
              }
              label="Yes"
            />
            <FormControlLabel className={style["form-control-label"]}
              control={
                <Checkbox
                  checked={filter.has_previous_funding.no}
                  onChange={handleAwardChange}
                  name="no"
                />
              }
              label="No"
            />                 
          </FormGroup>          
          <div className={style["filter-header"]}>
            <h5>Internet service provider count</h5>
          </div>
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
          <div className={style["filter-header"]}>
            <h5>Total locations</h5>
          </div>
          <div className={style["slider"]}>
            <Slider
              getAriaLabel={() => 'Total locations'}
              value={filter.total_locations}
              onChange={handleTotalLocationsChange}
              valueLabelDisplay="auto"
              min={0}
              max={1015}
            />
          </div>
          <div className={style["filter-header"]}>
            <h5>Broadband Technologies</h5>
            {/*<InfoTooltip text={"Filter to blocks which have a certain broadband technology"}/>*/}
          </div>
          <Autocomplete
            multiple
            options={Object.keys(broadband_technology)}
            defaultValue={[]}
            onChange={handleBroadbandTechnologyChange}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label="Filter by broadband technology"
                placeholder="Filter by broadband technology"
              />
            )}
          />
          <div className={style["filter-header"]}>
            <h5>Internet Service Providers</h5>
          </div>
          <Autocomplete
            multiple
            options={isp_name}
            defaultValue={[]}
            onChange={handleMultipleISPChange}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label="Filter by ISP"
                placeholder="Filter by ISP"
              />
            )}
          />      
          <div className={style["filter-header"]}>
            <h5>County</h5>
          </div>
          <Autocomplete
            multiple
            options={county_name_geoid.map(d => d.label)}
            // defaultValue={""}
            onChange={handleCountiesChange}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label="Filter by county"
                placeholder="Filter by county"
              />
            )}
          />    
      </animated.div>
    </>
  );

}

export default Sidebar;