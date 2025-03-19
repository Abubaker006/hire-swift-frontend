export interface AssessmentValidatedData {
  isLoading: boolean;
  isValid: boolean;
  message: string;
  assessmentData: AssessmentData | null;
  status: string;
  scheduledDateTime: string | null;
  token?: string | null;
  error: string | null;
}

export interface UseAssessmentValidationResponse {
  data: AssessmentValidatedData | null;
  isValidating: boolean;
}

export interface AssessmentData {
  scheduled: boolean;
  taken: boolean;
  passed?: boolean;
  overallScore: number | null;
}

export interface BaseValidationResponse {
  message: string;
  canStart: boolean;
  scheduledDateTime: string;
  status: string;
  assessment: AssessmentData;
}

export interface ErrorResponse {
  message: string;
}

export type ValidationResponse = BaseValidationResponse;

export interface AssessmentQuestion {
  id: string;
  question: string;
  type: string;
  difficulty: string;
  classification: string;
  timeLimit: string;
}

export interface StartAssessmentSuccessResponse {
  message: string;
  canStart: boolean;
  scheduledDateTime: string;
  questions: AssessmentQuestion[] | null;
  totalTime: number | null;
  token: string | null;
  status: string;
  assessment: AssessmentData;
}

export type StartAssessmentResponse = StartAssessmentSuccessResponse;
