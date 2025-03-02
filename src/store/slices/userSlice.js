import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuth: false,
  role: "",
  data: {},
  token: "",
  userId: "",
};

export const { actions: userActions, reducer: userReducers } = createSlice({
  name: "userData",
  initialState,
  reducers: {
    setUserData: (state, { payload }) => {
      state.data = payload;
    },
    setAuthorization: (state, { payload }) => {
      state.token = payload.token;
      state.isAuth = true;
      state.role = payload.role;
      state.userId = payload.userId;
    },
    logout: (state) => {
      state.isAuth = false;
      state.data = {};
      state.token = "";
      state.userId = "";
    },
  },
});
