import axiosClient from "@/lib/axiosClient";
import { API_BASE_URL, API_ENDPOINTS } from "@/lib/apiConfig";
import { ArticlesResponseType, ArticleProps } from "@/types/apiTypes";

/**
 * Fetch all articles (Client-side)
 * @returns Promise<ArticleProps[]> Array of articles
 * @throws Error if request fails
 */
export const fetchArticles = async (): Promise<ArticleProps[]> => {
    try {
        const response: ArticlesResponseType = await axiosClient.get(API_ENDPOINTS.ARTICLES_ALL);
        
        // Validate response structure
        if (!response || !response.data || !Array.isArray(response.data)) {
            throw new Error('Invalid response format: data is not an array');
        }
        
        // Return the articles array from response.data
        return response.data;
    } catch (error) {
        // Error handling is done by axiosClient interceptor
        throw error;
    }
};

/**
 * Fetch all articles (Server-side)
 * Handles API response structure and error codes according to Swagger documentation:
 * - 200 OK: Returns articles array
 * - 409 Conflict: Throws error with conflict message
 * - 500 Internal Server Error: Throws error with server error message
 * 
 * @returns Promise<ArticleProps[]> Array of articles
 * @throws Error if request fails (409, 500, or network error)
 */
export async function fetchArticlesServer(): Promise<ArticleProps[]> {
  try {
    const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.ARTICLES_ALL}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // Next.js fetch API: revalidate setiap 60 detik (bisa diubah sesuai kebutuhan)
      next: { revalidate: 60 },
    });

    // Handle different status codes according to API documentation
    if (res.status === 409) {
      // Conflict error
      const errorData = await res.json().catch(() => ({}));
      const errorMessage = errorData.message || 'Terjadi konflik saat mengambil daftar artikel.';
      throw new Error(errorMessage);
    }

    if (res.status === 500) {
      // Internal Server Error
      const errorData = await res.json().catch(() => ({}));
      const errorMessage = errorData.message || 'Kesalahan tak terduga saat mengambil daftar artikel.';
      throw new Error(errorMessage);
    }

    if (!res.ok) {
      // Other errors
      throw new Error(`Gagal mengambil data artikel: ${res.status}`);
    }

    // Parse response
    const data: ArticlesResponseType = await res.json();
    
    // Validate response structure
    if (!data || !data.data || !Array.isArray(data.data)) {
      throw new Error('Invalid response format: data is not an array');
    }

    // Return the articles array from response.data
    return data.data;
  } catch (error) {
    // Re-throw with more context if needed
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Unknown error occurred while fetching articles');
  }
}
