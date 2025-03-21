import nextConfig from "../../next.config";
import axios, { AxiosError } from "axios";
const API_URL = nextConfig.env?.NEXT_PUBLIC_API_URL ?? "";
import {
  ValidationResponse,
  ErrorResponse,
  StartAssessmentResponse,
} from "@/utils/Types";

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
