import style from "./styles/Navbar.module.css";
import React from 'react';
import TuneIcon from '@mui/icons-material/Tune';
import { CustomButton, CustomIconButton } from "./CustomInputs";

export default function Navbar(
  {
    onToggleDrawer,
    isDrawerShowing
  }:
  { 
    onToggleDrawer: (event: React.SyntheticEvent) => void,
    isDrawerShowing: boolean
  }
) {

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
                  {isDrawerShowing ? "Hide controls" : "Show controls"}
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