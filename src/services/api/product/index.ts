import axiosClient from "@/lib/axiosClient";
import axios from "axios";
import { API_BASE_URL, API_ENDPOINTS } from "@/lib/apiConfig";
import { AllProductInfoType, AllProductInfoResponseType, ProductSearchResponseType, ProductSearchItemType, ProductSearchByBrandResponseType, ProductSearchByBrandItemType } from "@/types/apiTypes";

/**
 * Search products by name (Client-side)
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

    const responseData = response as unknown as ProductSearchResponseType;
    
    if (responseData && responseData.status_code === 200 && responseData.data && Array.isArray(responseData.data)) {
      const mappedProducts: AllProductInfoType[] = responseData.data.map((product: ProductSearchItemType) => {
        let variants = product.all_variants || [];
        
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

        const productImage = variants.length > 0 && variants[0].img 
          ? variants[0].img 
          : "/default-image.jpg";

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

/**
 * Search products by production ID and product name (Client-side)
 * Response does not include brand_info or all_variants, so they are constructed from parameters.
 * @param productionId - ID of the production/brand
 * @param productName - Name of the product to search for
 * @returns Promise<AllProductInfoType[]> Array of products
 * @throws Error if request fails (422, 500, or network error)
 */
export const SearchGetProductByBrand = async (productionId: number, productName: string): Promise<AllProductInfoType[]> => {
  try {
    if (!productName || productName.trim().length === 0) {
      return [];
    }

    const response = await axiosClient.get<ProductSearchByBrandResponseType>(
      API_ENDPOINTS.PRODUCT_SEARCH_BY_BRAND(productionId, productName.trim())
    );

    const responseData = response as unknown as ProductSearchByBrandResponseType;
    
    if (responseData && responseData.status_code === 200 && responseData.data && Array.isArray(responseData.data)) {
      const mappedProducts: AllProductInfoType[] = responseData.data.map((product: ProductSearchByBrandItemType) => {
        const highestDiscount = product.highest_promo || 0;
        const variants = [{
          id: 0,
          variant: "default",
          img: "/default-image.jpg",
          discount: highestDiscount,
          discounted_price: highestDiscount 
            ? Math.round(product.price * (1 - highestDiscount / 100))
            : product.price,
          updated_at: new Date().toISOString(),
        }];

        const productImage = "/default-image.jpg";

        return {
          id: product.id,
          name: product.name,
          price: product.price,
          image: productImage,
          brand_info: {
            id: productionId,
            name: "",
            photo_url: undefined,
          },
          all_variants: variants,
          created_at: new Date().toISOString(),
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
        const errorMessage = errorData.message || 'Kesalahan tak terduga saat mencari produk berdasarkan filter production_id dan nama produk.';
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

export const GetProductDiscountByBrandId = async (brandDiscountId: number) => {
    try {
        const response = await axiosClient.get(API_ENDPOINTS.PRODUCT_DISCOUNT_BY_BRAND(brandDiscountId));
        return response.data ? response.data : response;
    } catch (error) {
        throw error;
    }
}

/**
 * Fetch products with discount by production_id (Server-side)
 * Handles API response structure and error codes according to Swagger documentation:
 * - 200 OK: Returns products array with discount
 * - 404 Not Found: Returns empty array (no products with discount found)
 * - 422 Validation Error: Throws error with validation message
 * - 500 Internal Server Error: Throws error with server error message
 * 
 * @param productionId - ID of the production/brand to fetch discounted products for
 * @returns Promise<AllProductInfoType[]> Array of products with discount
 * @throws Error if request fails (422, 500, or network error)
 */
export async function GetProductDiscountByBrandIdServer(productionId: number): Promise<AllProductInfoType[]> {
  try {
    const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.PRODUCT_DISCOUNT_BY_BRAND(productionId)}`, {
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
      const errorMessage = errorData.message || 'Kesalahan tak terduga saat mengambil produk diskon berdasarkan production_id.';
      throw new Error(errorMessage);
    }

    if (!res.ok) {
      throw new Error(`Gagal mengambil data produk diskon: ${res.status}`);
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
        id: product.id,
        name: product.name,
        price: product.price,
        image: productImage,
        brand_info: brandInfo,
        all_variants: product.all_variants || [],
        created_at: product.created_at || new Date().toISOString(),
        brand_highest_discount: product.brand_highest_discount,
      };
    });

    return mappedProducts;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Unknown error occurred while fetching discounted products');
  }
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
