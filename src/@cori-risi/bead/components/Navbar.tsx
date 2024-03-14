import style from "./styles/Navbar.module.css";
import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import TuneIcon from '@mui/icons-material/Tune';
import { selectMapFilters, setMapFilters } from "../features";
import { FilterState } from "../app/models";
import { CustomButton, CustomIconButton } from "./CustomInputs";

export default function Navbar() {

    const dispatch = useDispatch();

    const filterState: FilterState = useSelector(selectMapFilters);

    const onToggleDrawer = (evt: any) => {
        console.log("Toggle sidebar:", evt);

        const mapFiltersUpdate = {
            "showSidebar": !filterState.showSidebar
        };

        console.log("Update mapFilters state from:", filterState, "\nto:", mapFiltersUpdate);
        dispatch(setMapFilters(mapFiltersUpdate));
    };

    return ( 
    	<>
    		<div className={style['navbar-container']}>
          <div className={style['navbar']}>
            <a href="https://ruralinnovation.us/" target="_blank">
              <img className={style['logo']} src='/Full-Logo_CORI_Cream.svg'/>
            </a>
            <div>
              <CustomButton 
                className={style["open-button"]}
                onClick={onToggleDrawer}
                endIcon={ <TuneIcon /> }
                variant="outlined">
                  {filterState.showSidebar ? "Hide filters" : "Show filters"}
              </CustomButton>
              <CustomIconButton 
                className={style["icon-button"]}
                onClick={onToggleDrawer}
                >
                <TuneIcon />
              </CustomIconButton>
            </div>
          </div>
        </div>
      </>
    );

}