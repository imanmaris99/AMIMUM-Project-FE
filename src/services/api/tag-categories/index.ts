import axiosClient from "@/lib/axiosClient";
import { API_BASE_URL, API_ENDPOINTS } from "@/lib/apiConfig";
import { CategoriesResponseType, CategoryProps } from "@/types/apiTypes";

/**
 * Fetch all categories (Client-side)
 * @returns Promise<CategoryProps[]> Array of categories
 * @throws Error if request fails
 */
export const fetchCategories = async (): Promise<CategoryProps[]> => {
    try {
        const response: CategoriesResponseType = await axiosClient.get(API_ENDPOINTS.CATEGORIES_ALL);
        
        // Validate response structure
        if (!response || !response.data || !Array.isArray(response.data)) {
            throw new Error('Invalid response format: data is not an array');
        }
        
        // Return the categories array from response.data
        return response.data;
    } catch (error) {
        // Error handling is done by axiosClient interceptor
        throw error;
    }
};

/**
 * Fetch all categories (Server-side)
 * Handles API response structure and error codes according to Swagger documentation:
 * - 200 OK: Returns categories array
 * - 500 Internal Server Error: Throws error with server error message
 * 
 * @returns Promise<CategoryProps[]> Array of categories
 * @throws Error if request fails (500 or network error)
 */
export async function fetchCategoriesServer(): Promise<CategoryProps[]> {
  try {
    const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CATEGORIES_ALL}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 60 },
    });

    // Handle different status codes according to API documentation
    if (res.status === 500) {
      // Internal Server Error
      const errorData = await res.json().catch(() => ({}));
      const errorMessage = errorData.message || 'Kesalahan tak terduga saat mengambil daftar kategori.';
      throw new Error(errorMessage);
    }

    if (!res.ok) {
      // Other errors
      throw new Error(`Gagal mengambil data kategori: ${res.status}`);
    }

    // Parse response
    const data: CategoriesResponseType = await res.json();
    
    // Validate response structure
    if (!data || !data.data || !Array.isArray(data.data)) {
      throw new Error('Invalid response format: data is not an array');
    }

    // Return the categories array from response.data
    return data.data;
  } catch (error) {
    // Re-throw with more context if needed
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Unknown error occurred while fetching categories');
  }
}