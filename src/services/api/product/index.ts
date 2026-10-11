import axiosClient from "@/lib/axiosClient";
import axios from "axios";
import { API_BASE_URL, API_ENDPOINTS } from "@/lib/apiConfig";
import { AllProductInfoType, AllProductInfoResponseType, ProductSearchResponseType, ProductSearchItemType, ProductSearchByBrandResponseType, ProductSearchByBrandItemType, VariantAllProductType } from "@/types/apiTypes";

const DEFAULT_PRODUCT_IMAGE = "/default-image.jpg";

const firstNonEmptyUrl = (...urls: Array<string | null | undefined>) => {
  const found = urls.find((url) => typeof url === "string" && url.trim().length > 0);
  return found?.trim();
};

const resolveProductCardImage = (
  product: Partial<AllProductInfoType | ProductSearchItemType>,
  variants: Array<Partial<VariantAllProductType>> = []
) => {
  const galleryImages = Array.isArray(product.gallery_images) ? product.gallery_images : [];
  const primaryGalleryImage = galleryImages.find((image) => image?.is_primary && image?.url)?.url;
  const firstGalleryImage = [...galleryImages]
    .sort((a, b) => Number(a?.sort_order || 0) - Number(b?.sort_order || 0))
    .find((image) => image?.url)?.url;
  const firstVariantImage = variants.find((variant) => variant?.img)?.img;

  return firstNonEmptyUrl(
    product.image,
    product.primary_image_url,
    primaryGalleryImage,
    firstGalleryImage,
    firstVariantImage,
  ) || DEFAULT_PRODUCT_IMAGE;
};

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
        const variants = Array.isArray(product.all_variants)
          ? product.all_variants
          : [];

        const productImage = resolveProductCardImage(product, variants);

        const highestDiscount = variants.length > 0
          ? Math.max(...variants.map(v => v.discount || 0))
          : (product.highest_promo || 0);

        return {
          id: product.id,
          name: product.name,
          price: product.price,
          image: productImage,
          primary_image_url: product.primary_image_url,
          gallery_images: product.gallery_images,
          brand_info: product.brand_info || {
            id: 0,
            name: "",
            photo_url: undefined,
          },
          all_variants: variants,
          created_at: product.created_at || "",
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
        const errorMessage = errorData.detail?.[0]?.msg || 'Kata kunci atau filter produk belum valid.';
        throw new Error(errorMessage);
      }

      if (status === 500) {
        throw new Error('Data pencarian produk belum bisa dimuat. Silakan coba lagi beberapa saat lagi.');
      }

      throw new Error('Data pencarian produk belum bisa dimuat. Silakan coba lagi beberapa saat lagi.');
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error('Data pencarian produk belum bisa dimuat. Silakan coba lagi beberapa saat lagi.');
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
        const variants: VariantAllProductType[] = [];

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
          created_at: "",
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
        const errorMessage = errorData.detail?.[0]?.msg || 'Kata kunci atau filter produk belum valid.';
        throw new Error(errorMessage);
      }

      if (status === 500) {
        throw new Error('Data pencarian brand belum bisa dimuat. Silakan coba lagi beberapa saat lagi.');
      }

      throw new Error('Data pencarian produk belum bisa dimuat. Silakan coba lagi beberapa saat lagi.');
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error('Data pencarian produk belum bisa dimuat. Silakan coba lagi beberapa saat lagi.');
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
      const errorMessage = errorData.detail?.[0]?.msg || 'Kata kunci atau filter produk belum valid.';
      throw new Error(errorMessage);
    }

    if (res.status === 500) {
      throw new Error('Data produk promo belum bisa dimuat. Silakan coba lagi beberapa saat lagi.');
    }

    if (!res.ok) {
      throw new Error('Data produk promo belum bisa dimuat. Silakan coba lagi beberapa saat lagi.');
    }

    const data: AllProductInfoResponseType = await res.json();
    
    if (!data || !data.data || !Array.isArray(data.data)) {
      throw new Error('Format data produk belum sesuai. Silakan coba lagi nanti.');
    }

    const mappedProducts: AllProductInfoType[] = data.data.map((product) => {
      const productImage = resolveProductCardImage(product, product.all_variants || []);
      
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
        created_at: product.created_at || '',
        brand_highest_discount: product.brand_highest_discount,
      };
    });

    return mappedProducts;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Data produk promo belum bisa dimuat. Silakan coba lagi beberapa saat lagi.');
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
      cache: "no-store",
    });

    if (res.status === 404) {
      return [];
    }

    if (res.status === 422) {
      const errorData = await res.json().catch(() => ({}));
      const errorMessage = errorData.detail?.[0]?.msg || 'Kata kunci atau filter produk belum valid.';
      throw new Error(errorMessage);
    }

    if (res.status === 500) {
      throw new Error('Data produk brand belum bisa dimuat. Silakan coba lagi beberapa saat lagi.');
    }

    if (!res.ok) {
      throw new Error('Data produk brand belum bisa dimuat. Silakan coba lagi beberapa saat lagi.');
    }

    const data: AllProductInfoResponseType = await res.json();
    
    if (!data || !data.data || !Array.isArray(data.data)) {
      throw new Error('Format data produk belum sesuai. Silakan coba lagi nanti.');
    }

    const mappedProducts: AllProductInfoType[] = data.data.map((product) => {
      const productImage = resolveProductCardImage(product, product.all_variants || []);
      
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
    throw new Error('Data produk brand belum bisa dimuat. Silakan coba lagi beberapa saat lagi.');
  }
}
