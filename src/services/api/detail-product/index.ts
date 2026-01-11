import axiosClient from "@/lib/axiosClient";
import { DetailProductResponseType, DetailProductType } from "@/types/detailProduct";
import { API_BASE_URL, API_ENDPOINTS } from "@/lib/apiConfig";

export const getDetailProduct = async (productId: string) => {
    try {
        const response: DetailProductResponseType = await axiosClient.get(API_ENDPOINTS.PRODUCT_DETAIL(productId));
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Fetch product detail by product_id (Server-side)
 * Handles API response structure and error codes according to Swagger documentation:
 * - 200 OK: Returns product detail
 * - 404 Not Found: Throws error with not found message
 * - 422 Validation Error: Throws error with validation message
 * - 500 Internal Server Error: Throws error with server error message
 * 
 * @param productId - UUID of the product to fetch detail for
 * @returns Promise<DetailProductType> Product detail data
 * @throws Error if request fails (404, 422, 500, or network error)
 */
export async function getDetailProductServer(productId: string): Promise<DetailProductType> {
  try {
    const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.PRODUCT_DETAIL(productId)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 60 },
    });

    // Handle different status codes according to API documentation
    if (res.status === 404) {
      // Not Found
      const errorData = await res.json().catch(() => ({}));
      const errorMessage = errorData.message || 'Produk dengan ID yang diberikan tidak ditemukan.';
      throw new Error(errorMessage);
    }

    if (res.status === 422) {
      // Validation Error
      const errorData = await res.json().catch(() => ({}));
      const errorMessage = errorData.detail?.[0]?.msg || 'Kesalahan validasi saat mengambil detail produk.';
      throw new Error(errorMessage);
    }

    if (res.status === 500) {
      // Internal Server Error
      const errorData = await res.json().catch(() => ({}));
      const errorMessage = errorData.message || 'Kesalahan tak terduga saat mengambil detail produk.';
      throw new Error(errorMessage);
    }

    if (!res.ok) {
      // Other errors
      throw new Error(`Gagal mengambil detail produk: ${res.status}`);
    }

    // Parse response
    const data: DetailProductResponseType = await res.json();
    
    // Validate response structure
    if (!data || !data.data) {
      throw new Error('Invalid response format: data is missing');
    }

    // Return product data - image_url normalization is handled in components if needed
    return data.data;
  } catch (error) {
    // Re-throw with more context if needed
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Unknown error occurred while fetching product detail');
  }
}