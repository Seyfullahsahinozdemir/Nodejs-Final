import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "../store/store";
export interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const initialState: AuthState = {
  token: null,
  isAuthenticated: false,
  isAdmin: false,
};

export const authSlice = createSlice({
  name: "authentication",
  initialState: initialState,
  reducers: {
    login(state, action) {
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.isAdmin = action.payload.isAdmin;
    },
    logout(state) {
      state.token = null;
      state.isAuthenticated = false;
      state.isAdmin = false;
      localStorage.removeItem("rememberMe");
      localStorage.removeItem("token");
    },
  },
});

export const authActions = authSlice.actions;

export const selectToken = (state: AppState) => state.authentication.token;

export const selectIsAdmin = (state: AppState) => state.authentication.isAdmin;

export const selectIsAuthenticated = (state: AppState) =>
  state.authentication.isAuthenticated;

export default authSlice.reducer;
