import { createSlice } from '@reduxjs/toolkit';
import { initialState } from "../../app/AppState";

console.log("Initial state available in mapFiltersSlice: ", initialState);

const initialStateWithMapFilters = {
    ...initialState
}

export const index = createSlice({
    initialState: initialStateWithMapFilters.mapFilters,
    name: "mapFilters",
    reducers: {
        setMapFilters: (mapFilterState, action) => {
            mapFilterState = {
                ...mapFilterState,
                ...action.payload
            };
            return mapFilterState;
        }
    }
});

export default index.reducer;

export const {
    setMapFilters,
} = index.actions;

export const selectMapFilters = (state: (typeof initialStateWithMapFilters)) => {
    // console.log("AppState in selectMapFilters:", state);
    // console.log("Return MapFilters:", state.mapFilters);
    return state.mapFilters;
}
