import { SessionManager } from '@/lib/auth';
import axios from "axios";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  status_code: number;
  message: string;
  data: Record<string, unknown>;
}

export interface LoginErrorResponse {
  status_code: number;
  error?: string;
  message: string;
  detail?: Array<{
    loc: (string | number)[];
    msg: string;
    type: string;
  }>;
}

type LoginRecoveryError = Error & {
  statusCode?: number;
  mayNeedVerification?: boolean;
};

export const postLogin = async (
  data: LoginRequest,
  loginRevision: string | null,
  onComplete?: (response: LoginResponse) => void,
): Promise<LoginResponse> =>
  SessionManager.withSessionRevisionTransition(loginRevision, async (getCsrfToken) => {
  try {
    const token = await getCsrfToken();
    const response = await axios.post<LoginResponse>('/api/auth/login', data, {
      withCredentials: true,
      headers: { 'X-CSRF-Token': token },
    });

    if (response.data.status_code === 200) {
      return response.data;
    }

    throw new Error(response.data.message || "Login gagal. Silakan coba lagi.");
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      const errorData = error.response.data as LoginErrorResponse;

      if (status === 401 || status === 403) {
        const invalidError: LoginRecoveryError = new Error("Email atau password tidak valid.");
        invalidError.statusCode = status;
        invalidError.mayNeedVerification = true;
        throw invalidError;
      }

      if (status === 404) {
        throw new Error("Email atau password tidak valid.");
      }

      if (status === 422) {
        const validationErrors = errorData.detail || [];
        const errorMessages = validationErrors.map((err) => err.msg).join(", ");
        throw new Error(errorMessages || "Kesalahan validasi. Silakan periksa email dan password yang Anda masukkan.");
      }

      if (status === 429) {
        throw new Error("Terlalu banyak percobaan login. Silakan coba lagi nanti.");
      }

      if (status === 500) {
        throw new Error("Login belum bisa diproses. Silakan coba lagi beberapa saat lagi.");
      }

      throw new Error("Login belum bisa diproses. Silakan coba lagi beberapa saat lagi.");
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Login belum bisa diproses. Silakan coba lagi beberapa saat lagi.");
  }
}, onComplete);
