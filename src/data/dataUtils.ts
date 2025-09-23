// Data Utility Functions
// Memudahkan akses dan sinkronisasi data antar komponen

import {
  generateDetailProductData,
  generateCardProductData,
  generateBrandProducts,
  // generatePromoProducts, // Removed - not used
  BRAND_DATA,
  CATEGORY_DATA,
  ARTICLE_DATA,
  PRODUCTION_DATA,
  PROMO_DATA,
  RATING_DUMMY_DATA,
  RATING_SUMMARY_DATA,
  getProductRatingSummary,
  getProductRatings,
  getUserRatings
} from './dummyData';
import { DetailProductType } from '@/types/detailProduct';
import { CardProductProps } from '@/components/common/Search/CardProduct/types';
import { CartResponseType, CartItemType, CartTotalPricesType } from '@/types/apiTypes';
import { validateDetailProductData, validateProductData } from '@/utils/dataValidation';

// ==================== CACHED DATA ====================
let cachedDetailProducts: { [key: string]: DetailProductType } | null = null;
let cachedCardProducts: CardProductProps[] | null = null;

// ==================== DETAIL PRODUCT UTILITIES ====================
export function getDetailProduct(productId: string): DetailProductType | undefined {
  if (!cachedDetailProducts) {
    cachedDetailProducts = generateDetailProductData();
  }
  const product = cachedDetailProducts[productId];
  
  // Validate product data before returning
  if (product && !validateDetailProductData(product)) {
    return undefined;
  }
  
  return product;
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
  
  // Filter out invalid products
  return cachedCardProducts.filter(validateProductData);
}

export function getCardProductsByBrand(brandId: string): CardProductProps[] {
  try {
    return generateBrandProducts(brandId);
    } catch {
      return [];
    }
}

export function getCardProductsBySearch(query: string, brandFilter?: string): CardProductProps[] {
  const allProducts = getAllCardProducts();
  let filteredProducts = allProducts;
  
  // Filter by brand if specified (brandFilter can be brandId or brandName)
  if (brandFilter) {
    // First try to find by brandId
    let brand = BRAND_DATA[brandFilter as keyof typeof BRAND_DATA];
    
    // If not found by ID, try to find by name
    if (!brand) {
      brand = Object.values(BRAND_DATA).find(b => 
        b.name.toLowerCase().includes(brandFilter.toLowerCase())
      ) || BRAND_DATA["1"]; // fallback to default brand
    }
    
    if (brand) {
      filteredProducts = allProducts.filter(product => 
        product.brand_info.id === brand.id || 
        product.name.toLowerCase().includes(brand.name.toLowerCase()) ||
        product.brand_info.name.toLowerCase().includes(brand.name.toLowerCase())
      );
    }
  }
  
  // Filter by search query
  if (query.trim()) {
    filteredProducts = filteredProducts.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.brand_info.name.toLowerCase().includes(query.toLowerCase())
    );
  }
  
  return filteredProducts;
}

// ==================== BRAND UTILITIES ====================
export function getBrandData(brandId: string) {
  const brand = BRAND_DATA[brandId as keyof typeof BRAND_DATA];
  return brand;
}

export function getAllBrands() {
  return Object.values(BRAND_DATA);
}

export function getBrandForPromo(promoId: string) {
  const brand = getBrandData(promoId);
  if (!brand) {
    return null;
  }
  
  return {
    data: {
      ...brand,
      // Tidak perlu mapping karena sudah sesuai dengan backend DTO
    }
  };
}

// ==================== PROMO UTILITIES ====================
export function getPromoProducts(brandId: string): CardProductProps[] {
  try {
    // Use cached data to prevent duplication
    const allProducts = getAllCardProducts();
    const brand = BRAND_DATA[brandId as keyof typeof BRAND_DATA];
    
  if (!brand) {
    return [];
  }
    
    // Filter products by brand ID and only include those with discount
    const promoProducts = allProducts.filter(product => {
      const isFromBrand = product.brand_info.id === brand.id;
      if (!isFromBrand) return false;
      
      // Check if any variant has discount > 0
      const hasDiscount = product.all_variants.some(variant => variant.discount > 0);
      
      
      return hasDiscount;
    });
    
    
    // Add brand's highest discount to each product for consistent display
    return promoProducts.map(product => ({
      ...product,
      brand_highest_discount: brand.promo_special
    }));
    } catch {
      return [];
    }
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

// ==================== RATING UTILITIES ====================

export function getRatingData() {
  return {
    ratings: RATING_DUMMY_DATA,
    summaries: RATING_SUMMARY_DATA
  };
}

export function getProductRatingData(productId: string) {
  return {
    summary: getProductRatingSummary(productId),
    ratings: getProductRatings(productId)
  };
}

export function getUserRatingData(userId: string) {
  return getUserRatings(userId);
}

// ==================== SEARCH UTILITIES ====================
export function searchProducts(query: string, brandFilter?: string): CardProductProps[] {
  try {
    return getCardProductsBySearch(query, brandFilter);
    } catch {
      return [];
    }
}

// ==================== CART UTILITIES ====================
export function generateCartData(): CartResponseType {
  
  // Generate cart items with different variants - sesuai dengan backend structure
  const cartItems: CartItemType[] = [
    {
      id: "1",
      product_id: "prod-1",
      variant_id: 1,
      quantity: 2,
      price: 15000,
      product_name: "Air Mancur Jamu Beras Kencur",
      variant_name: "Anggur",
      image: "/buyungupik_agr-1.svg",
      created_at: "2024-01-15T10:30:00Z",
      updated_at: "2024-01-15T10:30:00Z"
    },
    {
      id: "2",
      product_id: "prod-2",
      variant_id: 2,
      quantity: 1,
      price: 18000,
      product_name: "Aji Mujarab Jamu Kunyit Asam",
      variant_name: "Strawberry",
      image: "/buyungupik_agr-1.svg",
      created_at: "2024-01-14T15:45:00Z",
      updated_at: "2024-01-14T15:45:00Z"
    },
    {
      id: "3",
      product_id: "prod-3",
      variant_id: 3,
      quantity: 3,
      price: 20000,
      product_name: "Jamu Jago Jamu Temulawak",
      variant_name: "Cokelat",
      image: "/buyungupik_agr-1.svg",
      created_at: "2024-01-13T09:20:00Z",
      updated_at: "2024-01-13T09:20:00Z"
    },
    {
      id: "4",
      product_id: "prod-4",
      variant_id: 4,
      quantity: 1,
      price: 25000,
      product_name: "Nyonya Meneer Jamu Jahe Merah",
      variant_name: "Vanilla",
      image: "/buyungupik_agr-1.svg",
      created_at: "2024-01-12T14:15:00Z",
      updated_at: "2024-01-12T14:15:00Z"
    },
    {
      id: "5",
      product_id: "prod-5",
      variant_id: 5,
      quantity: 2,
      price: 18000,
      product_name: "Sabdo Palon Jamu Sirih Merah",
      variant_name: "Melon",
      image: "/buyungupik_agr-1.svg",
      created_at: "2024-01-11T11:30:00Z",
      updated_at: "2024-01-11T11:30:00Z"
    }
  ];

  // Calculate total prices
  const allItemActivePrices = cartItems.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);

  const totalPrices: CartTotalPricesType = {
    subtotal: allItemActivePrices,
    shipping_cost: 15000,
    total: allItemActivePrices + 15000
  };

  return {
    status_code: 200,
    message: "Cart data retrieved successfully",
    data: {
      items: cartItems,
      total_prices: totalPrices
    }
  };
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

export function getCacheStatus() {
  return {
    detailProducts: cachedDetailProducts ? Object.keys(cachedDetailProducts).length : 0,
    cardProducts: cachedCardProducts ? cachedCardProducts.length : 0
  };
}
