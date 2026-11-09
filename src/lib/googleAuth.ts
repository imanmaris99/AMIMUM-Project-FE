"use client";

import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../utils/firebase-config";
import { postGoogleLogin } from "@/services/api/google-login";
import { SessionManager } from "./auth";
import { sanitizeCustomerErrorMessage } from "./errorHandler";

export interface GoogleAuthResult {
  success: boolean;
  message?: string;
  user?: {
    id: string;
    email: string;
    name: string;
    firstname?: string;
    role: 'user' | 'admin';
    createdAt: Date;
    lastLogin: Date;
  };
}

export const handleGoogleLogin = async (): Promise<GoogleAuthResult> => {
  const loginRevision = SessionManager.captureSessionRevision();
  try {
    if (!SessionManager.supportsAuthCookieTransitions()) {
      throw new Error(SessionManager.AUTH_LOCK_UNSUPPORTED_MESSAGE);
    }
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const idToken = await user.getIdToken();

    if (!idToken) {
      throw new Error("Gagal mendapatkan token dari Google.");
    }

    let sessionUser: GoogleAuthResult['user'];
    let sessionCommitted = false;
    const response = await postGoogleLogin(
      { id_token: idToken },
      loginRevision,
      (loginResponse) => {
        if (loginResponse.status_code !== 200 || !loginResponse.data) return;
        const fallbackName = loginResponse.data.email.split('@')[0];
        const firstname = loginResponse.data.firstname?.trim();
        const lastname = loginResponse.data.lastname?.trim();
        sessionUser = {
          id: loginResponse.data.id,
          email: loginResponse.data.email,
          name: `${firstname ?? ''} ${lastname ?? ''}`.trim() || fallbackName,
          firstname: firstname || fallbackName,
          role: loginResponse.data.role === 'admin' ? 'admin' : 'user',
          createdAt: new Date(loginResponse.data.created_at),
          lastLogin: new Date(),
        };
        sessionCommitted = SessionManager.setSessionInAuthTransitionIfRevisionMatches(sessionUser, loginRevision);
      },
    );

    if (response.status_code === 200 && response.data && sessionUser && sessionCommitted) {
      return {
        success: true,
        message: response.message || "Login dengan Google berhasil!",
        user: sessionUser,
      };
    }

    throw new Error("Login dengan Google gagal. Silakan coba lagi.");
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message.includes("popup") || error.message.includes("cancelled") || error.message.includes("auth/popup-closed-by-user")) {
        return {
          success: false,
          message: "Login dengan Google dibatalkan.",
        };
      }

      if (error.message.includes("auth/") || error.name === "FirebaseError") {
        return {
          success: false,
          message: "Login Google belum bisa diproses. Silakan coba lagi beberapa saat lagi.",
        };
      }

      return {
        success: false,
        message: sanitizeCustomerErrorMessage(
          error.message,
          "Login dengan Google gagal. Silakan coba lagi."
        ),
      };
    }

    return {
      success: false,
      message: "Login Google belum bisa diproses. Silakan coba lagi beberapa saat lagi.",
    };
  }
};
