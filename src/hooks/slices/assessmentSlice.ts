// slices/assessmentSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AssessmentValidatedData } from "@/utils/Types";

const initialState: AssessmentValidatedData = {
  isLoading: false,
  isValid: false,
  message: "",
  assessmentData: null,
  status: "",
  token: null,
  scheduledDateTime: "",
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
