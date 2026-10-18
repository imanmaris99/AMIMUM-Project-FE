export interface SearchProductMediaPayload {
  primary_image_url?: string | null;
  gallery_images?: unknown[];
}

/**
 * Only use the full-catalog fallback for the legacy search response shape.
 * Empty media in the current response is authoritative and should use the card
 * image fallback rather than triggering a serial catalog request.
 */
export const shouldFetchProductCatalogForSearch = (
  products: SearchProductMediaPayload[],
): boolean => products.some((product) =>
  !Object.prototype.hasOwnProperty.call(product, "primary_image_url") ||
  !Object.prototype.hasOwnProperty.call(product, "gallery_images") ||
  !Array.isArray(product.gallery_images),
);
