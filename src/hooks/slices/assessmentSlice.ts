// slices/assessmentSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AssessmentData {
  scheduled: boolean;
  taken: boolean;
  passed: boolean;
  overallScore: number | null;
}

export interface AssessmentValidatedData {
  isLoading: boolean;
  isValid: boolean;
  message: string;
  assessmentData: AssessmentData | null;
  status: string | null;
  scheduledDateTime: string | Date | null;
  token?: string;
  error: any;
}

const initialState: AssessmentValidatedData = {
  isLoading: false,
  isValid: false,
  message: "",
  assessmentData: null,
  status: null,
  scheduledDateTime: null,
  token: undefined,
  error: null,
};

const assessmentSlice = createSlice({
  name: "assessment",
  initialState,
  reducers: {
    setValidationStatus: (
      state,
      action: PayloadAction<AssessmentValidatedData>
    ) => {
      return { ...state, ...action.payload };
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    resetValidation: () => initialState,
  },
});

export const { setValidationStatus, setLoading, resetValidation } =
  assessmentSlice.actions;
export default assessmentSlice.reducer;
