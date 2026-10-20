import axios from "axios";
import { apiClient } from "@/lib/axiosClient";
import { API_ENDPOINTS } from "@/lib/apiConfig";
import { getRating403Message } from "@/lib/ratingApiErrors";
import { getRatingInputError } from "@/lib/ratingConstraints";

export interface ProductRatingItem {
  id: number;
  rate: number;
  review: string;
  product_name: string;
  variant_name?: string | null;
  rater_name?: string;
  created_at: string;
}

export interface ProductRatingListResponse {
  status_code: number;
  message: string;
  data: ProductRatingItem[];
}

export interface PublicProductRating {
  id: number;
  rate: number;
  review?: string | null;
  rater_name: string;
  variant_name?: string | null;
  created_at: string;
  verified_purchase: boolean;
}

export interface ProductRatingSummary {
  avg_rating: number;
  total_rater: number;
  rating_distribution: Record<string, number>;
}

export interface ProductRatingsPageResponse {
  status_code: number;
  message: string;
  summary: ProductRatingSummary;
  data: PublicProductRating[];
  skip: number;
  limit: number;
  has_more: boolean;
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
  variantId: number | null;
}

export interface EligibleRatingVariant {
  variant_id: number | null;
  variant_name: string;
}

export interface EligibleRatingVariantsResponse {
  status_code: number;
  message: string;
  data: EligibleRatingVariant[];
}

export interface UpdateRatingPayload {
  ratingId: number;
  rate: number;
  review: string;
}

const validateRatingInput = (rate: number, review: string) => {
  const validationError = getRatingInputError(Number(rate), review);
  if (validationError) {
    throw new Error(validationError);
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

    if (status === 403) {
      throw new Error(getRating403Message(error.response.data));
    }

    if (status === 401) {
      throw new Error(ratingAuthMessage());
    }

    if (status === 404) {
      throw new Error(ratingNotFoundMessage(action));
    }

    if (status === 422) {
      throw new Error(safeValidationMessage(error.response.data as ValidationErrorResponse));
    }

    if (status === 409) {
      throw new Error("Anda sudah memberi rating untuk produk ini. Buka halaman Rating & Ulasan Saya untuk memperbarui rating yang ada.");
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

export interface ProductRatingQuery {
  skip?: number;
  limit?: number;
  rate?: number | null;
  sort?: "recent" | "highest" | "lowest";
}

export const getProductRatings = async (
  productId: string,
  query: ProductRatingQuery = {}
): Promise<ProductRatingsPageResponse> => {
  try {
    const response = await apiClient.get<ProductRatingsPageResponse>(
      API_ENDPOINTS.RATING_CREATE(productId),
      {
        params: {
          skip: query.skip ?? 0,
          limit: query.limit ?? 10,
          ...(query.rate ? { rate: query.rate } : {}),
          sort: query.sort ?? "recent",
        },
      }
    );

    if (response?.status_code === 200 && response.summary && Array.isArray(response.data)) {
      return response;
    }

    throw new Error("Rating produk belum bisa dimuat. Silakan coba lagi.");
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      throw new Error("Produk tidak ditemukan atau ulasan belum bisa dimuat.");
    }
    return handleRatingError(error, "load");
  }
};

export const getEligibleRatingVariants = async (
  productId: string
): Promise<EligibleRatingVariantsResponse> => {
  try {
    const response = await apiClient.get<EligibleRatingVariantsResponse>(
      API_ENDPOINTS.RATING_ELIGIBLE_VARIANTS(productId)
    );

    if (response?.status_code === 200 && Array.isArray(response.data)) {
      return response;
    }

    throw new Error(ratingActionMessage("load"));
  } catch (error: unknown) {
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
          variant_id: payload.variantId,
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
