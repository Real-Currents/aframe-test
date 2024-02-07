import userReducer, {
    updateUser,
    selectUser
} from "./user/userSlice";

import userIdReducer,  {
    updateUserId,
    selectUserId,
} from "./user/userIdSlice";

import userNameReducer, {
    updateUserName,
    selectUserName,
} from "./user/userNameSlice";

import userTokensReducer, {
    updateUserTokens,
    selectUserTokens
} from "./user/userTokenSlice";

export {
    userReducer,
    userIdReducer,
    userNameReducer,
    userTokensReducer,
    updateUser,
    updateUserId,
    updateUserName,
    updateUserTokens,
    selectUser,
    selectUserId,
    selectUserName,
    selectUserTokens
};
