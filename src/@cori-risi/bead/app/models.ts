
export interface BroadbandTechnology {
    [key: string]: string;
}

export interface FilterState {
    displayDataLayers: boolean;
    colorVariable: string;
    bb_service: {
        served: boolean;
        underserved: boolean;
        unserved: boolean;
    };
    isp_count: number[];
    total_locations: number[];
    locations_100_20: number[];
    locations_25_3: number[];
    isp_combos: string[];
    counties: string[];
    broadband_technology: string[];
    has_previous_funding: {
        yes: boolean;
        no: boolean;
    };
    disableSidebar: boolean;
    showSidebar: boolean;
    excludeDSL: boolean;
    isp_footprint: string
}

export interface HoverInfoState {
    x: number;
    y: number;
    feature: any
}

export interface IspNameLookup {
    [key: string]: string;
}

export interface IspIdLookup {
    [key: string]: string[];
}
