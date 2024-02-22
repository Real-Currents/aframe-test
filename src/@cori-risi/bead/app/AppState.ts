import coriRisiAppState from "../../app/initialState.json";
import beadAppState from "./initialState.json";

const initialState = {
    ...coriRisiAppState,
    ...beadAppState
}

type AppState = typeof initialState;

export default AppState;
export { initialState };
