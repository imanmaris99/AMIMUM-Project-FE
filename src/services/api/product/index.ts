import axiosClient from "@/lib/axiosClient";
import axios from "axios";
import { API_BASE_URL, API_ENDPOINTS } from "@/lib/apiConfig";
import { shouldFetchProductCatalogForSearch } from "@/lib/productSearchMedia";
import { AllProductInfoType, AllProductInfoResponseType, ProductSearchResponseType, ProductSearchItemType, ProductSearchByBrandResponseType, ProductSearchByBrandItemType, VariantAllProductType } from "@/types/apiTypes";

const DEFAULT_PRODUCT_IMAGE = "/default-image.jpg";
const PRODUCT_ALL_PATH = "/product/all";
const PRODUCT_CATALOG_LOOKUP_TIMEOUT_MS = 2500;
const PRODUCT_CATALOG_LOOKUP_CLIENT_TTL_MS = 5 * 60 * 1000;

let productCatalogLookupClientCache: {
  expiresAt: number;
  lookup: Map<string, AllProductInfoType>;
  promise?: Promise<Map<string, AllProductInfoType>>;
} | null = null;

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
    product.primary_image_url,
    primaryGalleryImage,
    firstGalleryImage,
    product.image,
    firstVariantImage,
  ) || DEFAULT_PRODUCT_IMAGE;
};

const mergeCatalogImageFields = (
  product: AllProductInfoType,
  catalogProduct?: AllProductInfoType,
): AllProductInfoType => {
  const mergedProduct = {
    ...product,
    primary_image_url: product.primary_image_url || catalogProduct?.primary_image_url || null,
    gallery_images: product.gallery_images?.length
      ? product.gallery_images
      : catalogProduct?.gallery_images || [],
  };

  return {
    ...mergedProduct,
    image: resolveProductCardImage(mergedProduct, product.all_variants || catalogProduct?.all_variants || []),
  };
};

const buildProductCatalogLookup = (products: AllProductInfoType[]) =>
  new Map(products.map((product) => [product.id, product]));

async function fetchProductCatalogLookupServer(): Promise<Map<string, AllProductInfoType>> {
  try {
    const res = await fetch(`${API_BASE_URL}${PRODUCT_ALL_PATH}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(PRODUCT_CATALOG_LOOKUP_TIMEOUT_MS),
    });

    if (!res.ok) {
      return new Map();
    }

    const data: AllProductInfoResponseType = await res.json();
    return buildProductCatalogLookup(Array.isArray(data.data) ? data.data : []);
  } catch {
    return new Map();
  }
}

async function fetchProductCatalogLookupClient(): Promise<Map<string, AllProductInfoType>> {
  const now = Date.now();

  if (productCatalogLookupClientCache && productCatalogLookupClientCache.expiresAt > now) {
    if (productCatalogLookupClientCache.promise) {
      return productCatalogLookupClientCache.promise;
    }

    return productCatalogLookupClientCache.lookup;
  }

  const lookupPromise = (async () => {
    try {
      const response = await axiosClient.get<AllProductInfoResponseType>(PRODUCT_ALL_PATH, {
        timeout: PRODUCT_CATALOG_LOOKUP_TIMEOUT_MS,
      });
      const responseData = response as unknown as AllProductInfoResponseType;
      return buildProductCatalogLookup(Array.isArray(responseData.data) ? responseData.data : []);
    } catch {
      return new Map<string, AllProductInfoType>();
    }
  })();

  productCatalogLookupClientCache = {
    expiresAt: now + PRODUCT_CATALOG_LOOKUP_CLIENT_TTL_MS,
    lookup: productCatalogLookupClientCache?.lookup || new Map<string, AllProductInfoType>(),
    promise: lookupPromise,
  };

  try {
    const lookup = await lookupPromise;
    productCatalogLookupClientCache = {
      expiresAt: Date.now() + PRODUCT_CATALOG_LOOKUP_CLIENT_TTL_MS,
      lookup,
    };

    return lookup;
  } catch {
    return new Map();
  }
}

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
      const catalogLookup = shouldFetchProductCatalogForSearch(responseData.data)
        ? await fetchProductCatalogLookupClient()
        : new Map<string, AllProductInfoType>();

      const mappedProducts: AllProductInfoType[] = responseData.data.map((product: ProductSearchItemType) => {
        const variants = Array.isArray(product.all_variants)
          ? product.all_variants
          : [];
        const catalogProduct = catalogLookup.get(product.id);
        const mergedProduct = mergeCatalogImageFields({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image || catalogProduct?.image || DEFAULT_PRODUCT_IMAGE,
          primary_image_url: product.primary_image_url || catalogProduct?.primary_image_url || null,
          gallery_images: product.gallery_images?.length ? product.gallery_images : catalogProduct?.gallery_images || [],
          brand_info: product.brand_info || catalogProduct?.brand_info || {
            id: 0,
            name: "",
            photo_url: undefined,
          },
          all_variants: variants.length > 0 ? variants : catalogProduct?.all_variants || [],
          created_at: product.created_at || catalogProduct?.created_at || "",
          brand_highest_discount: product.highest_promo || catalogProduct?.brand_highest_discount,
        }, catalogProduct);

        const mergedVariants = Array.isArray(mergedProduct.all_variants) ? mergedProduct.all_variants : [];
        const productImage = resolveProductCardImage(mergedProduct, mergedVariants);

        const highestDiscount = mergedVariants.length > 0
          ? Math.max(...mergedVariants.map(v => v.discount || 0))
          : (product.highest_promo || 0);

        return {
          id: mergedProduct.id,
          name: mergedProduct.name,
          price: mergedProduct.price,
          image: productImage,
          primary_image_url: mergedProduct.primary_image_url,
          gallery_images: mergedProduct.gallery_images,
          brand_info: mergedProduct.brand_info || {
            id: 0,
            name: "",
            photo_url: undefined,
          },
          all_variants: mergedVariants,
          created_at: mergedProduct.created_at || "",
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
      const catalogLookup = await fetchProductCatalogLookupClient();

      const mappedProducts: AllProductInfoType[] = responseData.data.map((product: ProductSearchByBrandItemType) => {
        const highestDiscount = product.highest_promo || 0;
        const catalogProduct = catalogLookup.get(product.id);
        const mergedProduct = mergeCatalogImageFields({
          id: product.id,
          name: product.name,
          price: product.price,
          image: catalogProduct?.image || DEFAULT_PRODUCT_IMAGE,
          primary_image_url: catalogProduct?.primary_image_url || null,
          gallery_images: catalogProduct?.gallery_images || [],
          brand_info: catalogProduct?.brand_info || {
            id: productionId,
            name: "",
            photo_url: undefined,
          },
          all_variants: catalogProduct?.all_variants || [],
          created_at: catalogProduct?.created_at || "",
          brand_highest_discount: highestDiscount > 0 ? highestDiscount : catalogProduct?.brand_highest_discount,
        }, catalogProduct);

        return {
          ...mergedProduct,
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

    const catalogLookup = await fetchProductCatalogLookupServer();

    const mappedProducts: AllProductInfoType[] = data.data.map((product) => {
      const mergedProduct = mergeCatalogImageFields(product, catalogLookup.get(product.id));
      const productImage = resolveProductCardImage(mergedProduct, mergedProduct.all_variants || []);
      
      const brandInfo = {
        ...mergedProduct.brand_info,
        photo_url: mergedProduct.brand_info?.photo_url || undefined,
      };
      
      return {
        id: mergedProduct.id,
        name: mergedProduct.name,
        price: mergedProduct.price,
        image: productImage,
        primary_image_url: mergedProduct.primary_image_url,
        gallery_images: mergedProduct.gallery_images,
        brand_info: brandInfo,
        all_variants: mergedProduct.all_variants || [],
        created_at: mergedProduct.created_at || '',
        brand_highest_discount: mergedProduct.brand_highest_discount,
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
      next: { revalidate: 30 },
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

    const catalogLookup = await fetchProductCatalogLookupServer();

    const mappedProducts: AllProductInfoType[] = data.data.map((product) => {
      const mergedProduct = mergeCatalogImageFields(product, catalogLookup.get(product.id));
      
      const brandInfo = {
        ...mergedProduct.brand_info,
        photo_url: mergedProduct.brand_info?.photo_url || undefined,
      };
      
      return {
        ...mergedProduct,
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

/**
 * Fetch a small related-product list for product detail pages.
 * Detail product responses currently expose the brand/company name, while product/all
 * carries the brand id + card-ready data. Filter by normalized brand name and keep
 * this best-effort so product detail remains usable even when the catalog API is slow.
 */
export async function GetRelatedProductsByBrandNameServer(
  brandName: string | null | undefined,
  currentProductId: string,
  limit = 6,
): Promise<AllProductInfoType[]> {
  const normalizedBrandName = brandName?.trim().toLowerCase();

  if (!normalizedBrandName || !currentProductId) {
    return [];
  }

  try {
    const res = await fetch(`${API_BASE_URL}/product/all`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(PRODUCT_CATALOG_LOOKUP_TIMEOUT_MS),
    });

    if (!res.ok) {
      return [];
    }

    const data: AllProductInfoResponseType = await res.json();

    if (!data || !Array.isArray(data.data)) {
      return [];
    }

    return data.data
      .filter((product) => product.id !== currentProductId)
      .filter((product) => product.brand_info?.name?.trim().toLowerCase() === normalizedBrandName)
      .map((product) => ({
        ...product,
        image: resolveProductCardImage(product, product.all_variants || []),
        all_variants: product.all_variants || [],
        created_at: product.created_at || "",
      }))
      .slice(0, limit);
  } catch {
    return [];
  }
}
