import React, {useContext} from 'react';
import {useDispatch, useSelector} from "react-redux";
import { useSpring, animated } from "react-spring";

import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Slider from '@mui/material/Slider';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';

import InfoTooltip from "./InfoTooltip";

import {ApiContext} from "../../contexts/ApiContextProvider";
import { selectMapFilters, setMapFilters } from "../features";
import { FilterState } from "../models/index";
// import { getFillColor } from '../utils/colors';
import { swapKeysValues } from '../utils/utils';

import style from "./styles/Sidebar.module.css";

import broadband_technology_dict from '../data/broadband_technology.json';
import county_name_geoid from '../data/geoid_co_name_crosswalk.json';
import isp_name_dict from '../data/isp_name_lookup_rev.json';
import isp_id_dict from "../data/isp_dict_latest.json";

const broadband_technology: Record<string, string> = broadband_technology_dict;

interface IspIdLookup {
  [key: string]: string[];
}

interface IspNameLookup {
  [key: string]: string;
}
const isp_name_lookup: IspNameLookup = isp_name_dict;
const isp_name_lookup_rev = swapKeysValues(isp_name_lookup);

const isp_id_lookup: IspIdLookup = isp_id_dict;

function Sidebar () {

  const apiContext = useContext(ApiContext);

  const dispatch = useDispatch();

  const filterState: FilterState = useSelector(selectMapFilters);

  const props = useSpring({
    right: filterState.showSidebar ? "0px": "-375px"
  });

  const handleFillColorChange = (event: React.SyntheticEvent, newValue: string) => {

      // onFillColorChange(getFillColor(newValue));
      // onColorVariableChange(newValue);

      dispatch(setMapFilters({
        "colorVariable": newValue
      }));
  };

  const handleBEADFilterChange = (event: any) => {
    if (typeof event.target.checked === 'boolean') {

      // onFilterChange({
      //   ...filter,
      //   bb_service: {
      //     ...filter.bb_service,
      //     [event.target.name]: event.target.checked
      //   }
      // });

      dispatch(setMapFilters({
        bb_service: {
          ...filterState.bb_service,
          [event.target.name]: event.target.checked
        }
      }));
    }
  };

  const handleAwardChange = (event: any) => {
    if (typeof event.target.checked === 'boolean') {
      // onFilterChange({
      //   ...filter,
      //   has_previous_funding: {
      //     ...filter.has_previous_funding,
      //     [event.target.name]: event.target.checked
      //   }
      // });

      dispatch(setMapFilters({
        has_previous_funding: {
          ...filterState.has_previous_funding,
          [event.target.name]: event.target.checked
        }
      }));
    }
  };

  const handleISPChange = (event: Event, newValue: number | number[]) => {
    let slider_vals: number[] = newValue as number[];
    // onFilterChange({...filter, isp_count: slider_vals});

    dispatch(setMapFilters({
      isp_count: slider_vals
    }));
  };

  const handleTotalLocationsChange = (event: Event, newValue: number | number[]) => {
    let slider_vals: number[] = newValue as number[];
    // onFilterChange({...filter, total_locations: slider_vals});

    dispatch(setMapFilters({
      total_locations: slider_vals
    }));
  };

  const handleBroadbandTechnologyChange = (event: any, newValue: string[]) => {
    if (Array.isArray(newValue) && newValue.every((item) => typeof item === 'string')) {
      // onFilterChange({...filter, broadband_technology: newValue});

      dispatch(setMapFilters({
        broadband_technology: newValue
      }));
    }
  };

  const handleMultipleISPChange = (event: any, newValue: any ) => {
    
    // Populate a list of combo ids to use when filtering
    const valid_isp_combos: string[] = [];
    for (let isp of newValue) {

      let isp_id = isp_name_lookup[isp];
      for (const key in isp_id_lookup) {

        if (isp_id_lookup[key].includes(isp_id)) {
          valid_isp_combos.push(key);
        }
      }
    }

    // onFilterChange({...filter, isp_combos: valid_isp_combos});

    dispatch(setMapFilters({
      isp_combos: valid_isp_combos
    }));
  };

  const handleISPFootprintChange = (event: any, newValue: string | null): void => {

    if (newValue === null) {
      dispatch(setMapFilters({
        isp_footprint: ""
      }));
    }
    else {
      let isp_id = isp_name_lookup[newValue];
      if (typeof isp_id === "string") {
        dispatch(setMapFilters({
          isp_footprint: isp_id
        }));
      }
    }

  };

  const handleCountiesChange = (event: any, newValue: any) => {

    let valid_geoid_co: string[] = [];
    for (let county_name of newValue) {

      let filtered_records = county_name_geoid.filter(d => d.label === county_name);

      if (filtered_records.length > 0 && typeof filtered_records[0].id === 'string') {
        valid_geoid_co.push(filtered_records[0].id);
      }
    }

    // onFilterChange({...filter, counties: valid_geoid_co});
    dispatch(setMapFilters({
      counties: valid_geoid_co
    }));
  };

  const handleExcludeDSLChange = () => {
    const newExcludeDSL = !filterState.excludeDSL;
    dispatch(setMapFilters({ excludeDSL: newExcludeDSL }));
  };

  const toggleDataLayers = () => {
    dispatch(setMapFilters({ displayDataLayers: !filterState.displayDataLayers }));
  };

  return (
    <>
        <animated.div style={props} className={style["sidebar"]}>
          <div className={style["controls-wrapper"]}>
            <h4>Map display variables
                {/* TODO: */}
                {/* Add button to toggle off filtered/thematic map layers */}
                {/* ... (leave basemap and selcted features) */}
            </h4>
            <div className={style['fill-selector']}>
              <div className={style["switch"]} style={{ float: "right" }}>
                {/*<Typography>Off</Typography>*/}
                <Switch
                    checked={filterState.displayDataLayers}
                    onChange={toggleDataLayers}
                    inputProps={{ 'aria-label': 'Toggle Broadband Data Layers' }}
                />
                {/*<Typography>On</Typography>*/}
              </div>
              <div className={style["color-dropdown"]}>
                <Autocomplete
                  disablePortal
                  disableClearable
                  id="map-colors"
                  defaultValue={"BEAD service level"}
                  options={["BEAD service level", "Total locations"]}
                  sx={{ width: "100%" }}
                  renderInput={(params) => <TextField {...params} label="Color map by" />}
                  onChange={handleFillColorChange}
                  disabled={filterState.disableSidebar}
                />
              </div>
            </div>
            <div className={style["filter-section"]}>
              <div className={style["filter-header"]}>
                <h5>Internet service provider footprint</h5>
                <InfoTooltip text={"Show the footprint for a given ISP"}/>
              </div>
              <Autocomplete
                options={Object.keys(isp_name_lookup)}
                onChange={handleISPFootprintChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    label="Display ISP footprint"
                    placeholder="Display ISP footprint"
                  />
                )}
                disabled={filterState.disableSidebar}
              />
            </div>            
            <div className={style["filter-section"]}>
              <div className={style["filter-header"]}>
                <h5>Exclude DSL</h5>
              </div>
              <div className={style["switch"]}>
                <Typography>Off</Typography>
                <Switch 
                  checked={filterState.excludeDSL}
                  onChange={handleExcludeDSLChange}
                  inputProps={{ 'aria-label': 'DSL toggle' }} 
                  disabled={filterState.disableSidebar}
                />
                <Typography>On</Typography>
              </div>
            </div>
            <hr />
            <div className={style["filter-container"]}>
              <h4>Filters</h4>
              <div className={style["filter-section"]}>
                <div className={style["filter-header"]}>
                  <h5>BEAD service level</h5>
                  <InfoTooltip text={`Unserved refers to areas where at least 80% of locations do not have 25/3 Mbps service. 
                    Underserved refers to areas where at least 80% of locations do not have 100/20 Mbps service. Served refers to 
                    areas that are neither Unserved nor Underserved. BEAD is an acronym for the Broadband Equity, Access, and 
                    Deployment program, which provides funding to expand internet access.`}/>
                </div>
                <FormGroup row className={style["form-control-group"]}>
                  <FormControlLabel className={style["form-control-label"]}
                    control={
                      <Checkbox
                        checked={filterState.bb_service.served}
                        onChange={handleBEADFilterChange}
                        name="served"
                      />
                    }
                    label="Served"
                    disabled={filterState.disableSidebar}
                  />
                  <FormControlLabel className={style["form-control-label"]}
                    control={
                      <Checkbox
                        checked={filterState.bb_service.underserved}
                        onChange={handleBEADFilterChange}
                        name="underserved"
                      />
                    }
                    label="Underserved"
                    disabled={filterState.disableSidebar}
                  />
                  <FormControlLabel className={style["form-control-label"]}
                    control={
                      <Checkbox
                        checked={filterState.bb_service.unserved}
                        onChange={handleBEADFilterChange}
                        name="unserved"
                      />
                    }
                    label="Unserved"
                    disabled={filterState.disableSidebar}
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
                        checked={filterState.has_previous_funding.yes}
                        onChange={handleAwardChange}
                        name="yes"
                      />
                    }
                    label="Yes"
                    disabled={filterState.disableSidebar}
                  />
                  <FormControlLabel className={style["form-control-label"]}
                    control={
                      <Checkbox
                        checked={filterState.has_previous_funding.no}
                        onChange={handleAwardChange}
                        name="no"
                      />
                    }
                    label="No"
                    disabled={filterState.disableSidebar}
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
                    value={filterState.isp_count}
                    onChange={handleISPChange}
                    valueLabelDisplay="auto"
                    min={0}
                    max={10}
                    disabled={filterState.disableSidebar}
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
                    value={filterState.total_locations}
                    onChange={handleTotalLocationsChange}
                    valueLabelDisplay="auto"
                    min={0}
                    max={1015}
                    disabled={filterState.disableSidebar}
                  />
                </div>
              </div>
              <div className={style["filter-section"]}>
                <div className={style["filter-header"]}>
                  <h5>Broadband technologies</h5>
                  <InfoTooltip text={"Show census blocks where a certain broadband technology is reported to be present"}/>
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
                    disabled={filterState.disableSidebar}
                />
              </div>
              <div className={style["filter-section"]}>
                <div className={style["filter-header"]}>
                  <h5>Internet service providers</h5>
                  <InfoTooltip text={"Show census blocks which include at least one of the ISPs you've selected"}/>
                </div>
                <Autocomplete
                  multiple
                  options={Object.keys(isp_name_lookup)}
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
                  disabled={filterState.disableSidebar}
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
                  disabled={filterState.disableSidebar}
                />
              </div>
            </div>
          </div>
          <div className={style["link-section"]}>
            <a href="https://ruralinnovation.us/" target="_blank">About</a> |
            <a href="https://ruralinnovation.us/about/contact-us/" target="_blank">Contact</a> |
            <a href="https://form-renderer-app.donorperfect.io/give/center-on-rural-innovation/cori-general-giving" target="_blank">Donate</a>
          </div>
      </animated.div>
    </>
  );

}

export default Sidebar;