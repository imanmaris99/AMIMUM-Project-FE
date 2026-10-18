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

export interface SearchProductGalleryImage {
  url?: string | null;
  is_primary?: boolean;
  sort_order?: number;
}

export interface SearchProductImagePayload extends SearchProductMediaPayload {
  image?: string | null;
}

export const resolveSearchProductImage = (
  product: SearchProductImagePayload,
  variantImages: Array<string | null | undefined> = [],
  fallbackImage = "/default-image.jpg",
): string => {
  const galleryImages = Array.isArray(product.gallery_images)
    ? product.gallery_images as SearchProductGalleryImage[]
    : [];
  const primaryGalleryImage = galleryImages.find((image) => image.is_primary && image.url)?.url;
  const firstGalleryImage = [...galleryImages]
    .sort((a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0))
    .find((image) => image.url)?.url;
  const candidates = [
    product.primary_image_url,
    primaryGalleryImage,
    firstGalleryImage,
    product.image,
    ...variantImages,
  ];
  const selectedImage = candidates.find((url): url is string =>
    typeof url === "string" && url.trim().length > 0 && url.trim() !== fallbackImage,
  );

  return selectedImage?.trim() || fallbackImage;
};
