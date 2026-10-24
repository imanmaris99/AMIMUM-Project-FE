import axiosInstance from "../../../lib/axiosInstance";
import axios from "axios";
import { API_ENDPOINTS } from "../../../lib/apiConfig";
import { getRegisterErrorMessage } from "../../../lib/authFormValidation";

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
      throw new Error(getRegisterErrorMessage(status, error.response.data));
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Registrasi belum bisa diproses. Silakan coba lagi beberapa saat lagi.");
  }
};
