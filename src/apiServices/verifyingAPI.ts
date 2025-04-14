import nextConfig from "../../next.config";
import axios from "axios";
const API_URL = nextConfig.env?.NEXT_PUBLIC_API_URL ?? "";

const float32ToArray = (floatArray: Float32Array): number[] =>
  Array.from(floatArray);

interface VerificationAPIResponse {
  status?: number;
  message: string;
  descriptor?: number[];
}

export const postFaceDescription = async (
  token: string | null,
  descriptor: Float32Array
): Promise<VerificationAPIResponse> => {
  try {
    const payload = {
      descriptor: float32ToArray(descriptor),
    };
    const response = await axios.post<VerificationAPIResponse>(
      `${API_URL}/v1/verification/post-verification-data`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const postViolations = async (
  token: string,
  reason: string
): Promise<VerificationAPIResponse> => {
  try {
    const payload = {
      reason,
    };
    const response = await axios.post<VerificationAPIResponse>(
      `${API_URL}/v1/verification/report-violation`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const getDescriptions = async (
  token: string | null
): Promise<VerificationAPIResponse> => {
  try {
    const response = await axios.get<VerificationAPIResponse>(
      `${API_URL}/v1/verification/get-descriptor`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }
};
