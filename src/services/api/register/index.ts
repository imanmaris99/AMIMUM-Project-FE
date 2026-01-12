import axiosInstance from "../../../lib/axiosInstance";
import axios from "axios";
import { API_ENDPOINTS } from "../../../lib/apiConfig";

export interface RegisterRequest {
  firstname: string;
  lastname: string;
  gender: "male" | "female";
  email: string;
  phone: string;
  password: string;
}

export interface RegisterResponse {
  status_code: number;
  message: string;
  data: {
    id: string;
    email: string;
    firstname: string;
    lastname: string;
    gender: string;
    phone: string;
    role: string;
    created_at: string;
    updated_at: string;
  };
}

export interface RegisterErrorResponse {
  status_code: number;
  error?: string;
  message: string;
  detail?: Array<{
    loc: (string | number)[];
    msg: string;
    type: string;
  }>;
}

export const postRegister = async (data: RegisterRequest): Promise<RegisterResponse> => {
  try {
    const response = await axiosInstance.post<RegisterResponse>(
      API_ENDPOINTS.USER_REGISTER,
      data
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      const errorData = error.response.data as RegisterErrorResponse;

      if (status === 400) {
        throw new Error(errorData.message || "Email atau nomor telepon sudah terdaftar.");
      }

      if (status === 422) {
        const validationErrors = errorData.detail || [];
        const errorMessages = validationErrors.map((err) => err.msg).join(", ");
        throw new Error(errorMessages || "Kesalahan validasi. Silakan periksa data yang Anda masukkan.");
      }

      if (status === 500) {
        throw new Error(errorData.message || "Kesalahan server saat membuat user. Silakan coba lagi nanti.");
      }

      throw new Error(errorData.message || "Gagal mendaftar. Silakan coba lagi.");
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Terjadi kesalahan yang tidak diketahui. Silakan coba lagi.");
  }
};
