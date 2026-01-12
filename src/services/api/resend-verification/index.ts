import axiosInstance from "@/lib/axiosInstance";
import axios from "axios";
import { API_ENDPOINTS } from "@/lib/apiConfig";

export interface ResendVerificationRequest {
  email: string;
}

export interface ResendVerificationResponse {
  status_code: number;
  message: string;
  data: {
    email: string;
  };
}

export interface ResendVerificationErrorResponse {
  status_code: number;
  error?: string;
  message: string;
  detail?: Array<{
    loc: (string | number)[];
    msg: string;
    type: string;
  }>;
}

export const postResendVerification = async (data: ResendVerificationRequest): Promise<ResendVerificationResponse> => {
  try {
    const response = await axiosInstance.post<ResendVerificationResponse>(
      API_ENDPOINTS.USER_RESEND_VERIFICATION,
      data
    );

    if (response.data.status_code === 200 || response.data.status_code === 201) {
      return response.data;
    }

    throw new Error(response.data.message || "Gagal mengirim ulang email verifikasi. Silakan coba lagi.");
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
      const errorData = error.response.data as ResendVerificationErrorResponse;

      if (status === 404) {
        throw new Error(errorData.message || "Email tidak ditemukan.");
      }

      if (status === 422) {
        const validationErrors = errorData.detail || [];
        const errorMessages = validationErrors.map((err) => err.msg).join(", ");
        throw new Error(errorMessages || "Kesalahan validasi. Silakan periksa email yang Anda masukkan.");
      }

      if (status === 429) {
        throw new Error(errorData.message || "Terlalu banyak permintaan. Silakan coba lagi nanti.");
      }

      if (status === 500) {
        throw new Error(errorData.message || "Gagal mengirim ulang email verifikasi. Silakan coba lagi nanti.");
      }

      throw new Error(errorData.message || "Gagal mengirim ulang email verifikasi. Silakan coba lagi.");
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Terjadi kesalahan yang tidak diketahui. Silakan coba lagi.");
  }
};
