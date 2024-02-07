import coriRisiAppState from "./initialState.json";

const initialState = {
    ...coriRisiAppState
}

type AppState = typeof initialState; // ... can (should?) alternatively define AppState in it's own type file

export default AppState;
export { initialState };
