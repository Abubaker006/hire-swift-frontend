import nextConfig from "../../next.config";
import axios, { AxiosError } from "axios";
const API_URL = nextConfig.env?.NEXT_PUBLIC_API_URL ?? "";
import {
  ValidationResponse,
  ErrorResponse,
  StartAssessmentResponse,
  StartAssessmentEvaluationResponse,
} from "@/utils/Types";
import { saveAs } from "file-saver";

export const validateAssessment = async (
  token: string | null | undefined
): Promise<ValidationResponse> => {
  try {
    if (!token) {
      throw new Error("Missing required parameters");
    }

    const response = await axios.get<ValidationResponse>(
      `${API_URL}/v1/assessment/validate`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error;
    }

    throw new Error(
      error instanceof Error ? error.message : "An unexpected error occurred"
    );
  }
};

export const startAssessment = async (
  token: string | null
): Promise<StartAssessmentResponse> => {
  try {
    if (!token) {
      throw new Error("Missing required parameters.");
    }

    const response = await axios.post<StartAssessmentResponse>(
      `${API_URL}/v1/assessment/start-assessment`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ErrorResponse>;
      const errorMessage =
        axiosError.response?.data?.message || "Failed to validate assessment";
      throw new Error(errorMessage);
    }
    throw new Error(
      error instanceof Error ? error.message : "An unexpected error occured."
    );
  }
};

interface SubmitAnswerResponse {
  message: string;
}
export const submitAssessmentAnswer = async (
  token: string | null,
  questionId: string,
  answer: string,
  language: string
): Promise<SubmitAnswerResponse> => {
  try {
    if (!token || !questionId || !answer || !language) {
      throw new Error("Missing required parameters");
    }

    const payload = {
      questionId,
      answer,
      language,
    };
    const response = await axios.post<SubmitAnswerResponse>(
      `${API_URL}/v1/assessment/submit-answer`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ErrorResponse>;
      const errorMessage =
        axiosError.response?.data?.message || "Failed to Submit answer";
      throw new Error(errorMessage);
    }
    throw new Error(
      error instanceof Error ? error.message : "An unexpected error occured."
    );
  }
};

export const getEvaluatedAssessments = async <T>(
  token: string | null
): Promise<T> => {
  if (!token) {
    throw new Error("Token is required");
  }
  try {
    const response = await axios.get<T>(
      `${API_URL}/v1/assessment/get-all-assessments`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ErrorResponse>;
      const errorMessage =
        axiosError.response?.data?.message || "Failed to evaluate assessments";
      throw new Error(errorMessage);
    }
    throw new Error(
      error instanceof Error ? error.message : "An unexpected error occured."
    );
  }
};

export const startAssessmentEvaluation = async (
  token: string | null
): Promise<StartAssessmentEvaluationResponse> => {
  try {
    const response = await axios.post(
      `${API_URL}/v1/assessment/start-evaluation`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ErrorResponse>;
      const errorMessage =
        axiosError.response?.data?.message || "Failed to evaluate assessment";
      throw new Error(errorMessage);
    }
    throw new Error(
      error instanceof Error ? error.message : "An unexpected error occured."
    );
  }
};

interface GenerateReportResponse {
  success: boolean;
  message?: string;
}

export const getAssessmentReport = async (
  token: string | null,
  userId: string,
  jobId: string,
  assessmentCode: string
): Promise<GenerateReportResponse> => {
  try {
    const payload = {
      userId,
      jobId,
      assessmentCode,
    };
    if (!token || !userId || !jobId || !assessmentCode) {
      console.log(payload);
      throw new Error("Required parameters not found");
    }
    const response = await axios.post<Blob>(
      `${API_URL}/v1/assessment/generate-report`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "arraybuffer",
      }
    );

    const blob = new Blob([response.data], { type: "application/pdf" });
    saveAs(blob, "assessment-report.pdf");

    return { success: true, message: "Report Downloaed Sucessfully." };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ErrorResponse>;
      const errorMessage =
        axiosError.response?.data?.message || "Failed to Generate Report";
      throw new Error(errorMessage);
    }
    throw new Error(
      error instanceof Error ? error.message : "An unexpected error occured."
    );
  }
};
