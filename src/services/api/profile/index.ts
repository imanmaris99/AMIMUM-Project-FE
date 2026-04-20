import axios from "axios";
import { apiClient } from "@/lib/axiosClient";
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

export interface EditProfileRequest {
  fullname: string;
  firstname: string;
  lastname: string;
  phone: string;
  address: string;
}

export interface EditProfileResponse {
  status_code: number | string;
  message: string;
  data: EditProfileRequest;
}

export interface EditPhotoResponse {
  status?: "success" | "error";
  status_code?: number | string;
  message: string;
  data: {
    photo_url: string;
  };
}

interface UserProfileErrorResponse {
  status_code?: number;
  error?: string;
  message?: string;
}

export const getUserProfile = async (): Promise<UserProfileResponse> => {
  try {
    const response = await apiClient.get<UserProfileResponse>(
      API_ENDPOINTS.USER_PROFILE
    );

    if (response?.status_code === 200 && response.data) {
      return response;
    }

    throw new Error(
      response?.message || "Gagal mengambil profil pengguna."
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

export const updateUserProfile = async (
  data: EditProfileRequest
): Promise<EditProfileResponse> => {
  try {
    const response = await apiClient.put<EditProfileResponse>(
      API_ENDPOINTS.USER_EDIT_INFO,
      data
    );

    if (
      (response?.status_code === 200 || response?.status_code === 201) &&
      response.data
    ) {
      return response;
    }

    throw new Error(
      response?.message || "Gagal memperbarui profil pengguna."
    );
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      const errorData = error.response.data as
        | UserProfileErrorResponse
        | { detail?: Array<{ msg: string }> };

      if (status === 400) {
        throw new Error(
          "Input data tidak valid."
        );
      }

      if (status === 404) {
        throw new Error(
          "Pengguna dengan ID yang diberikan tidak ditemukan."
        );
      }

      if (status === 422) {
        const validationErrors =
          "detail" in errorData && Array.isArray(errorData.detail)
            ? errorData.detail
            : [];
        const errorMessages = validationErrors
          .map((item) => item.msg)
          .join(", ");

        throw new Error(
          errorMessages || "Data profil tidak lolos validasi."
        );
      }

      if (status === 500) {
        throw new Error(
          (errorData as UserProfileErrorResponse).message ||
            "Terjadi kesalahan saat memperbarui profil pengguna."
        );
      }

      throw new Error(
        (errorData as UserProfileErrorResponse).message ||
          "Gagal memperbarui profil pengguna."
      );
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Terjadi kesalahan yang tidak diketahui.");
  }
};

export const updateUserPhoto = async (
  file: File
): Promise<EditPhotoResponse> => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.put<EditPhotoResponse>(
      API_ENDPOINTS.USER_EDIT_PHOTO,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    const isSuccessfulResponse =
      response?.data?.photo_url &&
      (response?.status === "success" ||
        response?.status_code === 200 ||
        response?.status_code === 201);

    if (isSuccessfulResponse) {
      return response;
    }

    throw new Error(
      response?.message || "Gagal memperbarui foto profil."
    );
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      const errorData = error.response.data as
        | UserProfileErrorResponse
        | { status?: string; message?: string; detail?: Array<{ msg: string }> };

      if (status === 400) {
        throw new Error(
          errorData.message ||
            "File format not allowed. Please upload one of the following formats: png, jpeg, jpg, webp"
        );
      }

      if (status === 401) {
        throw new Error(
          errorData.message ||
            "Unauthorized: Token JWT tidak valid atau kadaluarsa"
        );
      }

      if (status === 413) {
        throw new Error(
          errorData.message ||
            "File too large. Maximum allowed size is 300 KB"
        );
      }

      if (status === 422) {
        const validationErrors =
          "detail" in errorData && Array.isArray(errorData.detail)
            ? errorData.detail
            : [];
        const errorMessages = validationErrors
          .map((item) => item.msg)
          .join(", ");

        throw new Error(
          errorMessages || "File foto tidak lolos validasi."
        );
      }

      if (status === 500) {
        throw new Error(
          errorData.message || "Internal Server Error"
        );
      }

      throw new Error(
        errorData.message || "Gagal memperbarui foto profil."
      );
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Terjadi kesalahan yang tidak diketahui.");
  }
};
