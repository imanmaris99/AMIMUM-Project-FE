import axiosClient from "@/lib/axiosClient";
import { API_BASE_URL, API_ENDPOINTS } from "@/lib/apiConfig";

export const GetAllPromo = async () => {
    try {
        const response = await axiosClient.get(API_ENDPOINTS.BRAND_PROMO);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const GetAllBrand = async () => {
    try {
        const response = await axiosClient.get(API_ENDPOINTS.BRAND_ALL);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const GetBrandDetailByID = async (BrandDetailId: number) => {
    try {
        const response = await axiosClient.get(API_ENDPOINTS.BRAND_DETAIL(BrandDetailId));
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const GetBrandLoader = async (skip = 0, limit = 8) => {
    try {
        const response = await axiosClient.get(API_ENDPOINTS.BRAND_LOADER, {
            params: {
                skip,
                limit
            },
        });
        const { data, remaining_records, has_more } = response.data;
        return {
            data,
            remaining_records,
            has_more
        }
    } catch (error) {
        throw error;
    }
}

export const GetBrandFilterLoader = async (categoryId: number, skip = 0, limit = 8) => {
    try {
        const response = await axiosClient.get(API_ENDPOINTS.BRAND_LOADER_CATEGORIES(categoryId), {
            params: {
                skip,
                limit
            },
        });
        const { data, remaining_records, has_more } = response.data;
        return {
            data,
            remaining_records,
            has_more
        }
    } catch (error) {
        throw error;
    }
}

// Fetcher untuk Server Component (tanpa axios, tanpa localStorage, tanpa Swal)
export async function GetAllPromoServer() {
  const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.BRAND_PROMO}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    next: { revalidate: 60 },
  });
  if (!res.ok) {
    throw new Error(`Gagal mengambil data promo: ${res.status}`);
  }
  const data = await res.json();
  return data;
}

// Fetcher untuk Server Component (tanpa axios, tanpa localStorage, tanpa Swal)
export async function GetAllBrandServer() {
  const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.BRAND_ALL}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    next: { revalidate: 60 },
  });
  if (!res.ok) {
    throw new Error(`Gagal mengambil data brand: ${res.status}`);
  }
  const data = await res.json();
  return data;
}

export async function GetBrandDetailByIDServer(brandDetailId: number) {
  const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.BRAND_DETAIL(brandDetailId)}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    // next: { revalidate: 60 }, // jika ingin ISR
  });
  if (!res.ok) {
    throw new Error(`Gagal mengambil data brand: ${res.status}`);
  }
  const data = await res.json();
  return data;
}
