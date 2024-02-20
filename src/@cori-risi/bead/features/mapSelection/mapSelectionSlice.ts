import { createSlice } from '@reduxjs/toolkit';
import { initialState } from "../../app/AppState";

console.log("Initial state available in mapSelectionSlice: ", initialState);

const initialStateWithMapSelection = {
    ...initialState
}

export const mapSelectionSlice = createSlice({
    initialState: initialStateWithMapSelection.mapSelection,
    name: "mapSelection",
    reducers: {
        setMapSelection: (mapSelectionState, action) => {
            mapSelectionState = {
                ...mapSelectionState,
                ...action.payload
            };
            return mapSelectionState;
        }
    }
});

export default mapSelectionSlice.reducer;

export const {
    setMapSelection,
} = mapSelectionSlice.actions;

export const selectMapSelection = (state: (typeof initialStateWithMapSelection)) => {
    // console.log("AppState in selectMapSelection:", state);
    console.log("Return MapSelection:", state.mapSelection);
    return state.mapSelection;
}
