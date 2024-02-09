import style from "./styles/Navbar.module.css"
import React from 'react';

export default function Navbar({ text }) {

    return ( 
    	<>
    		<div className={style['navbar-container']}>
          <div className={style['navbar']}>
            <img className={style['logo']} src='/Full-Logo_CORI_Cream.svg'/>
{/*            <a className={style['menu']}>
              <img src="/menu.svg" />
            </a>*/}
            <a className={style["about"]}>About</a>
          </div>
        </div>
      </>
    );

}