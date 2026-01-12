import axiosClient from "@/lib/axiosClient";
import axios from "axios";
import { API_BASE_URL, API_ENDPOINTS } from "@/lib/apiConfig";
import { AllProductInfoType, AllProductInfoResponseType, ProductSearchResponseType, ProductSearchItemType } from "@/types/apiTypes";

/**
 * Search products by name (Client-side)
 * Handles API response structure and error codes according to Swagger documentation:
 * - 200 OK: Returns products array
 * - 404 Not Found: Returns empty array (no products found)
 * - 422 Validation Error: Throws error with validation message
 * - 500 Internal Server Error: Throws error with server error message
 * 
 * @param productName - Name of the product to search for
 * @returns Promise<AllProductInfoType[]> Array of products
 * @throws Error if request fails (422, 500, or network error)
 */
export const SearchGetProduct = async (productName: string): Promise<AllProductInfoType[]> => {
  try {
    if (!productName || productName.trim().length === 0) {
      return [];
    }

    const response = await axiosClient.get<ProductSearchResponseType>(
      API_ENDPOINTS.PRODUCT_SEARCH(productName.trim())
    );

    // axiosClient interceptor returns response.data directly (see axiosClient.ts line 61)
    // So response is already ProductSearchResponseType with structure: { status_code, message, data }
    // We don't need to access .data property because response IS the API response
    const responseData = response as unknown as ProductSearchResponseType;
    
    if (responseData && responseData.status_code === 200 && responseData.data && Array.isArray(responseData.data)) {
      // Map API response to AllProductInfoType format
      const mappedProducts: AllProductInfoType[] = responseData.data.map((product: ProductSearchItemType) => {
        // Use actual variants from API if available, otherwise create minimal variant
        let variants = product.all_variants || [];
        
        // If no variants from API, create a minimal variant
        if (variants.length === 0) {
          const highestDiscount = product.highest_promo || 0;
          variants = [{
            id: 0,
            variant: "default",
            img: "/default-image.jpg",
            discount: highestDiscount,
            discounted_price: highestDiscount 
              ? Math.round(product.price * (1 - highestDiscount / 100))
              : product.price,
            updated_at: new Date().toISOString(),
          }];
        }

        // Get image from first variant if available
        const productImage = variants.length > 0 && variants[0].img 
          ? variants[0].img 
          : "/default-image.jpg";

        // Calculate highest discount from all variants
        const highestDiscount = variants.length > 0
          ? Math.max(...variants.map(v => v.discount || 0))
          : (product.highest_promo || 0);

        return {
          id: product.id,
          name: product.name,
          price: product.price,
          image: productImage,
          brand_info: product.brand_info || {
            id: 0,
            name: "",
            photo_url: undefined,
          },
          all_variants: variants,
          created_at: product.created_at || new Date().toISOString(),
          brand_highest_discount: highestDiscount > 0 ? highestDiscount : undefined,
        };
      });

      return mappedProducts;
    }

    return [];
  } catch (error: unknown) {

    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      
      if (status === 404) {
        return [];
      }

      if (status === 422) {
        const errorData = error.response.data as { detail?: Array<{ msg: string }> };
        const errorMessage = errorData.detail?.[0]?.msg || 'Validation error occurred.';
        throw new Error(errorMessage);
      }

      if (status === 500) {
        const errorData = error.response.data as { message?: string };
        const errorMessage = errorData.message || 'Kesalahan tak terduga saat mencari produk.';
        throw new Error(errorMessage);
      }

      const errorData = error.response.data as { message?: string };
      throw new Error(errorData.message || `Gagal mencari produk: ${status}`);
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error('Unknown error occurred while searching products');
  }
};

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

    if (res.status === 404) {
      return [];
    }

    if (res.status === 422) {
      const errorData = await res.json().catch(() => ({}));
      const errorMessage = errorData.detail?.[0]?.msg || 'Validation error occurred.';
      throw new Error(errorMessage);
    }

    if (res.status === 500) {
      const errorData = await res.json().catch(() => ({}));
      const errorMessage = errorData.message || 'Kesalahan tak terduga saat mengambil produk berdasarkan production_id.';
      throw new Error(errorMessage);
    }

    if (!res.ok) {
      throw new Error(`Gagal mengambil data produk: ${res.status}`);
    }

    const data: AllProductInfoResponseType = await res.json();
    
    if (!data || !data.data || !Array.isArray(data.data)) {
      throw new Error('Invalid response format: data is not an array');
    }

    const mappedProducts: AllProductInfoType[] = data.data.map((product) => {
      const productWithImage = product as AllProductInfoType & { image?: string };
      const productImage = productWithImage.image || 
        (product.all_variants && product.all_variants.length > 0 && product.all_variants[0]?.img
          ? product.all_variants[0].img
          : "/default-image.jpg");
      
      const brandInfo = {
        ...product.brand_info,
        photo_url: product.brand_info?.photo_url || undefined,
      };
      
      return {
        ...product,
        image: productImage,
        brand_info: brandInfo,
      };
    });

    return mappedProducts;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Unknown error occurred while fetching products');
  }
}
