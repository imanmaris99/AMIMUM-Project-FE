import axios from "axios";
import { apiClient } from "@/lib/axiosClient";
import { API_ENDPOINTS } from "@/lib/apiConfig";

export interface CartVariantInfo {
  id?: number;
  variant?: string;
  img?: string;
  discount?: number;
  discounted_price?: number;
  updated_at?: string;
}

export interface CartApiItem {
  id: number;
  product_name: string;
  product_price: number;
  variant_info: Record<string, unknown>;
  quantity: number;
  is_active: boolean;
  created_at: string;
}

export interface CartListResponse {
  status_code: number;
  message: string;
  data: CartApiItem[];
  total_prices: {
    all_item_active_prices: number;
    all_promo_active_prices: number;
    total_all_active_prices: number;
  };
}

export interface CartTotalItemsResponse {
  status_code: number;
  message: string;
  data: {
    total_items: number;
  };
}

export interface CartMutationResponse {
  status_code: number;
  message: string;
  data?: {
    product_id?: string;
    variant_id?: number | string;
    quantity?: number;
    added_at?: string;
    cart_id?: number | string;
    deleted_at?: string;
  };
}

interface CartErrorResponse {
  status_code?: number;
  error?: string;
  message?: string;
}

interface ValidationErrorResponse {
  detail?: Array<{ msg: string }>;
}

export interface AddCartProductPayload {
  productId: string;
  variantId: number;
}

export interface UpdateCartQuantityPayload {
  cartId: string | number;
  quantity: number;
}

export interface UpdateCartActivationPayload {
  cartId: string | number;
  isActive: boolean;
}

const extractValidationMessage = (errorData: ValidationErrorResponse) => {
  if (!Array.isArray(errorData.detail)) {
    return "Data keranjang tidak lolos validasi.";
  }

  return errorData.detail.map((item) => item.msg).join(", ");
};

const extractCartError = (
  error: unknown,
  fallbackMessage: string
): never => {
  if (axios.isAxiosError(error) && error.response) {
    const status = error.response.status;
    const errorData = error.response.data as
      | CartErrorResponse
      | ValidationErrorResponse;

    if (status === 422) {
      throw new Error(
        extractValidationMessage(errorData as ValidationErrorResponse)
      );
    }

    throw new Error(
      (errorData as CartErrorResponse).message || fallbackMessage
    );
  }

  if (error instanceof Error) {
    throw error;
  }

  throw new Error("Terjadi kesalahan yang tidak diketahui.");
};

export const getMyCartProducts = async (): Promise<CartListResponse> => {
  try {
    const response = await apiClient.get<CartListResponse>(API_ENDPOINTS.CART_MY_CART);

    if (response?.status_code === 200 && Array.isArray(response.data)) {
      return response;
    }

    throw new Error(response?.message || "Gagal mengambil keranjang.");
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      const errorData = error.response.data as CartErrorResponse;

      if (status === 400 || status === 404) {
        return {
          status_code: 200,
          message: errorData.message || "Keranjang belum tersedia.",
          data: [],
          total_prices: {
            all_item_active_prices: 0,
            all_promo_active_prices: 0,
            total_all_active_prices: 0,
          },
        };
      }

      throw new Error(errorData.message || "Gagal mengambil keranjang.");
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Terjadi kesalahan yang tidak diketahui.");
  }
};

export const getCartTotalItems = async (): Promise<CartTotalItemsResponse> => {
  try {
    const response = await apiClient.get<CartTotalItemsResponse>(
      API_ENDPOINTS.CART_TOTAL_ITEMS
    );

    if (response?.status_code === 200 && response.data) {
      return response;
    }

    throw new Error(response?.message || "Gagal mengambil total item keranjang.");
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      const errorData = error.response.data as CartErrorResponse;

      if (status === 404) {
        return {
          status_code: 200,
          message: errorData.message || "Keranjang belum tersedia.",
          data: {
            total_items: 0,
          },
        };
      }

      throw new Error(
        errorData.message || "Gagal mengambil total item keranjang."
      );
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Terjadi kesalahan yang tidak diketahui.");
  }
};

export const addCartProduct = async (
  payload: AddCartProductPayload
): Promise<CartMutationResponse> => {
  try {
    const response = await apiClient.post<CartMutationResponse>(
      API_ENDPOINTS.CART_CREATE(payload.productId, payload.variantId),
      {
        product_id: payload.productId,
        variant_id: payload.variantId,
      }
    );

    if ((response?.status_code === 200 || response?.status_code === 201) && response.data) {
      return response;
    }

    throw new Error(response?.message || "Gagal menambahkan item ke keranjang.");
  } catch (error: unknown) {
    extractCartError(error, "Gagal menambahkan item ke keranjang.");
    throw new Error("Gagal menambahkan item ke keranjang.");
  }
};

export const updateCartQuantity = async (
  payload: UpdateCartQuantityPayload
): Promise<CartMutationResponse> => {
  try {
    const response = await apiClient.put<CartMutationResponse>(
      API_ENDPOINTS.CART_UPDATE_QUANTITY(payload.cartId.toString()),
      {
        cart: {
          cart_id: Number(payload.cartId),
        },
        quantity_update: {
          quantity: payload.quantity,
        },
      }
    );

    if ((response?.status_code === 200 || response?.status_code === 201)) {
      return response;
    }

    throw new Error(response?.message || "Gagal memperbarui jumlah item keranjang.");
  } catch (error: unknown) {
    extractCartError(error, "Gagal memperbarui jumlah item keranjang.");
    throw new Error("Gagal memperbarui jumlah item keranjang.");
  }
};

export const updateCartActivation = async (
  payload: UpdateCartActivationPayload
): Promise<CartMutationResponse> => {
  try {
    const response = await apiClient.put<CartMutationResponse>(
      API_ENDPOINTS.CART_UPDATE_ACTIVATE(payload.cartId.toString()),
      {
        cart: {
          cart_id: Number(payload.cartId),
        },
        activate_update: {
          is_active: payload.isActive,
        },
      }
    );

    if ((response?.status_code === 200 || response?.status_code === 201)) {
      return response;
    }

    throw new Error(response?.message || "Gagal memperbarui status item keranjang.");
  } catch (error: unknown) {
    extractCartError(error, "Gagal memperbarui status item keranjang.");
    throw new Error("Gagal memperbarui status item keranjang.");
  }
};

export const updateAllCartActivation = async (
  isActive: boolean
): Promise<CartMutationResponse> => {
  try {
    const response = await apiClient.put<CartMutationResponse>(
      API_ENDPOINTS.CART_UPDATE_ACTIVATE_ALL,
      {
        is_active: isActive,
      }
    );

    if ((response?.status_code === 200 || response?.status_code === 201)) {
      return response;
    }

    throw new Error(
      response?.message || "Gagal memperbarui seluruh status item keranjang."
    );
  } catch (error: unknown) {
    extractCartError(error, "Gagal memperbarui seluruh status item keranjang.");
    throw new Error("Gagal memperbarui seluruh status item keranjang.");
  }
};

export const deleteCartProduct = async (
  cartId: string | number
): Promise<CartMutationResponse> => {
  try {
    const response = await apiClient.delete<CartMutationResponse>(
      API_ENDPOINTS.CART_DELETE(cartId.toString()),
      {
        data: {
          cart_id: Number(cartId),
        },
      }
    );

    if ((response?.status_code === 200 || response?.status_code === 201)) {
      return response;
    }

    throw new Error(response?.message || "Gagal menghapus item keranjang.");
  } catch (error: unknown) {
    extractCartError(error, "Gagal menghapus item keranjang.");
    throw new Error("Gagal menghapus item keranjang.");
  }
};

export const extractVariantInfo = (
  rawVariantInfo: Record<string, unknown>
): CartVariantInfo => {
  if (!rawVariantInfo || typeof rawVariantInfo !== "object") {
    return {};
  }

  if (
    "variant" in rawVariantInfo ||
    "img" in rawVariantInfo ||
    "discounted_price" in rawVariantInfo
  ) {
    return rawVariantInfo as CartVariantInfo;
  }

  const firstNestedValue = Object.values(rawVariantInfo).find(
    (value) => value && typeof value === "object" && !Array.isArray(value)
  );

  return (firstNestedValue as CartVariantInfo | undefined) || {};
};
