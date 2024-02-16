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
import county_name_geoid from './../data/geoid_co_name_crosswalk.json';

interface IspNameLookup {
  [key: string]: string;
}

interface IspIdLookup {
  [key: string]: string[];
}

function Sidebar<T>({ 
  onFilterChange, 
  onFillColorChange, 
  onColorVariableChange,
  filter,
  isShowing,
  ispIdLookup,
  ispNameLookup,
  disableSidebar
}: 
  {
    onFilterChange: (newFilter: T) => void, 
    onFillColorChange: (newFillColor: any[]) => void,
    onColorVariableChange: (newColorVariable: string) => void,
    filter: any,
    isShowing: boolean,
    ispIdLookup: { [key: string]: string[] },
    ispNameLookup: { [key: string]: string },
    disableSidebar: boolean
 }) {

  const props = useSpring({
    right: isShowing ? "0px": "-375px"
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

    // Populate a list of combo ids to use when filtering
    let valid_isp_combos: string[] = [];
    for (let isp of newValue) {

      let isp_id = ispNameLookup[isp];
      for (const key in ispIdLookup) {

        if (ispIdLookup[key].includes(isp_id)) {
          valid_isp_combos.push(key);
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
          <h4>Map display variable</h4>
          <div className={style['fill-selector']}>
            <div className={style["color-dropdown"]}>
              <Autocomplete
                disablePortal
                disableClearable
                id="map-colors"
                defaultValue={"BEAD category"}
                options={["BEAD category", "Total locations"]}
                sx={{ width: "100%" }}
                renderInput={(params) => <TextField {...params} label="Color map by" />}
                onChange={handleFillColorChange}
                disabled={disableSidebar}
              />
            </div>
          </div>
          <hr />
          <div className={style["filter-container"]}>
            <h4>Filters</h4>
            <div className={style["filter-section"]}>
              <div className={style["filter-header"]}>
                <h5>Broadband service level</h5>
                <InfoTooltip text={`Unserved refers to areas where at least 80% of locations do not have 25/3 Mbps service. 
                Underserved refers to areas where at least 80% of locations do not have 100/20 Mbps service. Served refers to 
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
                  disabled={disableSidebar}
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
                  disabled={disableSidebar}
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
                  disabled={disableSidebar}
                />          
              </FormGroup>
            </div>
            <div className={style["filter-section"]}>
              <div className={style["filter-header"]}>
                <h5>Received federal funding?</h5>
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
                  disabled={disableSidebar}
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
                  disabled={disableSidebar}
                />                 
              </FormGroup>  
            </div>
            <div className={style["filter-section"]}>        
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
                  disabled={disableSidebar}
                />
              </div>
            </div>
            <div className={style["filter-section"]}>
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
                  disabled={disableSidebar}
                />
              </div>
            </div>
            <div className={style["filter-section"]}>
              <div className={style["filter-header"]}>
                <h5>Internet Service Providers</h5>
              </div>
              <Autocomplete
                multiple
                options={Object.keys(ispNameLookup)}
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
                disabled={disableSidebar}
              />    
            </div>          
            <div className={style["filter-section"]}>
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
                disabled={disableSidebar}
              />
            </div>
            <div className={style["filter-section"]}>  
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
                disabled={disableSidebar}
              />   
            </div> 
          </div>
      </animated.div>
    </>
  );

}

export default Sidebar;