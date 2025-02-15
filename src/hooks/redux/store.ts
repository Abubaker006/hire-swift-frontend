import { configureStore } from "@reduxjs/toolkit";
import authReducer,{AuthState} from "../slices/authSlice";

export interface RootState {
  auth: AuthState;
}

export function createStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState: preloadedState as RootState
  });
}

export const store = createStore();
export type AppDispatch = typeof store.dispatch;