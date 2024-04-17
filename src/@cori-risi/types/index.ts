export interface GeoJSONFeature {
    type: string;
    id: string,
    properties: {
        [key: string]: any; // You might want to define a more specific type here
    }
    geometry: {
        coordinates: number[],
        type: string
    }
}

export interface PrettyTableInput {
    [key: string]: number | string | boolean
}

export interface BlockLevelFeature {
    "properties": {
        [key: string]: string | number | boolean;
        "geoid_bl": string;
    };
}