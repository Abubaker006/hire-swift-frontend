import axios, { AxiosResponse, AxiosError } from "axios";
import { ErrorResponse } from "@/utils/Types";

interface CheckoutSessionResponse {
  id: string;
  url: string;
}

const stripeApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const createCheckoutSession = async (
  token: string | null,
  amount: number
): Promise<CheckoutSessionResponse> => {
  try {
    if (!token) throw new Error("Unauthorized.");
    const response: AxiosResponse<CheckoutSessionResponse> =
      await stripeApi.post(
        "/v1/stripe/create-checkout-session",
        { amount }, 
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
