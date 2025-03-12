import nextConfig from "../../next.config";
import axios, { AxiosError } from "axios";
const API_URL = nextConfig.env?.NEXT_PUBLIC_API_URL ?? "";

interface AssessmentData {
  scheduled: boolean;
  taken: boolean;
  passed: boolean;
  overallScore: number | null;
}

export interface ValidationResponse {
  message: string;
  scheduledDateTime: string;
  status: string;
  assessment: AssessmentData;
  token?: string;
}
interface ErrorResponse {
  message: string;
}

export const validateAssessment = async (
  token: string | null
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
      const axiosError = error as AxiosError<ErrorResponse>;
      const errorMessage =
        axiosError.response?.data?.message || "Failed to validate assessment";
      throw new Error(errorMessage);
    }

    throw new Error(
      error instanceof Error ? error.message : "An unexpected error occurred"
    );
  }
};
