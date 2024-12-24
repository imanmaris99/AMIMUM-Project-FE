import axiosInstance from "@/lib/axiosInstance";
import { AxiosError } from "axios";
import Swal from "sweetalert2";

type VerifyAccountData = {
  code: string;
  email: string;
};

export const postVerifyAccount = async (data: VerifyAccountData, onConfirm?: () => void) => {
  try {
    const response = await axiosInstance.post("/user/verify-email", data);
    Swal.fire({
      title: "Verifikasi Berhasil!",
      text: "Akunmu sekarang telah terverifikasi dan dapat digunakan untuk login!",
      icon: "success",
      confirmButtonText: "Log In di sini!",
      confirmButtonColor: "#00764F",
      customClass: {
        popup: "shadow-lg rounded-lg",
        title: "text-lg font-bold",
        confirmButton: "bg-green-600 text-white hover:bg-green-700",
      },
    }).then((result) => {
      if (result.isConfirmed && onConfirm) {
        onConfirm();
      }
    });

    return response;
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorMessage = error.response?.data?.detail?.message;
      Swal.fire({
        title: "Verifikasi Gagal!",
        text: errorMessage || "Terjadi kesalahan. Silakan coba lagi.",
        icon: "error",
        confirmButtonText: "Coba Lagi",
        customClass: {
          popup: "shadow-lg rounded-lg",
          title: "text-lg font-bold",
          confirmButton: "bg-red-600 text-white hover:bg-red-700",
        },
      });
    } else {
      console.error("Unexpected error:", error);
    }
  }
};
