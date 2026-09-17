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

const validateRatingInput = (rate: number, review: string) => {
  const safeRate = Number(rate);

  if (!Number.isInteger(safeRate) || safeRate < 1 || safeRate > 5) {
    throw new Error("Pilih rating 1 sampai 5 bintang sebelum menyimpan ulasan.");
  }

  if (review.length > 500) {
    throw new Error("Ulasan maksimal 500 karakter.");
  }
};

const safeValidationMessage = (errorData: ValidationErrorResponse) => {
  if (!Array.isArray(errorData.detail) || errorData.detail.length === 0) {
    return "Data rating belum valid. Periksa rating dan ulasan lalu coba lagi.";
  }

  return "Data rating belum valid. Periksa rating dan ulasan lalu coba lagi.";
};

const ratingActionMessage = (action: "load" | "create" | "update" | "delete") => {
  switch (action) {
    case "load":
      return "Rating Anda belum bisa dimuat. Silakan coba lagi beberapa saat lagi.";
    case "create":
      return "Rating produk belum bisa disimpan. Silakan coba lagi beberapa saat lagi.";
    case "update":
      return "Rating produk belum bisa diperbarui. Silakan coba lagi beberapa saat lagi.";
    case "delete":
      return "Rating produk belum bisa dihapus. Silakan coba lagi beberapa saat lagi.";
  }
};

const ratingAuthMessage = () => "Silakan login kembali untuk mengelola rating produk.";

const ratingNotFoundMessage = (action: "load" | "create" | "update" | "delete") => {
  if (action === "load") {
    return "Belum ada rating produk dari akun Anda.";
  }

  if (action === "create") {
    return "Produk belum tersedia untuk diberi rating dari akun ini.";
  }

  return "Rating produk ini belum tersedia atau sudah tidak dapat diubah.";
};

const handleRatingError = (error: unknown, action: "load" | "create" | "update" | "delete"): never => {
  if (axios.isAxiosError(error) && error.response) {
    const status = error.response.status;

    if (status === 403 || status === 401) {
      throw new Error(ratingAuthMessage());
    }

    if (status === 404) {
      throw new Error(ratingNotFoundMessage(action));
    }

    if (status === 422) {
      throw new Error(safeValidationMessage(error.response.data as ValidationErrorResponse));
    }

    if (status === 409) {
      throw new Error("Rating produk sedang belum bisa diproses. Silakan cek kembali data pesanan atau coba lagi nanti.");
    }

    throw new Error(ratingActionMessage(action));
  }

  if (error instanceof Error && error.message.startsWith("Pilih rating")) {
    throw error;
  }

  if (error instanceof Error && error.message.startsWith("Ulasan maksimal")) {
    throw error;
  }

  throw new Error(ratingActionMessage(action));
};

export const getMyProductRatings = async (): Promise<ProductRatingListResponse> => {
  try {
    const response = await apiClient.get<ProductRatingListResponse>(
      API_ENDPOINTS.RATING_MY_LIST
    );

    if (response?.status_code === 200 && Array.isArray(response.data)) {
      return response;
    }

    throw new Error(ratingActionMessage("load"));
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return {
        status_code: 200,
        message: ratingNotFoundMessage("load"),
        data: [],
      };
    }

    return handleRatingError(error, "load");
  }
};

export const createProductRating = async (
  payload: CreateRatingPayload
): Promise<ProductRatingResponse> => {
  validateRatingInput(payload.rate, payload.review);

  try {
    const response = await apiClient.post<ProductRatingResponse>(
      API_ENDPOINTS.RATING_CREATE(payload.productId),
      {
        rate: {
          product_id: payload.productId,
        },
        create_rate: {
          rate: payload.rate,
          review: payload.review.trim(),
        },
      }
    );

    if ((response?.status_code === 200 || response?.status_code === 201) && response.data) {
      return response;
    }

    throw new Error(ratingActionMessage("create"));
  } catch (error: unknown) {
    return handleRatingError(error, "create");
  }
};

export const updateProductRating = async (
  payload: UpdateRatingPayload
): Promise<ProductRatingResponse> => {
  validateRatingInput(payload.rate, payload.review);

  try {
    const response = await apiClient.put<ProductRatingResponse>(
      API_ENDPOINTS.RATING_EDIT(payload.ratingId),
      {
        review_id_update: {
          rating_id: payload.ratingId,
        },
        review_update: {
          rate: payload.rate,
          review: payload.review.trim(),
        },
      }
    );

    if ((response?.status_code === 200 || response?.status_code === 201) && response.data) {
      return response;
    }

    throw new Error(ratingActionMessage("update"));
  } catch (error: unknown) {
    return handleRatingError(error, "update");
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

    throw new Error(ratingActionMessage("delete"));
  } catch (error: unknown) {
    return handleRatingError(error, "delete");
  }
};
