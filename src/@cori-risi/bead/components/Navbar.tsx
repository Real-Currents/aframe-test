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
            <img className={style['logo']} src='/Full-Logo_CORI_Cream.svg'/>
            <div>
              <CustomButton 
                className={style["open-button"]}
                onClick={onToggleDrawer}
                endIcon={ <TuneIcon /> }
                variant="outlined">
                  {isDrawerShowing ? "Hide filters" : "Show filters"}
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