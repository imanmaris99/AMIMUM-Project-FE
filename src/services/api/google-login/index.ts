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
    token?: string;
    access_token?: string;
    jwt?: string;
    auth_token?: string;
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
        throw new Error("Login Google belum bisa diproses. Silakan coba lagi beberapa saat lagi.");
      }

      if (status === 404) {
        throw new Error("Akun Google belum terdaftar. Silakan daftar terlebih dahulu.");
      }

      if (status === 422) {
        const validationErrors = errorData.detail || [];
        const errorMessages = validationErrors.map((err) => err.msg).join(", ");
        throw new Error(errorMessages || "Kesalahan validasi. Silakan coba lagi.");
      }

      if (status === 500) {
        throw new Error("Login Google belum bisa diproses. Silakan coba lagi beberapa saat lagi.");
      }

      throw new Error("Login Google belum bisa diproses. Silakan coba lagi beberapa saat lagi.");
    }

    if (axios.isAxiosError(error) && error.request) {
      throw new Error("Tidak dapat terhubung ke server. Periksa koneksi internet Anda.");
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Login Google belum bisa diproses. Silakan coba lagi beberapa saat lagi.");
  }
};
