import { combineReducers, configureStore } from "@reduxjs/toolkit";
import AppState from "./AppState";
import {
    userIdReducer,
    userNameReducer,
    userTokensReducer
} from "../features/index";

const store =  configureStore({
    reducer: {
        user: combineReducers({
            userId: userIdReducer,
            username: userNameReducer,
            tokens: userTokensReducer,
            // ...
        })
    }
});

export default store;
export type { AppState };
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
