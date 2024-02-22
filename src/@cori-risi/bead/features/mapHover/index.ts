import { createSlice } from '@reduxjs/toolkit';
import { initialState } from "../../app/AppState";

console.log("Initial state available in mapHoverSlice: ", initialState);

const initialStateWithMapHover = {
    ...initialState
}

export const mapHoverSlice = createSlice({
    initialState: initialStateWithMapHover.mapHover,
    name: "mapHover",
    reducers: {
        setMapHover: (mapHoverState, action) => {
            // console.log("Set Map Hover:", action);
            mapHoverState = {
                ...mapHoverState,
                ...action.payload
            };
            return mapHoverState;
        }
    }
});

export default mapHoverSlice.reducer;

export const {
    setMapHover,
} = mapHoverSlice.actions;

export const selectMapHover = (state: (typeof initialStateWithMapHover)) => {
    // console.log("AppState in selectMapHover:", state);
    // console.log("Return MapHover:", state.mapHover);
    return state.mapHover;
}
