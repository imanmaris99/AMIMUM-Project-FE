import axiosClient from "@/lib/axiosClient";
import { API_BASE_URL, API_ENDPOINTS } from "@/lib/apiConfig";
import { AllProductInfoType, AllProductInfoResponseType } from "@/types/apiTypes";

export const SearchGetProduct = async (ProductName: string) => {
    try {
        const response = await axiosClient.get(API_ENDPOINTS.PRODUCT_SEARCH(ProductName));
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const GetProductByBrandId = async (brandId: number) => {
    try {
        const response = await axiosClient.get(API_ENDPOINTS.PRODUCT_BY_BRAND(brandId));
        return response.data ? response.data : response;
    } catch (error) {
        throw error;
    }
}

export const GetProductDiscountByBrandId = async (brandDiscountId: number) => {
    try {
        const response = await axiosClient.get(API_ENDPOINTS.PRODUCT_DISCOUNT_BY_BRAND(brandDiscountId));
        return response.data ? response.data : response;
    } catch (error) {
        throw error;
    }
}

export async function GetProductDiscountByBrandIdServer(brandDiscountId: number) {
  const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.PRODUCT_DISCOUNT_BY_BRAND(brandDiscountId)}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    // next: { revalidate: 60 }, // jika ingin ISR
  });
  if (!res.ok) {
    throw new Error(`Gagal mengambil data produk diskon: ${res.status}`);
  }
  const data = await res.json();
  return data;
}

/**
 * Fetch products by production_id (Server-side)
 * Handles API response structure and error codes according to Swagger documentation:
 * - 200 OK: Returns products array
 * - 404 Not Found: Returns empty array (no products found)
 * - 422 Validation Error: Throws error with validation message
 * - 500 Internal Server Error: Throws error with server error message
 * 
 * @param productionId - ID of the production/brand to fetch products for
 * @returns Promise<AllProductInfoType[]> Array of products
 * @throws Error if request fails (422, 500, or network error)
 */
export async function GetProductsByProductionIdServer(productionId: number): Promise<AllProductInfoType[]> {
  try {
    const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.PRODUCT_BY_BRAND(productionId)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 60 },
    });

    // Handle different status codes according to API documentation
    if (res.status === 404) {
      // Not Found - return empty array instead of throwing error
      // This is a valid response when no products are available
      return [];
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
      const errorMessage = errorData.message || 'Kesalahan tak terduga saat mengambil produk berdasarkan production_id.';
      throw new Error(errorMessage);
    }

    if (!res.ok) {
      // Other errors
      throw new Error(`Gagal mengambil data produk: ${res.status}`);
    }

    // Parse response
    const data: AllProductInfoResponseType = await res.json();
    
    // Validate response structure
    if (!data || !data.data || !Array.isArray(data.data)) {
      throw new Error('Invalid response format: data is not an array');
    }

    // Map and enrich product data to match AllProductInfoType structure
    // API response may not have 'image' field, so we derive it from all_variants[0].img
    const mappedProducts: AllProductInfoType[] = data.data.map((product) => {
      // Ensure image is always present - derive from first variant if not provided
      const productWithImage = product as AllProductInfoType & { image?: string };
      const productImage = productWithImage.image || 
        (product.all_variants && product.all_variants.length > 0 && product.all_variants[0]?.img
          ? product.all_variants[0].img
          : "/default-image.jpg");
      
      // Ensure brand_info.photo_url is present (optional in API response)
      const brandInfo = {
        ...product.brand_info,
        photo_url: product.brand_info?.photo_url || undefined,
      };
      
      return {
        ...product,
        image: productImage, // Always provide image field
        brand_info: brandInfo,
      };
    });

    // Log mapped products for debugging
    console.log('Mapped products:', mappedProducts.length, mappedProducts);

    // Return the mapped products array
    return mappedProducts;
  } catch (error) {
    // Re-throw with more context if needed
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Unknown error occurred while fetching products');
  }
}
