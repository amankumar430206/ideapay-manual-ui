import { createSlice } from "@reduxjs/toolkit";
import secureLocalStorage from "react-secure-storage";

export const AUTH_LOCAL_VARIABLES = {
  active: "mnt-active",
  auth_token: "mnt-auth-token",
  user: "mnt-user",
};

const INITIAL_STATE = {
  authToken:
    secureLocalStorage.getItem(AUTH_LOCAL_VARIABLES.auth_token) || null,
  currentUser: secureLocalStorage.getItem(AUTH_LOCAL_VARIABLES.user) || null,
  currentUserId: null,
  currentRole: null,
  isLoggedIn: false,
  form: {},
};

const authSlice = createSlice({
  name: "auth",
  initialState: INITIAL_STATE,
  reducers: {
    InitAuth: (state) => {
      state.authToken =
        secureLocalStorage.getItem(AUTH_LOCAL_VARIABLES.auth_token) || null;
    },
    setCurrentUser: (state, { payload }) => {
      state.currentUser = payload;
      secureLocalStorage.setItem(AUTH_LOCAL_VARIABLES.user, payload);
    },
    setAuthToken: (state, { payload }) => {
      state.authToken = payload;
      secureLocalStorage.setItem(AUTH_LOCAL_VARIABLES.auth_token, payload);
    },
    setCurrentUserId: (state, { payload }) => {
      state.currentUserId = payload;
    },
    setCurrentRole: (state, { payload }) => {
      state.currentRole = payload;
    },
    setLoggedIn: (state, { payload }) => {
      state.isLoggedIn = payload;
    },
    setFormFields: (state, { payload }) => {
      state.form = payload;
    },
    clearAuth: (state, { payload }) => {
      state.form = {};
      state.currentUser = null;
      state.authToken = null;
      state.currentUserId = null;
      state.currentRole = null;
      state.isLoggedIn = false;
      secureLocalStorage.clear();
      sessionStorage.clear();
    },
  },
});

export const authReducer = authSlice.reducer;
export const {
  InitAuth,
  setLoggedIn,
  setAuthToken,
  clearAuth,
  setCurrentUser,
  setFormFields,
  setCurrentUserId,
  setCurrentRole,
} = authSlice.actions;
export default authSlice;
