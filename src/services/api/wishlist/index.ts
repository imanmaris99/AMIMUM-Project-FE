import axios from "axios";
import { apiClient } from "@/lib/axiosClient";
import { API_ENDPOINTS } from "@/lib/apiConfig";

export interface WishlistVariantApiItem {
  id: number;
  variant: string;
  img: string;
  discount: number;
  discounted_price: number;
  updated_at: string;
}

export interface WishlistApiItem {
  id: number;
  product_name: string;
  product_variant: WishlistVariantApiItem[];
  created_at: string;
}

export interface WishlistListResponse {
  status_code: number;
  message: string;
  total_records: number;
  data: WishlistApiItem[];
}

export interface WishlistTotalResponse {
  status_code: number;
  message: string;
  data: {
    total_items: number;
  };
}

export interface WishlistMutationResponse {
  status_code: number;
  message: string;
  data: {
    id?: number;
    wishlist_id?: number;
    product_name: string;
    created_at?: string;
  };
}

interface WishlistErrorResponse {
  status_code?: number;
  error?: string;
  message?: string;
}

interface ValidationErrorResponse {
  detail?: Array<{ msg: string }>;
}

const extractValidationMessage = (errorData: ValidationErrorResponse) => {
  if (!Array.isArray(errorData.detail)) {
    return "Data wishlist tidak lolos validasi.";
  }

  return errorData.detail.map((item) => item.msg).join(", ");
};

export const getMyWishlistProducts = async (): Promise<WishlistListResponse> => {
  try {
    const response = await apiClient.get<WishlistListResponse>(
      API_ENDPOINTS.WISHLIST_MY_PRODUCTS
    );

    if (
      response?.status_code === 200 &&
      Array.isArray(response.data)
    ) {
      return response;
    }

    throw new Error(response?.message || "Gagal mengambil wishlist.");
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      const errorData = error.response.data as WishlistErrorResponse;

      if (status === 403) {
        throw new Error(
          errorData.message ||
            "You do not have permission to view this wishlist."
        );
      }

      if (status === 404) {
        return {
          status_code: 200,
          message: errorData.message || "Wishlist belum tersedia.",
          total_records: 0,
          data: [],
        };
      }

      if (status === 500) {
        throw new Error(
          errorData.message ||
            "An unexpected error occurred while retrieving the wishlist."
        );
      }

      throw new Error(errorData.message || "Gagal mengambil wishlist.");
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Terjadi kesalahan yang tidak diketahui.");
  }
};

export const getWishlistTotalItems = async (): Promise<WishlistTotalResponse> => {
  try {
    const response = await apiClient.get<WishlistTotalResponse>(
      API_ENDPOINTS.WISHLIST_TOTAL_ITEMS
    );

    if (response?.status_code === 200 && response.data) {
      return response;
    }

    throw new Error(response?.message || "Gagal mengambil total wishlist.");
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      const errorData = error.response.data as WishlistErrorResponse;

      if (status === 404) {
        return {
          status_code: 200,
          message: errorData.message || "Wishlist belum tersedia.",
          data: { total_items: 0 },
        };
      }

      throw new Error(
        errorData.message || "Gagal mengambil total wishlist."
      );
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Terjadi kesalahan yang tidak diketahui.");
  }
};

export const addWishlistProduct = async (
  productId: string
): Promise<WishlistMutationResponse> => {
  try {
    const response = await apiClient.post<WishlistMutationResponse>(
      API_ENDPOINTS.WISHLIST_CREATE(productId),
      {
        product_id: productId,
      }
    );

    if ((response?.status_code === 200 || response?.status_code === 201) && response.data) {
      return response;
    }

    throw new Error(response?.message || "Gagal menambahkan wishlist.");
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      const errorData = error.response.data as
        | WishlistErrorResponse
        | ValidationErrorResponse;

      if (status === 403) {
        throw new Error(
          (errorData as WishlistErrorResponse).message ||
            "User is not authorized to add to the wishlist."
        );
      }

      if (status === 404) {
        throw new Error(
          (errorData as WishlistErrorResponse).message ||
            "The specified product was not found."
        );
      }

      if (status === 409) {
        throw new Error(
          (errorData as WishlistErrorResponse).message ||
            "Product is already in the wishlist."
        );
      }

      if (status === 422) {
        throw new Error(extractValidationMessage(errorData as ValidationErrorResponse));
      }

      if (status === 500) {
        throw new Error(
          (errorData as WishlistErrorResponse).message ||
            "An unexpected error occurred while adding to the wishlist."
        );
      }

      throw new Error(
        (errorData as WishlistErrorResponse).message ||
          "Gagal menambahkan wishlist."
      );
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Terjadi kesalahan yang tidak diketahui.");
  }
};

export const deleteWishlistProduct = async (
  wishlistId: number
): Promise<WishlistMutationResponse> => {
  try {
    const response = await apiClient.delete<WishlistMutationResponse>(
      API_ENDPOINTS.WISHLIST_DELETE(wishlistId),
      {
        data: {
          wishlist_id: wishlistId,
        },
      }
    );

    if ((response?.status_code === 200 || response?.status_code === 201) && response.data) {
      return response;
    }

    throw new Error(response?.message || "Gagal menghapus wishlist.");
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      const errorData = error.response.data as
        | WishlistErrorResponse
        | ValidationErrorResponse;

      if (status === 403) {
        throw new Error(
          (errorData as WishlistErrorResponse).message ||
            "You do not have permission to delete this wishlist item."
        );
      }

      if (status === 404) {
        throw new Error(
          (errorData as WishlistErrorResponse).message ||
            "Wishlist item with the specified ID does not exist."
        );
      }

      if (status === 422) {
        throw new Error(extractValidationMessage(errorData as ValidationErrorResponse));
      }

      if (status === 500) {
        throw new Error(
          (errorData as WishlistErrorResponse).message ||
            "An unexpected error occurred while deleting the wishlist item."
        );
      }

      throw new Error(
        (errorData as WishlistErrorResponse).message ||
          "Gagal menghapus wishlist."
      );
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Terjadi kesalahan yang tidak diketahui.");
  }
};
