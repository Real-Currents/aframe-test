import style from "./styles/Navbar.module.css"
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

    console.log("isDrawerShowing is ", isDrawerShowing)

    return ( 
    	<>
    		<div className={style['navbar-container']}>
          <div className={style['navbar']}>
            <img className={style['logo']} src='/Full-Logo_CORI_Cream.svg'/>
{/*            <a className={style['menu']}>
              <img src="/menu.svg" />
            </a>*/}
            <div>
              {/*<a className={style["about"]}>About</a>*/}
              <button className={style["open-button"]} onClick={onToggleDrawer}>
                  {isDrawerShowing ? "Hide filters" : "Show filters"}
              </button>
            </div>
          </div>
        </div>
      </>
    );

}