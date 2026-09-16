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
      cache: "no-store",
    });

    if (res.status === 404) {
      throw new Error('Produk tidak ditemukan atau belum tersedia di katalog toko.');
    }

    if (res.status === 422) {
      throw new Error('Format produk tidak valid. Silakan buka produk dari katalog toko.');
    }

    if (res.status === 500) {
      throw new Error('Detail produk belum bisa dimuat. Silakan coba lagi beberapa saat lagi.');
    }

    if (!res.ok) {
      throw new Error('Detail produk belum bisa dimuat. Silakan coba lagi beberapa saat lagi.');
    }

    const data: DetailProductResponseType = await res.json();
    
    if (!data || !data.data) {
      throw new Error('Format detail produk belum sesuai. Silakan coba lagi nanti.');
    }

    return data.data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Detail produk belum bisa dimuat. Silakan coba lagi beberapa saat lagi.');
  }
}