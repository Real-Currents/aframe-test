import React, { useState, useCallback, useEffect, useRef } from 'react';
import Map, { Source, Layer } from 'react-map-gl';
import type { MapRef } from 'react-map-gl';
import { fitBounds } from 'viewport-mercator-project';
import "mapbox-gl/dist/mapbox-gl.css";

import { format } from 'd3-format';

import style from "./styles/GlMap.module.css";

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
    isp_count: number[]
  },
  fillColor: any[]
};

const USA_BOUNDS: [[number, number], [number, number]] = [
    [-125, 24], // Southwest coordinates: [Longitude, Latitude]
    [-66, 49]   // Northeast coordinates: [Longitude, Latitude]
];

const GlMap: React.FC<GlMapProps> = ({ mapboxToken, filter, fillColor }: GlMapProps) => {
  const mapRef = useRef<MapRef | null>(null);

  const { longitude, latitude, zoom } = fitBounds({
    width: window.innerWidth,
    height: window.innerHeight,
    bounds: USA_BOUNDS,
    padding: 20 // Optional padding around the bounds
  });

  const MIN_ZOOM_LEVEL = 10;

  const [hoverInfo, setHoverInfo] = useState<any>(null); // Specify the type of hoverInfo if known
  const [layerFilter, setLayerFilter] = useState<any>(['all']); // Specify the type of layerFilter if known
  const [map_zoom, setMapZoom] = useState<number>(zoom);

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

      setHoverInfo(hoveredFeature && { feature: hoveredFeature, x, y });

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

    let new_filter: any = ["all", ['in', ['get', 'bead_category'], ['literal', bb_array]], isp_filter]; 

    setLayerFilter(new_filter);

  }, [filter]);

  return (
    <div className={style["map-wrapper"]}>
            {map_zoom < MIN_ZOOM_LEVEL && (
          <div className={style["zoom-message"]}>Zoom closer to view data</div>
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
      >

        <Source id={"mapbox-terrain"} type={"vector"} url={"mapbox://mapbox.mapbox-terrain-v2"} >
            <Layer {...contourStyle} >
            </Layer>
        </Source>

        <Source {...bead_dev.sources[0]} >
            <Layer 
              {...bead_dev.layers[0]} 
              filter={layerFilter}
              paint={{
                'fill-color': fillColor // assuming fillColor is in the correct format
              }}
            />
            {hoverInfo && (
              <div className="tooltip" style={{left: hoverInfo.x, top: hoverInfo.y}}>
                <div>
                  <p>
                    <em>BEAD category:</em> <b>{hoverInfo.feature.properties.bead_category}</b><br />
                    <em>Total locations:</em> <b>{hoverInfo.feature.properties.cnt_total_locations}</b><br />
                    <em>ISP count:</em> <b>{hoverInfo.feature.properties.cnt_isp}</b><br />
                    <em>Pct. served:</em> <b>{percentFormat(hoverInfo.feature.properties.pct_served)}</b><br />
                  </p>
                </div>
              </div>
            )}         
        </Source>

        {/** BEAD track layer sanity check  */}
{/*        <Source {...bb_tr_100_20.sources[0]}>
            <Layer
              {...bb_tr_100_20.layers[0]}
            />
        </Source>*/}

      </Map>
    </div>
  );
};

export default GlMap;
