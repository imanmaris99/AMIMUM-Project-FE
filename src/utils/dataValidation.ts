// Data Validation Utilities
// Memastikan konsistensi data antara frontend dan backend

import { AllProductInfoType, VariantAllProductType, BrandInfoType, ProductionProps } from '@/types/apiTypes';
import { DetailProductType } from '@/types/detailProduct';
import { WishlistItem } from '@/types/wishlist';
import { CartItemType } from '@/types/apiTypes';

// ==================== PRODUCT VALIDATION ====================

export function validateProductData(product: any): product is AllProductInfoType {
  return !!(
    product &&
    typeof product.id === 'string' &&
    typeof product.name === 'string' &&
    typeof product.price === 'number' &&
    product.price > 0 &&
    product.brand_info &&
    validateBrandInfo(product.brand_info) &&
    Array.isArray(product.all_variants) &&
    product.all_variants.every(validateVariantData) &&
    typeof product.created_at === 'string'
  );
}

export function validateVariantData(variant: any): variant is VariantAllProductType {
  return !!(
    variant &&
    typeof variant.id === 'number' &&
    typeof variant.variant === 'string' &&
    typeof variant.img === 'string' &&
    typeof variant.discount === 'number' &&
    variant.discount >= 0 &&
    typeof variant.discounted_price === 'number' &&
    variant.discounted_price > 0 &&
    typeof variant.updated_at === 'string'
  );
}

export function validateBrandInfo(brand: any): brand is BrandInfoType {
  return !!(
    brand &&
    typeof brand.id === 'number' &&
    typeof brand.name === 'string' &&
    typeof brand.photo_url === 'string'
  );
}

// ==================== PRODUCTION VALIDATION ====================

export function validateProductionData(production: any): production is ProductionProps {
  return !!(
    production &&
    typeof production.id === 'number' &&
    typeof production.name === 'string' &&
    typeof production.photo_url === 'string' &&
    Array.isArray(production.description_list) &&
    typeof production.category === 'string' &&
    typeof production.created_at === 'string'
  );
}

// ==================== DETAIL PRODUCT VALIDATION ====================

export function validateDetailProductData(product: any): product is DetailProductType {
  return !!(
    product &&
    typeof product.id === 'string' &&
    typeof product.name === 'string' &&
    typeof product.price === 'number' &&
    product.price > 0 &&
    typeof product.is_active === 'boolean' &&
    typeof product.company === 'string' &&
    Array.isArray(product.variants_list) &&
    Array.isArray(product.description_list) &&
    Array.isArray(product.instructions_list) &&
    typeof product.created_at === 'string' &&
    typeof product.updated_at === 'string'
  );
}

// ==================== CART VALIDATION ====================

export function validateCartItemData(item: any): item is CartItemType {
  return !!(
    item &&
    typeof item.id === 'number' &&
    typeof item.product_id === 'string' &&
    typeof item.product_name === 'string' &&
    typeof item.product_price === 'number' &&
    item.product_price > 0 &&
    typeof item.variant_id === 'number' &&
    item.variant_info &&
    typeof item.variant_info.id === 'number' &&
    typeof item.variant_info.variant === 'string' &&
    typeof item.variant_info.name === 'string' &&
    typeof item.variant_info.img === 'string' &&
    typeof item.variant_info.discount === 'number' &&
    item.variant_info.discount >= 0 &&
    typeof item.variant_info.discounted_price === 'number' &&
    item.variant_info.discounted_price >= 0 &&
    typeof item.quantity === 'number' &&
    item.quantity > 0 &&
    typeof item.is_active === 'boolean' &&
    typeof item.created_at === 'string'
  );
}

// ==================== WISHLIST VALIDATION ====================

export function validateWishlistItemData(item: any): item is WishlistItem {
  return !!(
    item &&
    typeof item.id === 'string' &&
    typeof item.productId === 'string' &&
    typeof item.name === 'string' &&
    typeof item.variant === 'string' &&
    typeof item.quantity === 'string' &&
    typeof item.price === 'number' &&
    item.price > 0 &&
    typeof item.image === 'string' &&
    typeof item.addedAt === 'string'
  );
}

// ==================== DATA SANITIZATION ====================

export function sanitizeProductData(product: any): AllProductInfoType | null {
  if (!validateProductData(product)) {
    return null;
  }
  
  return {
    id: product.id,
    name: product.name,
    price: product.price,
    brand_info: product.brand_info,
    all_variants: product.all_variants.filter(validateVariantData),
    created_at: product.created_at
  };
}

export function sanitizeDetailProductData(product: any): DetailProductType | null {
  if (!validateDetailProductData(product)) {
    return null;
  }
  
  return product;
}

// ==================== ERROR HANDLING ====================

export class DataValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'DataValidationError';
  }
}

export function validateAndThrow<T>(
  data: any, 
  validator: (data: any) => data is T, 
  errorMessage: string
): T {
  if (!validator(data)) {
    throw new DataValidationError(errorMessage);
  }
  return data;
}

// ==================== DEBUGGING UTILITIES ====================

export function logValidationErrors(data: any, context: string) {
  console.group(`Data Validation Errors - ${context}`);
  console.groupEnd();
}

export function createValidationReport(data: any[]): {
  valid: number;
  invalid: number;
  errors: string[];
} {
  const errors: string[] = [];
  let valid = 0;
  let invalid = 0;

  data.forEach((item, index) => {
    if (validateProductData(item)) {
      valid++;
    } else {
      invalid++;
      errors.push(`Item at index ${index} failed validation`);
    }
  });

  return { valid, invalid, errors };
}
