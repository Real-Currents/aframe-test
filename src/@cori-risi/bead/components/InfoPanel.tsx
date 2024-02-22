import DetailedView from "./DetailedView";
import React from "react";

export default function InfoPanel() {
    return (
        <div id="info-wrapper" style={{
            pointerEvents: "none",
            position: "absolute",
            top: 0,
            marginTop: "75px",
            minWidth: "100vw",
            minHeight: "calc(100vh - 75px)",
            paddingTop: "calc(100vh - 75px)",
            /* property name | duration | easing function | delay */
            transition: "padding-top 0.25s ease-in-out 0.05s",
            zIndex: 100
        }}>
            {/*<div className={"info-map-viewer"} style={{ pointerEvents: "none", position: "relative", minHeight: "calc(100vh - 75px)", maxHeight: "calc(100vh - 75px)" }}>&nbsp;</div>*/}
            <DetailedView />
        </div>
    );
}