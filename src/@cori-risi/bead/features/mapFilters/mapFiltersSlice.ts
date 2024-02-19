import { createSlice } from '@reduxjs/toolkit';
import { initialState } from "../../app/AppState";

console.log("Initial state available in mapFiltersSlice: ", initialState);

const initialStateWithMapFilters = {
    ...initialState,
    user: {
        ...initialState.user,
        "bids": {
            "all": [],
            "current": null
        }
    }
}

export const mapFiltersSlice = createSlice({
    initialState: initialStateWithMapFilters.mapFilters,
    name: "mapFilters",
    reducers: {
        setMapFilters: (mapFilterState, action) => {
            // console.log("Add user bid:", action.payload);
            mapFilterState = {
                ...mapFilterState,
                ...action.payload
            };
            return mapFilterState;
        }
    }
});

export default mapFiltersSlice.reducer;

export const {
    setMapFilters,
} = mapFiltersSlice.actions;

export const selectMapFilters = (state: (typeof initialStateWithMapFilters)) => {
    // console.log("AppState in selectMapFilters:", state);
    // console.log("Return MapFilters:", state.mapFilters);
    return state.mapFilters;
}
