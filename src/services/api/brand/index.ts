import axiosClient from "@/lib/axiosClient";
import { API_BASE_URL, API_ENDPOINTS } from "@/lib/apiConfig";
import { BrandsResponseType, ProductionProps } from "@/types/apiTypes";

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

// Fetcher untuk Server Component (tanpa axios, tanpa localStorage, tanpa Swal)
export async function GetAllPromoServer() {
  const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.BRAND_PROMO}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    next: { revalidate: 60 },
  });
  if (!res.ok) {
    throw new Error(`Gagal mengambil data promo: ${res.status}`);
  }
  const data = await res.json();
  return data;
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

export async function GetBrandDetailByIDServer(brandDetailId: number) {
  const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.BRAND_DETAIL(brandDetailId)}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    // next: { revalidate: 60 }, // jika ingin ISR
  });
  if (!res.ok) {
    throw new Error(`Gagal mengambil data brand: ${res.status}`);
  }
  const data = await res.json();
  return data;
}
