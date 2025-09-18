// Data Utility Functions
// Memudahkan akses dan sinkronisasi data antar komponen

import { 
  generateDetailProductData, 
  generateCardProductData, 
  generateBrandProducts, 
  generatePromoProducts,
  BRAND_DATA,
  CATEGORY_DATA,
  ARTICLE_DATA,
  PRODUCTION_DATA,
  PROMO_DATA
} from './dummyData';
import { DetailProductType } from '@/types/detailProduct';
import { CardProductProps } from '@/components/common/Search/CardProduct/types';

// ==================== CACHED DATA ====================
let cachedDetailProducts: { [key: string]: DetailProductType } | null = null;
let cachedCardProducts: CardProductProps[] | null = null;

// ==================== DETAIL PRODUCT UTILITIES ====================
export function getDetailProduct(productId: string): DetailProductType | undefined {
  if (!cachedDetailProducts) {
    cachedDetailProducts = generateDetailProductData();
  }
  return cachedDetailProducts[productId];
}

export function getAllDetailProducts(): { [key: string]: DetailProductType } {
  if (!cachedDetailProducts) {
    cachedDetailProducts = generateDetailProductData();
  }
  return cachedDetailProducts;
}

// ==================== CARD PRODUCT UTILITIES ====================
export function getAllCardProducts(): CardProductProps[] {
  if (!cachedCardProducts) {
    cachedCardProducts = generateCardProductData();
  }
  return cachedCardProducts;
}

export function getCardProductsByBrand(brandId: string): CardProductProps[] {
  return generateBrandProducts(brandId);
}

export function getCardProductsBySearch(query: string, brandId?: string): CardProductProps[] {
  const allProducts = getAllCardProducts();
  let filteredProducts = allProducts;
  
  // Filter by brand if specified
  if (brandId) {
    const brand = BRAND_DATA[brandId as keyof typeof BRAND_DATA];
    if (brand) {
      filteredProducts = allProducts.filter(product => 
        product.name.includes(brand.name)
      );
    }
  }
  
  // Filter by search query
  if (query.trim()) {
    filteredProducts = filteredProducts.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase())
    );
  }
  
  return filteredProducts;
}

// ==================== BRAND UTILITIES ====================
export function getBrandData(brandId: string) {
  return BRAND_DATA[brandId as keyof typeof BRAND_DATA];
}

export function getAllBrands() {
  return Object.values(BRAND_DATA);
}

export function getBrandForPromo(promoId: string) {
  const brand = getBrandData(promoId);
  if (!brand) return null;
  
  return {
    data: {
      ...brand,
      image_url: brand.photo_url,
      description: brand.description_list,
      product_count: brand.total_product_with_promo ?? brand.total_product,
    }
  };
}

// ==================== PROMO UTILITIES ====================
export function getPromoProducts(brandId: string): CardProductProps[] {
  return generatePromoProducts(brandId);
}

export function getPromoData() {
  return PROMO_DATA;
}

// ==================== CATEGORY UTILITIES ====================
export function getCategoryData() {
  return CATEGORY_DATA;
}

// ==================== ARTICLE UTILITIES ====================
export function getArticleData() {
  return ARTICLE_DATA;
}

// ==================== PRODUCTION UTILITIES ====================
export function getProductionData() {
  return PRODUCTION_DATA;
}

// ==================== HOMEPAGE UTILITIES ====================
export function getHomepageData() {
  return {
    categories: CATEGORY_DATA,
    productions: PRODUCTION_DATA,
    promo: PROMO_DATA,
    articles: ARTICLE_DATA
  };
}

// ==================== SEARCH UTILITIES ====================
export function searchProducts(query: string, brandId?: string): CardProductProps[] {
  return getCardProductsBySearch(query, brandId);
}

// ==================== CACHE MANAGEMENT ====================
export function clearCache() {
  cachedDetailProducts = null;
  cachedCardProducts = null;
}

export function refreshData() {
  clearCache();
  // Force regeneration on next access
}
