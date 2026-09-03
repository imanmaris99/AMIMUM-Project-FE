import axios from "axios";
import { apiClient } from "@/lib/axiosClient";
import { API_ENDPOINTS } from "@/lib/apiConfig";

export interface CreatePaymentRequest {
  order_id: string;
}

export interface CreatePaymentResponse {
  status_code: number;
  message: string;
  data: {
    transaction_id: string;
    redirect_url?: string | null;
    token?: string | null;
    transaction_status: string;
  };
}

interface PaymentErrorResponse {
  status_code?: number;
  error?: string;
  message?: string;
  detail?:
    | string
    | {
        status_code?: number;
        error?: string;
        message?: string;
      }
    | Array<{
        msg?: string;
        message?: string;
      }>;
}

const getPaymentErrorMessage = (
  errorData: PaymentErrorResponse,
  fallbackMessage: string
) => {
  if (errorData.message) return errorData.message;
  if (typeof errorData.detail === "string") return errorData.detail;
  if (errorData.detail && !Array.isArray(errorData.detail)) {
    return errorData.detail.message || fallbackMessage;
  }
  if (Array.isArray(errorData.detail)) {
    const messages = errorData.detail
      .map((item) => item.msg || item.message)
      .filter(Boolean)
      .join(", ");
    if (messages) return messages;
  }
  return fallbackMessage;
};

export const createPayment = async (
  payload: CreatePaymentRequest
): Promise<CreatePaymentResponse> => {
  try {
    const response = await apiClient.post<CreatePaymentResponse>(
      API_ENDPOINTS.PAYMENTS_CREATE,
      payload
    );

    if (
      (response?.status_code === 200 || response?.status_code === 201) &&
      response.data?.transaction_id
    ) {
      return response;
    }

    throw new Error(response?.message || "Gagal membuat pembayaran.");
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      const errorData = error.response.data as PaymentErrorResponse;
      throw new Error(
        getPaymentErrorMessage(errorData, "Gagal membuat pembayaran.")
      );
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Terjadi kesalahan yang tidak diketahui.");
  }
};
