import style from "./styles/Navbar.module.css";
import Button from '@mui/material/Button';
import React from 'react';

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
              <Button className={style["open-button"]} onClick={onToggleDrawer} variant="outlined">
                  {isDrawerShowing ? "Hide filters" : "Show filters"}
              </Button>
            </div>
          </div>
        </div>
      </>
    );

}