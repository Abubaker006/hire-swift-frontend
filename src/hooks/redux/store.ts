import { configureStore } from "@reduxjs/toolkit";
import authReducer, { AuthState } from "../slices/authSlice";
import loaderReducer from "../slices/loaderSlice";

export interface RootState {
  auth: AuthState;
  loader: { isLoading: boolean };
}

export function createStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: {
      auth: authReducer,
      loader: loaderReducer,
    },
    preloadedState: preloadedState as RootState,
  });
}

export const store = createStore();
export type AppDispatch = typeof store.dispatch;
