import { createSlice } from "@reduxjs/toolkit";
import initialState from "../../app/initialState.json";

// console.log("Initial state available in userTokensSlice: ", initialState);

export const userTokensSlice = createSlice({
    initialState: initialState.user.tokens,
    name: "tokens",
    reducers: {
        updateUserTokens: (tokens, action) => {
            console.log("Set tokens: ", action.payload);
            if (typeof action.payload === "object" && action.payload !== null) {
                tokens = action.payload;
            }
            return tokens;
        }
    }
});

export default userTokensSlice.reducer;

export const {
    updateUserTokens
} = userTokensSlice.actions;

export const selectUserTokens = (state: (typeof initialState)) => {
    // console.log("AppState in selectUser:", state);
    // console.log("Return state.user.tokens:", state.user.tokens);
    return state.user.tokens;
}

export const selectUser = (state: (typeof initialState)) => {
    // console.log("AppState in selectUser:", state);
    // console.log("Return state.user:", state.user);
    return state.user;
}
