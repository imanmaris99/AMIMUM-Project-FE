/**
 * Centralized API Configuration
 * 
 * This file provides a single source of truth for API base URL configuration.
 * It supports both client-side and server-side usage.
 */

/**
 * Get the API base URL from environment variable or fallback to default
 * 
 * For Next.js:
 * - Client-side: Use NEXT_PUBLIC_ prefix to expose to browser
 * - Server-side: Can use regular env vars (without NEXT_PUBLIC_)
 * 
 * @returns API base URL string
 */
export function getApiBaseUrl(): string {
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_API_BASE_URL || 
           process.env.NEXT_PUBLIC_API_URL || 
           'https://amimumprojectbe-production.up.railway.app';
  }
  
  return process.env.API_BASE_URL || 
         process.env.NEXT_PUBLIC_API_BASE_URL || 
         process.env.API_URL ||
         process.env.NEXT_PUBLIC_API_URL ||
         'https://amimumprojectbe-production.up.railway.app';
}

/**
 * API base URL constant
 * Use this throughout the application instead of hardcoded URLs
 */
export const API_BASE_URL = getApiBaseUrl();

/**
 * API endpoints configuration
 * Centralized endpoint paths for consistency
 */
export const API_ENDPOINTS = {
  // Categories
  CATEGORIES_ALL: '/categories/all',
  
  // User
  USER_PROFILE: '/user/profile',
  USER_REGISTER: '/user/register',
  USER_LOGIN: '/user/login',
  USER_GOOGLE_LOGIN: '/user/auth/google-login',
  USER_FORGOT_PASSWORD: '/user/forgot-password',
  USER_RESET_PASSWORD: '/user/password-reset/confirm',
  USER_VERIFY_EMAIL: '/user/verify-email',
  USER_RESEND_VERIFICATION: '/user/resend-verification',
  
  // Production/Brand
  PRODUCTION_ALL: '/production/all',
  PRODUCTION_PROMO: '/production/promo',
  BRAND_ALL: '/brand/all',
  BRAND_PROMO: '/brand/promo',
  BRAND_DETAIL: (id: number | string) => `/brand/detail/${id}`,
  BRAND_LOADER: '/brand/loader',
  BRAND_LOADER_CATEGORIES: (categoryId: number) => `/brand/loader/categories/${categoryId}`,
  
  // Product
  PRODUCT_SEARCH: (name: string) => `/product/${encodeURIComponent(name)}`,
  PRODUCT_DETAIL: (productId: string) => `/product/detail/${productId}`,
  PRODUCT_BY_BRAND: (brandId: number) => `/product/production/${brandId}`,
  PRODUCT_SEARCH_BY_BRAND: (brandId: number, productName: string) => `/product/production/${brandId}/${encodeURIComponent(productName)}`,
  PRODUCT_DISCOUNT_BY_BRAND: (brandId: number) => `/product/discount/production/${brandId}`,
  
  // Articles
  ARTICLES_ALL: '/articles/all',
  
  // Cart
  CART_MY_CART: '/cart/my-cart',
  CART_TOTAL_ITEMS: '/cart/total-items',
  CART_UPDATE_QUANTITY: (cartId: string) => `/cart/update-quantity/${cartId}`,
  CART_UPDATE_ACTIVATE: (cartId: string) => `/cart/update-activate/${cartId}`,
  CART_UPDATE_ACTIVATE_ALL: '/cart/update-activate-all',
  CART_DELETE: (cartId: string) => `/cart/delete/${cartId}`,
} as const;
