import axiosClient from "@/lib/axiosClient";
import { API_BASE_URL, API_ENDPOINTS } from "@/lib/apiConfig";
import { BrandsResponseType, ProductionProps, PromoProps, PromosResponseType } from "@/types/apiTypes";
import { BrandDetailType, BrandDetailResponseType } from "@/types/detailProduct";

export const GetAllPromo = async () => {
    try {
        const response = await axiosClient.get(API_ENDPOINTS.BRAND_PROMO);
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Fetch all brands/productions (Client-side)
 * @returns Promise<ProductionProps[]> Array of brands/productions
 * @throws Error if request fails
 */
export const GetAllBrand = async (): Promise<ProductionProps[]> => {
    try {
        const response: BrandsResponseType = await axiosClient.get(API_ENDPOINTS.BRAND_ALL);
        
        // Validate response structure
        if (!response || !response.data || !Array.isArray(response.data)) {
            throw new Error('Invalid response format: data is not an array');
        }
        
        // Return the brands/productions array from response.data
        return response.data;
    } catch (error) {
        // Error handling is done by axiosClient interceptor
        throw error;
    }
};

export const GetBrandDetailByID = async (BrandDetailId: number) => {
    try {
        const response = await axiosClient.get(API_ENDPOINTS.BRAND_DETAIL(BrandDetailId));
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const GetBrandLoader = async (skip = 0, limit = 8) => {
    try {
        const response = await axiosClient.get(API_ENDPOINTS.BRAND_LOADER, {
            params: {
                skip,
                limit
            },
        });
        const { data, remaining_records, has_more } = response.data;
        return {
            data,
            remaining_records,
            has_more
        }
    } catch (error) {
        throw error;
    }
}

export const GetBrandFilterLoader = async (categoryId: number, skip = 0, limit = 8) => {
    try {
        const response = await axiosClient.get(API_ENDPOINTS.BRAND_LOADER_CATEGORIES(categoryId), {
            params: {
                skip,
                limit
            },
        });
        const { data, remaining_records, has_more } = response.data;
        return {
            data,
            remaining_records,
            has_more
        }
    } catch (error) {
        throw error;
    }
}

/**
 * Fetch all promos (Server-side)
 * Handles API response structure and error codes according to Swagger documentation:
 * - 200 OK: Returns promos array
 * - 404 Not Found: Throws error with not found message
 * - 409 Conflict: Throws error with conflict message
 * - 500 Internal Server Error: Throws error with server error message
 * 
 * @returns Promise<PromoProps[]> Array of promos
 * @throws Error if request fails (404, 409, 500, or network error)
 */
export async function GetAllPromoServer(): Promise<PromoProps[]> {
  try {
    const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.BRAND_PROMO}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 60 },
    });

    // Handle different status codes according to API documentation
    if (res.status === 404) {
      // Not Found - return empty array instead of throwing error
      // This is a valid response when no promos are available
      return [];
    }

    if (res.status === 409) {
      // Conflict error
      const errorData = await res.json().catch(() => ({}));
      const errorMessage = errorData.message || 'Konflik terjadi saat mencoba mengambil data promosi.';
      throw new Error(errorMessage);
    }

    if (res.status === 500) {
      // Internal Server Error
      const errorData = await res.json().catch(() => ({}));
      const errorMessage = errorData.message || 'Kesalahan tak terduga saat mengambil data promosi.';
      throw new Error(errorMessage);
    }

    if (!res.ok) {
      // Other errors
      throw new Error(`Gagal mengambil data promo: ${res.status}`);
    }

    // Parse response
    const data: PromosResponseType = await res.json();
    
    // Validate response structure
    if (!data || !data.data || !Array.isArray(data.data)) {
      throw new Error('Invalid response format: data is not an array');
    }

    // Return the promos array from response.data
    return data.data;
  } catch (error) {
    // Re-throw with more context if needed
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Unknown error occurred while fetching promos');
  }
}

/**
 * Fetch all brands/productions (Server-side)
 * Handles API response structure and error codes according to Swagger documentation:
 * - 200 OK: Returns brands/productions array
 * - 409 Conflict: Throws error with conflict message
 * - 500 Internal Server Error: Throws error with server error message
 * 
 * @returns Promise<ProductionProps[]> Array of brands/productions
 * @throws Error if request fails (409, 500, or network error)
 */
export async function GetAllBrandServer(): Promise<ProductionProps[]> {
  try {
    const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.BRAND_ALL}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 60 },
    });

    // Handle different status codes according to API documentation
    if (res.status === 409) {
      // Conflict error
      const errorData = await res.json().catch(() => ({}));
      const errorMessage = errorData.message || 'Konflik terjadi saat mencoba mengambil data perusahaan produksi.';
      throw new Error(errorMessage);
    }

    if (res.status === 500) {
      // Internal Server Error
      const errorData = await res.json().catch(() => ({}));
      const errorMessage = errorData.message || 'Kesalahan tak terduga saat mengambil data perusahaan produksi.';
      throw new Error(errorMessage);
    }

    if (!res.ok) {
      // Other errors
      throw new Error(`Gagal mengambil data brand: ${res.status}`);
    }

    // Parse response
    const data: BrandsResponseType = await res.json();
    
    // Validate response structure
    if (!data || !data.data || !Array.isArray(data.data)) {
      throw new Error('Invalid response format: data is not an array');
    }

    // Return the brands/productions array from response.data
    return data.data;
  } catch (error) {
    // Re-throw with more context if needed
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Unknown error occurred while fetching brands');
  }
}

/**
 * Fetch brand/production detail by ID (Server-side)
 * Handles API response structure and error codes according to Swagger documentation:
 * - 200 OK: Returns brand detail
 * - 404 Not Found: Throws error with not found message
 * - 409 Conflict: Throws error with conflict message
 * - 422 Validation Error: Throws error with validation message
 * - 500 Internal Server Error: Throws error with server error message
 * 
 * @param productionId - ID of the production/brand to fetch
 * @returns Promise<BrandDetailType> Brand detail data
 * @throws Error if request fails (404, 409, 422, 500, or network error)
 */
export async function GetBrandDetailByIDServer(productionId: number): Promise<BrandDetailType> {
  try {
    const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.BRAND_DETAIL(productionId)}`, {
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
      const errorMessage = errorData.message || 'Production with the specified ID was not found.';
      throw new Error(errorMessage);
    }

    if (res.status === 409) {
      // Conflict error
      const errorData = await res.json().catch(() => ({}));
      const errorMessage = errorData.message || 'A conflict occurred while retrieving production details.';
      throw new Error(errorMessage);
    }

    if (res.status === 422) {
      // Validation Error
      const errorData = await res.json().catch(() => ({}));
      const errorMessage = errorData.detail?.[0]?.msg || 'Validation error occurred.';
      throw new Error(errorMessage);
    }

    if (res.status === 500) {
      // Internal Server Error
      const errorData = await res.json().catch(() => ({}));
      const errorMessage = errorData.message || 'An unexpected error occurred while retrieving production details.';
      throw new Error(errorMessage);
    }

    if (!res.ok) {
      // Other errors
      throw new Error(`Gagal mengambil data brand: ${res.status}`);
    }

    // Parse response
    const data: BrandDetailResponseType = await res.json();
    
    // Validate response structure
    if (!data || !data.data) {
      throw new Error('Invalid response format: data is missing');
    }

    // Return the brand detail data
    return data.data;
  } catch (error) {
    // Re-throw with more context if needed
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Unknown error occurred while fetching brand detail');
  }
}
