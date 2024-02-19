import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
    userIdReducer,
    userNameReducer
} from "../../features";
import {
    mapFiltersReducer
} from "../features";
import AppState from "./AppState";

const store =  configureStore({
    reducer: {
        user: combineReducers({
            userId: userIdReducer,
            username: userNameReducer
        }),
        mapFilters: mapFiltersReducer
    }
});

export default store;
export type { AppState };
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
