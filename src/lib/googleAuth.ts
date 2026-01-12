"use client";

import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../utils/firebase-config";
import { postGoogleLogin } from "@/services/api/google-login";
import { SessionManager, generateSecureToken } from "./auth";

export interface GoogleAuthResult {
  success: boolean;
  message?: string;
  user?: {
    id: string;
    email: string;
    name: string;
    role: 'user' | 'admin';
    createdAt: Date;
    lastLogin: Date;
  };
}

export const handleGoogleLogin = async (): Promise<GoogleAuthResult> => {
  try {
    // Sign in with Google using Firebase
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Get ID token from Firebase
    const idToken = await user.getIdToken();

    if (!idToken) {
      throw new Error("Gagal mendapatkan token dari Google.");
    }

    // Call backend API with ID token
    const response = await postGoogleLogin({
      id_token: idToken,
    });

    if (response.status_code === 200 && response.data) {
      // Create session from API response
      const sessionUser = {
        id: response.data.id,
        email: response.data.email,
        name: `${response.data.firstname} ${response.data.lastname}`.trim() || response.data.email.split('@')[0],
        role: response.data.role === 'admin' ? ('admin' as const) : ('user' as const),
        createdAt: new Date(response.data.created_at),
        lastLogin: new Date(),
      };

      const token = {
        token: generateSecureToken(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        refreshToken: generateSecureToken(),
      };

      // Store secure session
      SessionManager.setSession(sessionUser, token);

      return {
        success: true,
        message: response.message || "Login dengan Google berhasil!",
        user: sessionUser,
      };
    }

    throw new Error("Login dengan Google gagal. Silakan coba lagi.");
  } catch (error: unknown) {
    if (error instanceof Error) {
      // Check if it's a Firebase error
      if (error.message.includes("popup") || error.message.includes("cancelled")) {
        return {
          success: false,
          message: "Login dengan Google dibatalkan.",
        };
      }

      return {
        success: false,
        message: error.message || "Login dengan Google gagal. Silakan coba lagi.",
      };
    }

    return {
      success: false,
      message: "Terjadi kesalahan yang tidak diketahui. Silakan coba lagi.",
    };
  }
};
