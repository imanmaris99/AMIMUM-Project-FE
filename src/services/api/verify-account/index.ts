import axiosInstance from "@/lib/axiosInstance";
import { AxiosError } from "axios";
import { toast } from "react-hot-toast";

type VerifyAccountData = {
  code: string;
  email: string;
};

export const postVerifyAccount = async (data: VerifyAccountData, onConfirm?: () => void) => {
  try {
    const response = await axiosInstance.post("/user/verify-email", data);
    toast.success("Verifikasi berhasil! Akun Anda telah terverifikasi dan dapat digunakan untuk login!");
    
    // Call onConfirm after a short delay to show the success message
    setTimeout(() => {
      if (onConfirm) {
        onConfirm();
      }
    }, 2000);

    return response;
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorMessage = error.response?.data?.detail?.message;
      toast.error(errorMessage || "Verifikasi gagal! Terjadi kesalahan. Silakan coba lagi.");
    } else {
      toast.error("Terjadi kesalahan yang tidak terduga. Silakan coba lagi.");
    }
  }
};
