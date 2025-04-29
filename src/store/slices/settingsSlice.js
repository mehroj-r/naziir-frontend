import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isSidebarShown: true
};

export const { actions: settingsActions, reducer: settingsReducers } = createSlice({
  name: "settings",
  initialState,
  reducers: {
    // setUserData: (state, { payload }) => {
    //   state.data = payload;
    // },
    setSidebarShown: (state, { payload }) => {
      state.isSidebarShown = payload.isSidebarShown;
    },
    // logout: (state) => {
    //   state.isAuth = false;
    //   state.data = null;
    //   state.token = "";
    //   state.userId = "";
    //   state.role = ""
    // },
  },
});
