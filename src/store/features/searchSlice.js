import { createSlice } from "@reduxjs/toolkit";

const INITIAL_STATE = {
  query: "",
};

const searchSlice = createSlice({
  name: "search",
  initialState: INITIAL_STATE,
  reducers: {
    setSearchQuery: (state, { payload }) => {
      state.query = payload;
    },
    resetSearchQuery: (state, { payload }) => {
      state.query = INITIAL_STATE.query;
    },
  },
});

export const searchReducer = searchSlice.reducer;
export const { setSearchQuery, resetSearchQuery } = searchSlice.actions;
export default searchSlice;
