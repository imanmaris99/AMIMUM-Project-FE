"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { handleGoogleLogin } from "@/lib/googleAuth";

export const useGoogleLogin = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const login = async () => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      const result = await handleGoogleLogin();

      if (result.success) {
        toast.success(result.message || "Login dengan Google berhasil! Mengarahkan ke halaman utama...");

        setTimeout(() => {
          const redirectUrl = sessionStorage.getItem('redirectAfterLogin');
          if (redirectUrl) {
            sessionStorage.removeItem('redirectAfterLogin');
            router.push(redirectUrl);
          } else {
            router.push("/");
          }
        }, 2000);
      } else {
        toast.error(result.message || "Login dengan Google gagal. Silakan coba lagi.");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Login dengan Google gagal. Silakan coba lagi.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading };
};
