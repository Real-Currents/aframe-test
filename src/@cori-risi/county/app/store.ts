import { combineReducers, configureStore } from "@reduxjs/toolkit";
import AppState from "./AppState";
import {
    userIdReducer,
    userNameReducer
} from "../../features";
import {
    mapFiltersReducer,
    mapHoverReducer,
    mapSelectionReducer
} from "../features";

const store =  configureStore({
    reducer: {
        user: combineReducers({
            userId: userIdReducer,
            username: userNameReducer
        }),
        mapFilters: mapFiltersReducer,
        mapHover: mapHoverReducer,
        mapSelection: mapSelectionReducer
    }
});

export default store;
export type { AppState };
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
