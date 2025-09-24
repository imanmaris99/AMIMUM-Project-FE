// Data Validation Utilities
// Memastikan konsistensi data antara frontend dan backend

import { AllProductInfoType, VariantAllProductType, BrandInfoType, ProductionProps } from '@/types/apiTypes';
import { DetailProductType } from '@/types/detailProduct';
import { WishlistItem } from '@/types/wishlist';
import { CartItemType } from '@/types/apiTypes';

// ==================== PRODUCT VALIDATION ====================

export function validateProductData(product: unknown): product is AllProductInfoType {
  if (!product || typeof product !== 'object') return false;
  
  const p = product as Record<string, unknown>;
  return !!(
    typeof p.id === 'string' &&
    typeof p.name === 'string' &&
    typeof p.price === 'number' &&
    p.price > 0 &&
    p.brand_info &&
    validateBrandInfo(p.brand_info) &&
    Array.isArray(p.all_variants) &&
    p.all_variants.every(validateVariantData) &&
    typeof p.created_at === 'string'
  );
}

export function validateVariantData(variant: unknown): variant is VariantAllProductType {
  if (!variant || typeof variant !== 'object') return false;
  
  const v = variant as Record<string, unknown>;
  return !!(
    typeof v.id === 'number' &&
    typeof v.variant === 'string' &&
    typeof v.img === 'string' &&
    typeof v.discount === 'number' &&
    v.discount >= 0 &&
    typeof v.discounted_price === 'number' &&
    v.discounted_price > 0 &&
    typeof v.updated_at === 'string'
  );
}

export function validateBrandInfo(brand: unknown): brand is BrandInfoType {
  if (!brand || typeof brand !== 'object') return false;
  
  const b = brand as Record<string, unknown>;
  return !!(
    typeof b.id === 'number' &&
    typeof b.name === 'string' &&
    typeof b.photo_url === 'string'
  );
}

// ==================== PRODUCTION VALIDATION ====================

export function validateProductionData(production: unknown): production is ProductionProps {
  if (!production || typeof production !== 'object') return false;
  
  const p = production as Record<string, unknown>;
  return !!(
    typeof p.id === 'number' &&
    typeof p.name === 'string' &&
    typeof p.photo_url === 'string' &&
    Array.isArray(p.description_list) &&
    typeof p.category === 'string' &&
    typeof p.created_at === 'string'
  );
}

// ==================== DETAIL PRODUCT VALIDATION ====================

export function validateDetailProductData(product: unknown): product is DetailProductType {
  if (!product || typeof product !== 'object') return false;
  
  const p = product as Record<string, unknown>;
  return !!(
    typeof p.id === 'string' &&
    typeof p.name === 'string' &&
    typeof p.price === 'number' &&
    p.price > 0 &&
    typeof p.is_active === 'boolean' &&
    typeof p.company === 'string' &&
    Array.isArray(p.variants_list) &&
    Array.isArray(p.description_list) &&
    Array.isArray(p.instructions_list) &&
    typeof p.created_at === 'string' &&
    typeof p.updated_at === 'string'
  );
}

// ==================== CART VALIDATION ====================

export function validateCartItemData(item: unknown): item is CartItemType {
  if (!item || typeof item !== 'object') return false;
  
  const i = item as Record<string, unknown>;
  return !!(
    typeof i.id === 'string' &&
    typeof i.product_id === 'string' &&
    typeof i.variant_id === 'number' &&
    typeof i.quantity === 'number' &&
    i.quantity > 0 &&
    typeof i.price === 'number' &&
    i.price > 0 &&
    typeof i.product_name === 'string' &&
    typeof i.variant_name === 'string' &&
    typeof i.image === 'string' &&
    typeof i.created_at === 'string' &&
    typeof i.updated_at === 'string'
  );
}

// ==================== WISHLIST VALIDATION ====================

export function validateWishlistItemData(item: unknown): item is WishlistItem {
  if (!item || typeof item !== 'object') return false;
  
  const i = item as Record<string, unknown>;
  return !!(
    typeof i.id === 'string' &&
    typeof i.productId === 'string' &&
    typeof i.name === 'string' &&
    typeof i.variant === 'string' &&
    typeof i.quantity === 'number' &&
    typeof i.price === 'number' &&
    i.price > 0 &&
    typeof i.image === 'string' &&
    typeof i.addedAt === 'string'
  );
}

// ==================== DATA SANITIZATION ====================

export function sanitizeProductData(product: unknown): AllProductInfoType | null {
  if (!validateProductData(product)) {
    return null;
  }
  
  const validProduct = product as AllProductInfoType;
  return {
    id: validProduct.id,
    name: validProduct.name,
    price: validProduct.price,
    image: validProduct.image || "/default-image.jpg",
    brand_info: validProduct.brand_info,
    all_variants: validProduct.all_variants.filter(validateVariantData),
    created_at: validProduct.created_at
  };
}

export function sanitizeDetailProductData(product: unknown): DetailProductType | null {
  if (!validateDetailProductData(product)) {
    return null;
  }
  
  return product as DetailProductType;
}

// ==================== ERROR HANDLING ====================

export class DataValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'DataValidationError';
  }
}

export function validateAndThrow<T>(
  data: unknown, 
  validator: (data: unknown) => data is T, 
  errorMessage: string
): T {
  if (!validator(data)) {
    throw new DataValidationError(errorMessage);
  }
  return data;
}

// ==================== DEBUGGING UTILITIES ====================

export function logValidationErrors(data: unknown, context: string) {
  console.group(`Data Validation Errors - ${context}`);
  console.groupEnd();
}

export function createValidationReport(data: unknown[]): {
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
