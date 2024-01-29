import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import Map, { Source, Layer } from 'react-map-gl';
import type { MapRef } from 'react-map-gl';
import { fitBounds } from 'viewport-mercator-project';
import "mapbox-gl/dist/mapbox-gl.css";

import axios from "axios";

import { format } from 'd3-format';

import style from "./styles/GlMap.module.css";

import IntrinsicAttributes = React.JSX.IntrinsicAttributes;
import { LayerProps } from "react-map-gl";

import combo_dict from './../data/combo_sample2_dict.json';

interface ComboLookup {
    [key: string]: string;
}
const combo_lookup: ComboLookup = combo_dict;

const percentFormat = format('.1%');

import {
    bead_dev,
    bb_tr_100_20,
    contourStyle
} from '../styles';

type GlMapProps = {
    mapboxToken: string,
    filter: {
        bb_service: {
            served: boolean,
            underserved: boolean,
            unserved: boolean
        },
        isp_count: number[],
        total_locations: number[],
        isp_combos: string[],
        counties: string[]
    },
    fillColor: any,
    onFocusBlockChange: (newFocusBlock: string) => void,
    onDetailedInfoChange: (newDetailedInfo: string[]) => void
};

const USA_BOUNDS: [
    [number, number],
    [number, number]
] = [
    [-125, 24], // Southwest coordinates: [Longitude, Latitude]
    [-66, 49] // Northeast coordinates: [Longitude, Latitude]
];

const GlMap: React.FC < GlMapProps > = ({ 
  mapboxToken, 
  filter, 
  fillColor, 
  onFocusBlockChange,
  onDetailedInfoChange
}: GlMapProps) => {
    const mapRef = useRef < MapRef | null > (null);

    const { longitude, latitude, zoom } = fitBounds({
        width: window.innerWidth,
        height: window.innerHeight,
        bounds: USA_BOUNDS,
        padding: 20 // Optional padding around the bounds
    });

    const [layerAttributes, setLayerAttributes] = useState < (IntrinsicAttributes & LayerProps) > ({ ...bead_dev.layers[0] });

    const MIN_ZOOM_LEVEL = 9;

    const [hoverInfo, setHoverInfo] = useState < any > (null); // Specify the type of hoverInfo if known
    const [layerFilter, setLayerFilter] = useState < any > (['all']); // Specify the type of layerFilter if known
    const [map_zoom, setMapZoom] = useState < number > (zoom);
    const [clickedBlock, setClickedBlock] = useState < string > ("");

    const onMove = (event: any) => { // Specify the type of event if known
        setMapZoom(event.viewState!.zoom!);
    };

    const onHover = useCallback((event: any) => { // Specify the type of event if known
        if (mapRef !== null && mapRef.current !== null) {
            const {
                features,
                point: { x, y }
            } = event;
            const hoveredFeature = features && features[0];

            // console.log("hoveredFeature is ", hoveredFeature);

            setHoverInfo(hoveredFeature && { feature: hoveredFeature, x, y });

        }
    }, []);

    const onClick = useCallback((event: any) => {
        if (mapRef !== null && mapRef.current !== null) {
            const {
                features
            } = event;
            const clickedFeature = features && features[0];

            if (clickedFeature) {
                onFocusBlockChange(clickedFeature.properties.geoid_bl);
                setClickedBlock(clickedFeature.properties.geoid_bl);

                axios.get("http://localhost:8080/rest/bead/isp_tech/bl?geoid_bl=" + clickedFeature.properties.geoid_bl)
                  .then(result => {
                      console.log("result is ", result);
                      if (result.data) {
                        let names: string[] = result.data.features.map((d: { properties: { new_alias: string } }) => d.properties.new_alias);
                        onDetailedInfoChange(names);
                      }
                  })
                  .catch(error => {
                      console.error("Error fetching data:", error);
                  });

            }
        }
    }, []);

    useEffect(() => {

        let bb_array: any[] = [];

        if (filter.bb_service.served === true) {
            bb_array = [...bb_array, "Served"];
        }

        if (filter.bb_service.underserved === true) {
            bb_array = [...bb_array, "Underserved"];
        }

        if (filter.bb_service.unserved === true) {
            bb_array = [...bb_array, "Unserved"];
        }

        let isp_filter: any = [
            'all',
            ['>=', ['get', 'cnt_isp'], filter.isp_count[0]],
            ['<=', ['get', 'cnt_isp'], filter.isp_count[1]]
        ];

        let total_locations_filter: any = [
            'all',
            ['>=', ['get', 'cnt_total_locations'], filter.total_locations[0]],
            ['<=', ['get', 'cnt_total_locations'], filter.total_locations[1]]
        ];

        let new_filter: any = ["all", ['in', ['get', 'bead_category'],
            ['literal', bb_array]
        ], isp_filter, total_locations_filter];

        if (filter.isp_combos.length !== 0) {
            let isp_combo_filter = ['in', ['get', 'combo_isp_id'],
                ['literal', filter.isp_combos]
            ];
            new_filter.push(isp_combo_filter);
        }

        if (filter.counties.length !== 0) {
            let counties_filter = ['in', ['get', 'geoid_co'],
                ['literal', filter.counties]
            ];
            new_filter.push(counties_filter);
        }

        setLayerFilter(new_filter);

    }, [filter]);


    useEffect(() => {

        const newLayerAttributes: (LayerProps & IntrinsicAttributes) = {
            ...layerAttributes
        };

        (newLayerAttributes as any) !["paint"] = {
            "fill-color": fillColor
        };

        setLayerAttributes(newLayerAttributes);

    }, [fillColor]);

    return (
        <div className={style["map-wrapper"]}>
            {map_zoom < MIN_ZOOM_LEVEL && (
          <div className={style["zoom-message"]}>Zoom in to Vermont view data</div>
        )} 
        {clickedBlock.length > 0 && (
          <a href="#detail">  
            <button className={style["detail-button"]}>
                Detailed View
                <svg viewBox="0 0 22 14" aria-hidden="true"><polygon points="18.8743237 0 22 3.62676411 10.6828079 14 0 3.57495046 3.2339044 0.0505492411 10.7824379 7.41694926"></polygon></svg>
            </button>  
          </a>
        )}
      <Map
        ref={mapRef}
        initialViewState={{
          latitude: latitude,
          longitude: longitude,
          zoom: zoom
        }}
        mapStyle="mapbox://styles/mapbox/light-v9"
        mapboxAccessToken={mapboxToken}
        interactiveLayerIds={
            (bead_dev.layers !== null && bead_dev.layers[0].hasOwnProperty('id') ) ? [
                bead_dev.layers[0]['id']!
            ] : []
        }
        onMouseMove={onHover}
        onMove={onMove}
        onClick={onClick}
      >

        <Source id={"mapbox-terrain"} type={"vector"} url={"mapbox://mapbox.mapbox-terrain-v2"} >
            <Layer {...contourStyle} >
            </Layer>
        </Source>

        <Source {...bead_dev.sources[0]} >
            <Layer 
              {...layerAttributes} 
              filter={layerFilter}
            />
            {hoverInfo && (
              <div className="tooltip" style={{left: hoverInfo.x, top: hoverInfo.y}}>
                <div>
                  <p>
                    <em>BEAD category:</em> <b>{hoverInfo.feature.properties.bead_category}</b><br />
                    <em>Total locations:</em> <b>{hoverInfo.feature.properties.cnt_total_locations}</b><br />
                    <em>ISP count:</em> <b>{hoverInfo.feature.properties.cnt_isp}</b><br />
                    <em>Pct. served:</em> <b>{percentFormat(hoverInfo.feature.properties.pct_served)}</b><br />
                    <em>Locations with 100/20 service:</em> <b>{hoverInfo.feature.properties.cnt_100_20}</b><br />
                    <em>Locations with 25/3 service:</em> <b>{hoverInfo.feature.properties.cnt_25_3}</b><br />
                    <em>ISPs:</em> {hoverInfo.feature.properties.combo_isp_id ? combo_lookup[hoverInfo.feature.properties.combo_isp_id]: "N/A"}<br />
                  </p>
                </div>
              </div>
            )}         
        </Source>
      </Map>
    </div>
    );
}

export default GlMap;
