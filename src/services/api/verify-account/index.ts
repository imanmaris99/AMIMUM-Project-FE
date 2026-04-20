import axiosInstance from "@/lib/axiosInstance";
import axios from "axios";
import { toast } from "react-hot-toast";
import { API_ENDPOINTS } from "@/lib/apiConfig";

export interface VerifyAccountRequest {
  code: string;
  email: string;
}

export interface VerifyAccountResponse {
  status_code: number;
  message: string;
  data: {
    code: string;
    email: string;
    firstname: string;
    lastname: string;
    gender: string;
    role: string;
    is_active: boolean;
  };
}

export interface VerifyAccountErrorResponse {
  detail?: Array<{
    loc: (string | number)[];
    msg: string;
    type: string;
  }>;
}

export const postVerifyAccount = async (
  data: VerifyAccountRequest,
  onConfirm?: () => void
): Promise<VerifyAccountResponse | void> => {
  try {
    const response = await axiosInstance.post<VerifyAccountResponse>(
      API_ENDPOINTS.USER_VERIFY_EMAIL,
      data
    );

    if (response.data.status_code === 0) {
      toast.success(response.data.message || "Verifikasi berhasil! Akun Anda telah terverifikasi dan dapat digunakan untuk login!");
      
      setTimeout(() => {
        if (onConfirm) {
          onConfirm();
        }
      }, 2000);

      return response.data;
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      const errorData = error.response.data as VerifyAccountErrorResponse;

      if (status === 422) {
        const validationErrors = errorData.detail || [];
        const errorMessages = validationErrors.map((err) => err.msg).join(", ");
        toast.error(errorMessages || "Kesalahan validasi. Silakan periksa kode verifikasi dan email yang Anda masukkan.");
      } else {
        const errorMessage = error.response.data?.message || "Verifikasi gagal! Terjadi kesalahan. Silakan coba lagi.";
        toast.error(errorMessage);
      }
    } else if (error instanceof Error) {
      toast.error(error.message || "Terjadi kesalahan yang tidak terduga. Silakan coba lagi.");
    } else {
      toast.error("Terjadi kesalahan yang tidak terduga. Silakan coba lagi.");
    }
  }
};
