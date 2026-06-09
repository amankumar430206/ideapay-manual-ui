import { createSlice } from "@reduxjs/toolkit";
import secureLocalStorage from "react-secure-storage";

export const AUTH_LOCAL_VARIABLES = {
  active: "mnt-active",
  auth_token: "mnt-auth-token",
  user: "mnt-user",
  permissions: "mnt-permissions",
  permissionsConfigured: "mnt-permissions-configured",
};

const INITIAL_STATE = {
  authToken:
    secureLocalStorage.getItem(AUTH_LOCAL_VARIABLES.auth_token) || null,
  currentUser: secureLocalStorage.getItem(AUTH_LOCAL_VARIABLES.user) || null,
  currentUserId: null,
  currentRole: null,
  isLoggedIn: false,
  // Enabled permission ids for the current user's role.
  permissions: secureLocalStorage.getItem(AUTH_LOCAL_VARIABLES.permissions) || null,
  // Whether the role has an explicit permission document saved. When false the
  // app stays permissive (legacy role behavior) to avoid lockouts pre-setup.
  permissionsConfigured:
    secureLocalStorage.getItem(AUTH_LOCAL_VARIABLES.permissionsConfigured) || false,
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
    setPermissions: (state, { payload }) => {
      const permissions = payload?.permissions || [];
      const configured = !!payload?.configured;
      state.permissions = permissions;
      state.permissionsConfigured = configured;
      secureLocalStorage.setItem(AUTH_LOCAL_VARIABLES.permissions, permissions);
      secureLocalStorage.setItem(
        AUTH_LOCAL_VARIABLES.permissionsConfigured,
        configured
      );
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
      state.permissions = null;
      state.permissionsConfigured = false;
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
  setPermissions,
} = authSlice.actions;
export default authSlice;
