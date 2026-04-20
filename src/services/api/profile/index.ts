import axios from "axios";
import axiosClient from "@/lib/axiosClient";
import { API_ENDPOINTS } from "@/lib/apiConfig";

export interface UserProfile {
  id: string;
  firebase_uid: string | null;
  firstname: string;
  lastname: string;
  gender: string;
  email: string;
  phone: string | null;
  address: string | null;
  photo_url: string | null;
  role: string;
  is_active: boolean;
  verification_code: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserProfileResponse {
  status_code: number;
  message: string;
  data: UserProfile;
}

interface UserProfileErrorResponse {
  status_code?: number;
  error?: string;
  message?: string;
}

export const getUserProfile = async (): Promise<UserProfileResponse> => {
  try {
    const response = await axiosClient.get<UserProfileResponse>(
      API_ENDPOINTS.USER_PROFILE
    );

    if (response.status === 200 && response.data) {
      return response.data;
    }

    throw new Error(
      response.data?.message || "Gagal mengambil profil pengguna."
    );
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      const errorData = error.response.data as UserProfileErrorResponse;

      if (status === 404) {
        throw new Error(errorData.message || "Pengguna tidak ditemukan.");
      }

      if (status === 409) {
        throw new Error(
          errorData.message || "Terjadi konflik saat mengambil profil pengguna."
        );
      }

      if (status === 500) {
        throw new Error(
          errorData.message || "Terjadi kesalahan saat mengambil profil pengguna."
        );
      }

      throw new Error(
        errorData.message || "Gagal mengambil profil pengguna."
      );
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Terjadi kesalahan yang tidak diketahui.");
  }
};
