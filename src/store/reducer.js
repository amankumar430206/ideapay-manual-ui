import { combineReducers } from "@reduxjs/toolkit";

// App Reducers
import { authReducer } from "./features/authSlice";

export default combineReducers({ auth: authReducer });
