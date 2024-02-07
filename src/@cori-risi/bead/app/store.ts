import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
    userIdReducer,
    userNameReducer,
    userTokensReducer
} from "../../features";
import {
    counterReducer
} from "../features";
import AppState from "./AppState";

const store =  configureStore({
    reducer: {
        user: combineReducers({
            userId: userIdReducer,
            username: userNameReducer,
            tokens: userTokensReducer,
            // ...
        }),
        counter: counterReducer
    }
});

export default store;
export type { AppState };
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
