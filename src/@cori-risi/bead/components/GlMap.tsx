import React, { useState, useCallback, useEffect, useRef } from 'react';
import Map, { Source, Layer } from 'react-map-gl';
import type {MapRef} from 'react-map-gl';
import { fitBounds } from 'viewport-mercator-project';
import "mapbox-gl/dist/mapbox-gl.css";

import style from "./styles/GlMap.module.css";

import {
    bb_tr_100_20,
    contourStyle
} from '../styles';

type GlMapProps = {
  mapboxToken: string,
  filter: {
    bb_service: string,
    state: string
  }
};

const USA_BOUNDS: [[number, number], [number, number]] = [
    [-125, 24], // Southwest coordinates: [Longitude, Latitude]
    [-66, 49]   // Northeast coordinates: [Longitude, Latitude]
];

const GlMap: React.FC<GlMapProps> = ({ mapboxToken, filter }: GlMapProps) => {
  const mapRef = useRef<MapRef | null>(null);

  const { longitude, latitude, zoom } = fitBounds({
    width: window.innerWidth > 1000 ? 1000 : window.innerWidth,
    height: 500,
    bounds: USA_BOUNDS,
    padding: 20 // Optional padding around the bounds
  });

  const MIN_ZOOM_LEVEL = 10;

  const [hoverInfo, setHoverInfo] = useState<any>(null); // Specify the type of hoverInfo if known
  const [layerFilter, setLayerFilter] = useState<string[]>(['all']); // Specify the type of layerFilter if known
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
    const resizeMap = () => {
      if (mapRef.current) {
        const map = mapRef.current.getMap();
        map.fitBounds(USA_BOUNDS, { padding: 20 });
      }
    };

    window.addEventListener('resize', resizeMap);
    resizeMap(); // Call resizeMap on component mount to fit bounds on load

    return () => {
      window.removeEventListener('resize', resizeMap);
    };
  }, []);

  useEffect(() => {

    let bb_filter: any = ["all"]; // Specify the type of bb_filter if known
    let st_filter: any = ["all"]; // Specify the type of st_filter if known

    console.log("What is filter.state", filter.state);
    if (filter.state !== "all") {
      st_filter = ['==', ['get', 'state_abbr'], filter.state];
    }

    if (filter.bb_service === "served") {
      bb_filter = ['==', ['get', 'category'], "Served"];
    } else if (filter.bb_service === "underserved") {
      bb_filter = ['==', ['get', 'category'], "Underserved"];
    } else if (filter.bb_service === "unserved") {
      bb_filter = ['==', ['get', 'category'], "Unserved"];
    }

    let new_filter: any = ["all", bb_filter, st_filter]; // Specify the type of new_filter if known

    setLayerFilter(new_filter);

  }, [filter]);

  return (
    <Map
      ref={mapRef}
      initialViewState={{
        latitude: latitude,
        longitude: longitude,
        zoom: zoom
      }}
      mapStyle="mapbox://styles/mapbox/light-v9"
      mapboxAccessToken={mapboxToken}
      interactiveLayerIds={[bb_tr_100_20.layers[0]['id']]}
      onMouseMove={onHover}
      onMove={onMove}
    >
      <Source id={"mapbox-terrain"} type={"vector"} url={"mapbox://mapbox.mapbox-terrain-v2"} >
          <Layer {...contourStyle} >
          </Layer>
      </Source>
      {/*// Check if there is a pre-existing type definition for Source and Layer*/}
      <Source {...bb_tr_100_20.sources[0]} >
          <Layer 
            {...bb_tr_100_20.layers[0]} 
            filter={layerFilter}
          />
          {hoverInfo && (
            <div className="tooltip" style={{left: hoverInfo.x, top: hoverInfo.y}}>
              <div>
                <b>{hoverInfo.feature.properties.geoid_tr}</b>
                <br />
                {hoverInfo.feature.properties.state_abbr}
                <br />
                {hoverInfo.feature.properties.category}
              </div>
            </div>
          )}
      </Source>
      {map_zoom < MIN_ZOOM_LEVEL && (
        <div className={style["zoom-message"]}>Zoom closer to view data</div>
      )}
    </Map>
  );
};

export default GlMap;
