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
  USER_EDIT_INFO: '/user/edit-info',
  USER_EDIT_PHOTO: '/user/edit-photo',
  USER_REGISTER: '/user/register',
  USER_LOGIN: '/user/login',
  USER_GOOGLE_LOGIN: '/user/auth/google-login',
  USER_FORGOT_PASSWORD: '/user/forgot-password',
  USER_RESET_PASSWORD: '/user/password-reset/confirm',
  USER_VERIFY_EMAIL: '/user/verify-email',
  USER_RESEND_VERIFICATION: '/user/resend-verification',
  SHIPMENT_ADDRESS_CREATE: '/shipment-address/create',
  SHIPMENT_ADDRESS_MY_ADDRESS: '/shipment-address/my-address',
  SHIPMENT_ADDRESS_OWNER: '/shipment-address/owner-address',
  
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
  CART_CREATE: (productId: string, variantId: number | string) => `/cart/product/${productId}/${variantId}`,
  CART_MY_CART: '/cart/my-cart',
  CART_TOTAL_ITEMS: '/cart/total-items',
  CART_UPDATE_QUANTITY: (cartId: string) => `/cart/update-quantity/${cartId}`,
  CART_UPDATE_ACTIVATE: (cartId: string) => `/cart/update-activate/${cartId}`,
  CART_UPDATE_ACTIVATE_ALL: '/cart/update-activate-all',
  CART_DELETE: (cartId: string) => `/cart/delete/${cartId}`,

  // Courier
  COURIER_SHIPPING_COST: '/courier/shipping-cost',
  COURIER_MY_COURIER: '/courier/my-courier',
  COURIER_EDIT: (courierId: number | string) => `/courier/edit-courier/${courierId}`,
  COURIER_DELETE: (courierId: number | string) => `/courier/delete/${courierId}`,

  // Shipment
  SHIPMENT_CREATE: '/shipment/create-shipment',
  SHIPMENT_NEW: '/shipment/new-shipment',
  SHIPMENT_MY_LIST: '/shipment/my-list',
  SHIPMENT_ACTIVATE: (shipmentId: string) => `/shipment/activate/${shipmentId}`,
  SHIPMENT_DELETE: (shipmentId: string) => `/shipment/delete/${shipmentId}`,

  // Orders
  ORDERS_MY_ORDERS: '/orders/my-orders',
  ORDERS_DETAIL: (orderId: string) => `/orders/detail/${orderId}`,
  ORDERS_COMPLETE_DETAILS: (orderId: string) => `/orders/complete-details/${orderId}`,

  // RajaOngkir
  RAJAONGKIR_PROVINCES: '/rajaongkir/provinces',
  RAJAONGKIR_CITIES: (provinceId: number | string) => `/rajaongkir/cities/${provinceId}`,
  RAJAONGKIR_DISTRICTS: (cityId: number | string) => `/rajaongkir/districts/${cityId}`,
  RAJAONGKIR_SHIPPING_COST: '/rajaongkir/shipping-cost',

  // Rating
  RATING_CREATE: (productId: string) => `/rating/product/${productId}`,
  RATING_MY_LIST: '/rating/my-rating-products-list',
  RATING_EDIT: (ratingId: number | string) => `/rating/edit/${ratingId}`,
  RATING_DELETE: (ratingId: number | string) => `/rating/delete/${ratingId}`,

  // Wishlist
  WISHLIST_CREATE: (productId: string) => `/wishlist/product/${productId}`,
  WISHLIST_TOTAL_ITEMS: '/wishlist/total-items',
  WISHLIST_MY_PRODUCTS: '/wishlist/my-products-wishlist',
  WISHLIST_DELETE: (wishlistId: number | string) => `/wishlist/delete/${wishlistId}`,
} as const;
