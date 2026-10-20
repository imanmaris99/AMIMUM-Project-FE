"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { handleGoogleLogin } from "@/lib/googleAuth";
import { sanitizeCustomerErrorMessage } from "@/lib/errorHandler";
import { takePostLoginRedirect } from "@/lib/authFlow";

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
          router.push(takePostLoginRedirect(sessionStorage, window.location.origin));
        }, 2000);
      } else {
        toast.error(result.message || "Login dengan Google gagal. Silakan coba lagi.");
      }
    } catch (error) {
      const errorMessage = sanitizeCustomerErrorMessage(
        error instanceof Error ? error.message : undefined,
        "Login dengan Google gagal. Silakan coba lagi."
      );
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading };
};
