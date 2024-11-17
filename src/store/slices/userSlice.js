import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuth: false,
  data: {},
  token: "",
};

export const { actions: userActions, reducer: userReducers } = createSlice({
  name: "userData",
  initialState,
  reducers: {
    setUserData: (state, { payload }) => {
      state.data = payload;
    },
    setToken: (state, { payload }) => {
      state.token = payload;
      state.isAuth = true;
    },
    logout: (state, { payload }) => {
      state.isAuth = false;
      state.data = {};
      state.token = "";
    }
  },
});
