import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AuthState {
  user: null | {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    contactNumber: string;
    role: string;
    tokens: number;
  };
  token: string | null;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (
      state,
      action: PayloadAction<{ user: AuthState["user"]; token: any }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.loading = false;
    },
    logoutSuccess: (state) => {
      state.user = null;
      state.token = null;
      state.loading = false;
    },
  },
});

export const { loginSuccess, logoutSuccess } = authSlice.actions;
export default authSlice.reducer;
