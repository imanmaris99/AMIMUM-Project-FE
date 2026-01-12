import axiosInstance from "@/lib/axiosInstance";
import axios from "axios";
import { API_ENDPOINTS } from "@/lib/apiConfig";

export interface GoogleLoginRequest {
  id_token: string;
}

export interface GoogleLoginResponse {
  status_code: number;
  message: string;
  data: {
    id: string;
    firebase_uid: string;
    firstname: string;
    lastname: string;
    gender: string;
    email: string;
    phone: string;
    address: string;
    photo_url: string;
    role: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  };
}

export interface GoogleLoginErrorResponse {
  status_code: number;
  error?: string;
  message: string;
  detail?: Array<{
    loc: (string | number)[];
    msg: string;
    type: string;
  }>;
}

export const postGoogleLogin = async (data: GoogleLoginRequest): Promise<GoogleLoginResponse> => {
  try {
    const response = await axiosInstance.post<GoogleLoginResponse>(
      API_ENDPOINTS.USER_GOOGLE_LOGIN,
      data
    );

    if (response.data.status_code === 200) {
      return response.data;
    }

    throw new Error(response.data.message || "Login dengan Google gagal. Silakan coba lagi.");
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      const errorData = error.response.data as GoogleLoginErrorResponse;

      if (status === 401) {
        throw new Error(errorData.message || "Token tidak valid atau login gagal.");
      }

      if (status === 404) {
        throw new Error(errorData.message || "User dengan email dari Google tidak ditemukan.");
      }

      if (status === 422) {
        const validationErrors = errorData.detail || [];
        const errorMessages = validationErrors.map((err) => err.msg).join(", ");
        throw new Error(errorMessages || "Kesalahan validasi. Silakan coba lagi.");
      }

      if (status === 500) {
        throw new Error(errorData.message || "Kesalahan server saat login dengan Google. Silakan coba lagi nanti.");
      }

      throw new Error(errorData.message || "Login dengan Google gagal. Silakan coba lagi.");
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Terjadi kesalahan yang tidak diketahui. Silakan coba lagi.");
  }
};
