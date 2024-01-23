import React, { useState} from 'react';

import style from "./styles/DetailedView.module.css";

const DetailedView = () => {

    return (
    <>
        <div id="detail" className={style["detailed-view"]}>
            <p>Some text goes here</p>
        </div>
    </>
    );
}

export default DetailedView;