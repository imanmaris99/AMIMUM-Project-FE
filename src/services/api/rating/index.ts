import axios from "axios";
import { apiClient } from "@/lib/axiosClient";
import { API_ENDPOINTS } from "@/lib/apiConfig";

export interface ProductRatingItem {
  id: number;
  rate: number;
  review: string;
  product_name: string;
  rater_name?: string;
  created_at: string;
}

export interface ProductRatingListResponse {
  status_code: number;
  message: string;
  data: ProductRatingItem[];
}

export interface ProductRatingResponse {
  status_code: number;
  message: string;
  data: ProductRatingItem | {
    rate: number;
    review: string;
  } | {
    rating_id: number;
    rate: number;
    review: string;
    product_name: string;
  };
}

interface RatingErrorResponse {
  status_code?: number;
  error?: string;
  message?: string;
}

interface ValidationErrorResponse {
  detail?: Array<{ msg: string }>;
}

export interface CreateRatingPayload {
  productId: string;
  rate: number;
  review: string;
}

export interface UpdateRatingPayload {
  ratingId: number;
  rate: number;
  review: string;
}

const extractValidationMessage = (errorData: ValidationErrorResponse) => {
  if (!Array.isArray(errorData.detail)) {
    return "Data rating tidak lolos validasi.";
  }

  return errorData.detail.map((item) => item.msg).join(", ");
};

export const getMyProductRatings = async (): Promise<ProductRatingListResponse> => {
  try {
    const response = await apiClient.get<ProductRatingListResponse>(
      API_ENDPOINTS.RATING_MY_LIST
    );

    if (response?.status_code === 200 && Array.isArray(response.data)) {
      return response;
    }

    throw new Error(response?.message || "Gagal mengambil daftar rating.");
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      const errorData = error.response.data as RatingErrorResponse;

      if (status === 403) {
        throw new Error(errorData.message || "Not Authenticated.");
      }

      if (status === 404) {
        return {
          status_code: 200,
          message: errorData.message || "Belum ada rating produk.",
          data: [],
        };
      }

      if (status === 409) {
        throw new Error(
          errorData.message ||
            "Terjadi konflik saat mengambil data rating produk pengguna."
        );
      }

      if (status === 500) {
        throw new Error(
          errorData.message ||
            "Terjadi kesalahan di server saat mengambil data rating produk."
        );
      }

      throw new Error(errorData.message || "Gagal mengambil daftar rating.");
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Terjadi kesalahan yang tidak diketahui.");
  }
};

export const createProductRating = async (
  payload: CreateRatingPayload
): Promise<ProductRatingResponse> => {
  try {
    const response = await apiClient.post<ProductRatingResponse>(
      API_ENDPOINTS.RATING_CREATE(payload.productId),
      {
        rate: {
          product_id: payload.productId,
        },
        create_rate: {
          rate: payload.rate,
          review: payload.review,
        },
      }
    );

    if ((response?.status_code === 200 || response?.status_code === 201) && response.data) {
      return response;
    }

    throw new Error(response?.message || "Gagal membuat rating produk.");
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      const errorData = error.response.data as
        | RatingErrorResponse
        | ValidationErrorResponse;

      if (status === 403) {
        throw new Error(
          (errorData as RatingErrorResponse).message || "Not Authenticated."
        );
      }

      if (status === 404) {
        throw new Error(
          (errorData as RatingErrorResponse).message ||
            "Produk dengan ID ini tidak ditemukan atau pengguna tidak ditemukan."
        );
      }

      if (status === 409) {
        throw new Error(
          (errorData as RatingErrorResponse).message ||
            "Konflik saat menyimpan rating produk."
        );
      }

      if (status === 422) {
        throw new Error(extractValidationMessage(errorData as ValidationErrorResponse));
      }

      if (status === 500) {
        throw new Error(
          (errorData as RatingErrorResponse).message ||
            "Kesalahan tak terduga saat menyimpan rating produk."
        );
      }

      throw new Error(
        (errorData as RatingErrorResponse).message ||
          "Gagal membuat rating produk."
      );
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Terjadi kesalahan yang tidak diketahui.");
  }
};

export const updateProductRating = async (
  payload: UpdateRatingPayload
): Promise<ProductRatingResponse> => {
  try {
    const response = await apiClient.put<ProductRatingResponse>(
      API_ENDPOINTS.RATING_EDIT(payload.ratingId),
      {
        review_id_update: {
          rating_id: payload.ratingId,
        },
        review_update: {
          rate: payload.rate,
          review: payload.review,
        },
      }
    );

    if ((response?.status_code === 200 || response?.status_code === 201) && response.data) {
      return response;
    }

    throw new Error(response?.message || "Gagal memperbarui rating produk.");
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      const errorData = error.response.data as
        | RatingErrorResponse
        | ValidationErrorResponse;

      if (status === 403) {
        throw new Error(
          (errorData as RatingErrorResponse).message ||
            "Pengguna tidak diizinkan untuk memperbarui review ini."
        );
      }

      if (status === 404) {
        throw new Error(
          (errorData as RatingErrorResponse).message ||
            "Review dan rating untuk ID produk ini tidak ditemukan."
        );
      }

      if (status === 409) {
        throw new Error(
          (errorData as RatingErrorResponse).message ||
            "Konflik terjadi saat memperbarui review."
        );
      }

      if (status === 422) {
        throw new Error(extractValidationMessage(errorData as ValidationErrorResponse));
      }

      if (status === 500) {
        throw new Error(
          (errorData as RatingErrorResponse).message ||
            "Kesalahan tak terduga saat memperbarui review."
        );
      }

      throw new Error(
        (errorData as RatingErrorResponse).message ||
          "Gagal memperbarui rating produk."
      );
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Terjadi kesalahan yang tidak diketahui.");
  }
};

export const deleteProductRating = async (
  ratingId: number
): Promise<ProductRatingResponse> => {
  try {
    const response = await apiClient.delete<ProductRatingResponse>(
      API_ENDPOINTS.RATING_DELETE(ratingId),
      {
        data: {
          rating_id: ratingId,
        },
      }
    );

    if ((response?.status_code === 200 || response?.status_code === 201) && response.data) {
      return response;
    }

    throw new Error(response?.message || "Gagal menghapus rating produk.");
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      const errorData = error.response.data as
        | RatingErrorResponse
        | ValidationErrorResponse;

      if (status === 403) {
        throw new Error(
          (errorData as RatingErrorResponse).message ||
            "Token tidak valid atau pengguna tidak memiliki akses."
        );
      }

      if (status === 404) {
        throw new Error(
          (errorData as RatingErrorResponse).message ||
            "Review dengan ID ini tidak ditemukan atau tidak dimiliki oleh pengguna."
        );
      }

      if (status === 409) {
        throw new Error(
          (errorData as RatingErrorResponse).message ||
            "Konflik saat menghapus review."
        );
      }

      if (status === 422) {
        throw new Error(extractValidationMessage(errorData as ValidationErrorResponse));
      }

      if (status === 500) {
        throw new Error(
          (errorData as RatingErrorResponse).message ||
            "Kesalahan tak terduga saat menghapus review."
        );
      }

      throw new Error(
        (errorData as RatingErrorResponse).message ||
          "Gagal menghapus rating produk."
      );
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Terjadi kesalahan yang tidak diketahui.");
  }
};
