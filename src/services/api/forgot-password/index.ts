import axiosInstance from "@/lib/axiosInstance";
import axios from "axios";
import { API_ENDPOINTS } from "@/lib/apiConfig";

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  status_code: number;
  message: string;
  data: {
    email: string;
  };
}

export interface ForgotPasswordErrorResponse {
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
        loc: (string | number)[];
        msg: string;
        type: string;
      }>;
}

const EMAIL_SERVICE_ERROR_MESSAGE =
  "Layanan email sementara belum tersedia. Silakan coba beberapa saat lagi.";

const sanitizeForgotPasswordError = (message?: string): string | undefined => {
  if (!message) return undefined;

  const technicalMarkers = [
    "Brevo",
    "unrecognised IP",
    "unauthorized",
    "Bad Gateway",
    "Internal Server Error",
    "Unexpected error occurred",
    "SMTP",
    "502",
  ];

  if (technicalMarkers.some((marker) => message.includes(marker))) {
    return EMAIL_SERVICE_ERROR_MESSAGE;
  }

  return message;
};

const getErrorMessage = (errorData: ForgotPasswordErrorResponse): string | undefined => {
  if (errorData.message) return sanitizeForgotPasswordError(errorData.message);
  if (typeof errorData.detail === "string") {
    return sanitizeForgotPasswordError(errorData.detail);
  }
  if (errorData.detail && !Array.isArray(errorData.detail)) {
    return sanitizeForgotPasswordError(errorData.detail.message);
  }
  return undefined;
};

export const postForgotPassword = async (data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> => {
  try {
    const response = await axiosInstance.post<ForgotPasswordResponse>(
      API_ENDPOINTS.USER_FORGOT_PASSWORD,
      data
    );

    if (response.data.status_code === 200) {
      return response.data;
    }

    throw new Error(response.data.message || "Gagal mengirim email reset password. Silakan coba lagi.");
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && !error.response) {
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        throw new Error("Request timeout. Silakan coba lagi.");
      }
      if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
        throw new Error("Tidak dapat terhubung ke server. Periksa koneksi internet Anda.");
      }
      throw new Error("Terjadi kesalahan jaringan. Silakan coba lagi.");
    }

    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      const errorData = error.response.data as ForgotPasswordErrorResponse;

      if (status === 400) {
        throw new Error(getErrorMessage(errorData) || "Email domain tidak didukung. Gunakan email dari gmail.com, yahoo.com, atau outlook.com.");
      }

      if (status === 404) {
        throw new Error(getErrorMessage(errorData) || "Email tidak ditemukan.");
      }

      if (status === 422) {
        const validationErrors = Array.isArray(errorData.detail) ? errorData.detail : [];
        const errorMessages = validationErrors.map((err) => err.msg).join(", ");
        throw new Error(errorMessages || getErrorMessage(errorData) || "Kesalahan validasi. Silakan periksa email yang Anda masukkan.");
      }

      if (status === 500) {
        throw new Error(getErrorMessage(errorData) || "Gagal mengirim email reset password. Silakan coba lagi nanti.");
      }

      throw new Error(getErrorMessage(errorData) || "Gagal mengirim email reset password. Silakan coba lagi.");
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Terjadi kesalahan yang tidak diketahui. Silakan coba lagi.");
  }
};
