
export interface BroadbandTechnology {
    [key: string]: string;
}

export interface FilterState {
    colorVariable: string;
    bb_service: {
        served: boolean;
        underserved: boolean;
        unserved: boolean;
    };
    isp_count: number[];
    total_locations: number[];
    isp_combos: string[];
    counties: string[];
    broadband_technology: string[];
    has_previous_funding: {
        yes: boolean;
        no: boolean;
    };
    disableSidebar: boolean;
    showSidebar: boolean;
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
