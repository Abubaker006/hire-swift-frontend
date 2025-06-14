import nextConfig from "../../next.config";
import axios from "axios";
const API_URL = nextConfig.env?.NEXT_PUBLIC_API_URL ?? "";
import { blockchainServiceAPIResponse } from "@/utils/Types";

export const recordValidationReport = async (
  token: string | null | undefined,
  assessmentCode: string | undefined
): Promise<blockchainServiceAPIResponse> => {
  try {
    if (!token || !assessmentCode) {
      throw new Error("Missing Required Paramters");
    }
    const response = await axios.post<blockchainServiceAPIResponse>(
      `${API_URL}/v1/blockchain/record-to-blockchain`,
      {
        assessmentCode,
      },
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
      throw error;
    }

    throw new Error(
      error instanceof Error ? error.message : "An unexpected error occurred"
    );
  }
};

export const validateAssessmentRecord = async (
  token: string | null | undefined,
  assessmentCode: string
): Promise<blockchainServiceAPIResponse> => {
  try {
    if (!token || !assessmentCode) {
      throw new Error("Missing Required Paramters");
    }
    const response = await axios.post<blockchainServiceAPIResponse>(
      `${API_URL}/v1/blockchain/validate-assessment-report`,
      {
        assessmentCode,
      },
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
      throw error;
    }
    throw new Error(
      error instanceof Error ? error.message : "An unexpected error occurred"
    );
  }
};
