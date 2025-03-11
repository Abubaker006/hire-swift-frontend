import { configureStore } from "@reduxjs/toolkit";
import authReducer, { AuthState } from "../slices/authSlice";
import loaderReducer from "../slices/loaderSlice";
import assessmentReducer, {
  AssessmentValidatedData,
} from "../slices/assessmentSlice";
export interface RootState {
  auth: AuthState;
  loader: { isLoading: boolean };
  assessment: AssessmentValidatedData;
}

export function createStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: {
      auth: authReducer,
      loader: loaderReducer,
      assessment: assessmentReducer,
    },
    preloadedState: preloadedState as RootState,
  });
}

export const store = createStore();
export type AppDispatch = typeof store.dispatch;
