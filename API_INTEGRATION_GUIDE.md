# Panduan Integrasi API

## Ringkasan Perubahan

Proyek ini telah di-refactor untuk menggunakan konfigurasi terpusat untuk integrasi API. Semua URL API yang sebelumnya hardcoded sekarang menggunakan environment variable dan konfigurasi terpusat.

## File Konfigurasi Baru

### 1. `src/lib/apiConfig.ts`
File konfigurasi terpusat yang menyediakan:
- `API_BASE_URL`: Base URL API yang diambil dari environment variable
- `API_ENDPOINTS`: Objek yang berisi semua endpoint API untuk konsistensi

### 2. `.env.example`
Template untuk environment variable. Salin file ini ke `.env.local` dan sesuaikan dengan environment Anda.

## Cara Menggunakan

### 1. Setup Environment Variable

Buat file `.env.local` di root project (atau gunakan `.env` untuk production):

```bash
NEXT_PUBLIC_API_BASE_URL=https://amimumprojectbe-production.up.railway.app
```

**Catatan Penting:**
- Untuk Next.js, gunakan prefix `NEXT_PUBLIC_` agar variable dapat diakses di client-side
- Untuk server-side only, bisa menggunakan tanpa prefix `NEXT_PUBLIC_`

### 2. Menggunakan API Config di Client Components

```typescript
import { API_ENDPOINTS } from "@/lib/apiConfig";
import axiosClient from "@/lib/axiosClient";

// Contoh penggunaan
const response = await axiosClient.get(API_ENDPOINTS.CATEGORIES_ALL);
```

### 3. Menggunakan API Config di Server Components

```typescript
import { API_BASE_URL, API_ENDPOINTS } from "@/lib/apiConfig";

export async function fetchDataServer() {
  const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CATEGORIES_ALL}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    next: { revalidate: 60 },
  });
  return res.json();
}
```

## File yang Telah Diupdate

### Core Configuration
- ✅ `src/lib/apiConfig.ts` (baru)
- ✅ `src/lib/axiosClient.ts`
- ✅ `src/lib/axiosInstance.ts`
- ✅ `src/lib/security.ts`

### API Services
- ✅ `src/services/apiService.ts`
- ✅ `src/services/api/articles/index.ts`
- ✅ `src/services/api/brand/index.ts`
- ✅ `src/services/api/cart/index.ts`
- ✅ `src/services/api/detail-product/index.ts`
- ✅ `src/services/api/product/index.ts`
- ✅ `src/services/api/tag-categories/index.ts`

### API Routes
- ✅ `src/pages/api/product/search.ts`

## Endpoint yang Tersedia

Semua endpoint tersedia melalui `API_ENDPOINTS` object:

```typescript
API_ENDPOINTS = {
  // Categories
  CATEGORIES_ALL: '/categories/all',
  
  // User
  USER_PROFILE: '/user/profile',
  USER_REGISTER: '/user/register',
  
  // Production/Brand
  PRODUCTION_ALL: '/production/all',
  PRODUCTION_PROMO: '/production/promo',
  BRAND_ALL: '/brand/all',
  BRAND_PROMO: '/brand/promo',
  BRAND_DETAIL: (id) => `/brand/detail/${id}`,
  BRAND_LOADER: '/brand/loader',
  BRAND_LOADER_CATEGORIES: (categoryId) => `/brand/loader/categories/${categoryId}`,
  
  // Product
  PRODUCT_SEARCH: (name) => `/product/${encodeURIComponent(name)}`,
  PRODUCT_DETAIL: (productId) => `/product/detail/${productId}`,
  PRODUCT_BY_BRAND: (brandId) => `/product/production/${brandId}`,
  PRODUCT_DISCOUNT_BY_BRAND: (brandId) => `/product/discount/production/${brandId}`,
  
  // Articles
  ARTICLES_ALL: '/articles/all',
  
  // Cart
  CART_MY_CART: '/cart/my-cart',
  CART_TOTAL_ITEMS: '/cart/total-items',
  CART_UPDATE_QUANTITY: (cartId) => `/cart/update-quantity/${cartId}`,
  CART_UPDATE_ACTIVATE: (cartId) => `/cart/update-activate/${cartId}`,
  CART_UPDATE_ACTIVATE_ALL: '/cart/update-activate-all',
  CART_DELETE: (cartId) => `/cart/delete/${cartId}`,
}
```

## Catatan Penting

### 1. Cart Endpoints
Beberapa endpoint cart mungkin perlu penyesuaian berdasarkan implementasi backend yang sebenarnya:
- `editCartQty`: Menggunakan `cart_item_id` dari payload
- `editCartActive`: Mungkin perlu `cart_id` di URL, sesuaikan dengan API backend

### 2. Environment Variables
- Development: Buat `.env.local` dengan URL development
- Production: Set environment variable di platform deployment (Vercel, Railway, dll)

### 3. Fallback URL
Jika environment variable tidak diset, sistem akan menggunakan URL default:
`https://amimumprojectbe-production.up.railway.app`

## Testing

Setelah setup, test dengan:

1. **Type Check:**
```bash
npm run typecheck
```

2. **Lint:**
```bash
npm run lint
```

3. **Build:**
```bash
npm run build
```

## Troubleshooting

### API tidak terhubung
1. Pastikan `.env.local` sudah dibuat dan berisi `NEXT_PUBLIC_API_BASE_URL`
2. Restart development server setelah menambah/mengubah environment variable
3. Pastikan URL API benar dan dapat diakses

### Error di Server Components
- Pastikan menggunakan `API_BASE_URL` dan `API_ENDPOINTS` dari `@/lib/apiConfig`
- Jangan gunakan `axiosClient` di server components, gunakan `fetch` dengan `API_BASE_URL`

## Next Steps

1. ✅ Setup environment variable di `.env.local`
2. ✅ Test semua endpoint API
3. ⚠️ Sesuaikan endpoint cart jika diperlukan berdasarkan dokumentasi backend
4. ✅ Update dokumentasi backend jika ada perubahan endpoint
