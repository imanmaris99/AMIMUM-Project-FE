import type { AllProductInfoType } from "@/types/apiTypes";

export type SearchProductSortOrder = "relevance" | "price-asc" | "price-desc" | "newest";

export interface SearchProductControlOptions {
  brandName?: string;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  sortOrder?: SearchProductSortOrder;
}

export const getSearchProductStartingPrice = (product: AllProductInfoType): number => {
  const basePrice = Number(product.price);
  const variantPrices = (product.all_variants || [])
    .map((variant) => {
      const discountedPrice = Number(variant.discounted_price);
      return Number.isFinite(discountedPrice) && discountedPrice > 0
        ? discountedPrice
        : basePrice;
    })
    .filter((price) => Number.isFinite(price) && price > 0);

  if (variantPrices.length > 0) return Math.min(...variantPrices);
  return Number.isFinite(basePrice) && basePrice > 0 ? basePrice : Number.POSITIVE_INFINITY;
};

export const filterAndSortSearchProducts = (
  products: AllProductInfoType[],
  options: SearchProductControlOptions = {},
): AllProductInfoType[] => {
  const brandName = options.brandName?.trim().toLowerCase();
  const minPrice = Number.isFinite(options.minPrice) ? options.minPrice : undefined;
  const maxPrice = Number.isFinite(options.maxPrice) ? options.maxPrice : undefined;

  const filtered = products
    .map((product, index) => ({ product, index }))
    .filter(({ product }) => {
      if (brandName && product.brand_info?.name?.trim().toLowerCase() !== brandName) return false;

      const startingPrice = getSearchProductStartingPrice(product);
      if (minPrice !== undefined && startingPrice < minPrice) return false;
      if (maxPrice !== undefined && startingPrice > maxPrice) return false;

      if (options.inStockOnly) {
        const hasAvailableVariant = (product.all_variants || []).some(
          (variant) => Number(variant.stock) > 0,
        );
        if (!hasAvailableVariant) return false;
      }

      return true;
    });

  const sortOrder = options.sortOrder || "relevance";
  if (sortOrder !== "relevance") {
    filtered.sort((a, b) => {
      let difference = 0;
      if (sortOrder === "price-asc") {
        difference = getSearchProductStartingPrice(a.product) - getSearchProductStartingPrice(b.product);
      } else if (sortOrder === "price-desc") {
        difference = getSearchProductStartingPrice(b.product) - getSearchProductStartingPrice(a.product);
      } else if (sortOrder === "newest") {
        const aDate = Date.parse(a.product.created_at || "") || 0;
        const bDate = Date.parse(b.product.created_at || "") || 0;
        difference = bDate - aDate;
      }

      return difference || a.index - b.index;
    });
  }

  return filtered.map(({ product }) => product);
};
