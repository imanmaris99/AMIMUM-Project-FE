import axiosInstance from "@/lib/axiosInstance";
import axios from "axios";
import { API_ENDPOINTS } from "@/lib/apiConfig";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  status_code: number;
  message: string;
  data: Record<string, unknown>;
}

export interface LoginErrorResponse {
  status_code: number;
  error?: string;
  message: string;
  detail?: Array<{
    loc: (string | number)[];
    msg: string;
    type: string;
  }>;
}

type AccountInactiveError = Error & {
  isAccountInactive?: boolean;
  statusCode?: number;
};

export const postLogin = async (data: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await axiosInstance.post<LoginResponse>(
      API_ENDPOINTS.USER_LOGIN,
      data
    );

    if (response.data.status_code === 200) {
      return response.data;
    }

    throw new Error(response.data.message || "Login gagal. Silakan coba lagi.");
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      const errorData = error.response.data as LoginErrorResponse;

      if (status === 401) {
        throw new Error(errorData.message || "Email atau password salah.");
      }

      if (status === 403) {
        const inactiveError: AccountInactiveError = new Error(
          errorData.message || "Akun Anda belum terverifikasi. Silakan verifikasi email Anda terlebih dahulu."
        );
        inactiveError.isAccountInactive = true;
        inactiveError.statusCode = 403;
        throw inactiveError;
      }

      if (status === 404) {
        throw new Error(errorData.message || "User dengan email yang diberikan tidak ditemukan.");
      }

      if (status === 422) {
        const validationErrors = errorData.detail || [];
        const errorMessages = validationErrors.map((err) => err.msg).join(", ");
        throw new Error(errorMessages || "Kesalahan validasi. Silakan periksa email dan password yang Anda masukkan.");
      }

      if (status === 429) {
        throw new Error(errorData.message || "Terlalu banyak percobaan login. Silakan coba lagi nanti.");
      }

      if (status === 500) {
        throw new Error(errorData.message || "Kesalahan server saat login. Silakan coba lagi nanti.");
      }

      throw new Error(errorData.message || "Login gagal. Silakan coba lagi.");
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Terjadi kesalahan yang tidak diketahui. Silakan coba lagi.");
  }
};
