import style from "./styles/Navbar.module.css"
import React from 'react';

export default function Navbar({ text }) {

    return ( 
    	<>
    		<div className={style['navbar']}>
          <img src='/Full-Logo_CORI_Dark-Teal.svg'/>
        </div>
      </>
    );

}