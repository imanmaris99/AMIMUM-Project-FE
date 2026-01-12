import axiosInstance from "@/lib/axiosInstance";
import axios from "axios";
import { API_ENDPOINTS } from "@/lib/apiConfig";

export interface ResetPasswordRequest {
  email: string;
  code: string;
  new_password: string;
}

export interface ResetPasswordResponse {
  status_code: number;
  message: string;
  data: {
    email: string;
    code: string;
    new_password: string;
  };
}

export interface ResetPasswordErrorResponse {
  status_code: number;
  error?: string;
  message: string;
  detail?: Array<{
    loc: (string | number)[];
    msg: string;
    type: string;
  }>;
}

export const postResetPassword = async (data: ResetPasswordRequest): Promise<ResetPasswordResponse> => {
  try {
    const response = await axiosInstance.post<ResetPasswordResponse>(
      API_ENDPOINTS.USER_RESET_PASSWORD,
      data
    );

    if (response.data.status_code === 200) {
      return response.data;
    }

    throw new Error(response.data.message || "Gagal reset password. Silakan coba lagi.");
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      const errorData = error.response.data as ResetPasswordErrorResponse;

      if (status === 400) {
        throw new Error(errorData.message || "Password tidak memenuhi kriteria. Password harus minimal 8 karakter, mengandung huruf besar, huruf kecil, angka, dan karakter spesial.");
      }

      if (status === 404) {
        throw new Error(errorData.message || "Email tidak ditemukan.");
      }

      if (status === 406) {
        throw new Error(errorData.message || "Code verifikasi tidak sesuai.");
      }

      if (status === 422) {
        const validationErrors = errorData.detail || [];
        const errorMessages = validationErrors.map((err) => err.msg).join(", ");
        throw new Error(errorMessages || "Kesalahan validasi. Silakan periksa data yang Anda masukkan.");
      }

      if (status === 500) {
        throw new Error(errorData.message || "Gagal reset password. Silakan coba lagi nanti.");
      }

      throw new Error(errorData.message || "Gagal reset password. Silakan coba lagi.");
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Terjadi kesalahan yang tidak diketahui. Silakan coba lagi.");
  }
};
