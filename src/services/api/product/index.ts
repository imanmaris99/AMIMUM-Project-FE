import axiosClient from "@/lib/axiosClient";
import { API_BASE_URL, API_ENDPOINTS } from "@/lib/apiConfig";

export const SearchGetProduct = async (ProductName: string) => {
    try {
        const response = await axiosClient.get(API_ENDPOINTS.PRODUCT_SEARCH(ProductName));
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const GetProductByBrandId = async (brandId: number) => {
    try {
        const response = await axiosClient.get(API_ENDPOINTS.PRODUCT_BY_BRAND(brandId));
        return response.data ? response.data : response;
    } catch (error) {
        throw error;
    }
}

export const GetProductDiscountByBrandId = async (brandDiscountId: number) => {
    try {
        const response = await axiosClient.get(API_ENDPOINTS.PRODUCT_DISCOUNT_BY_BRAND(brandDiscountId));
        return response.data ? response.data : response;
    } catch (error) {
        throw error;
    }
}

export async function GetProductDiscountByBrandIdServer(brandDiscountId: number) {
  const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.PRODUCT_DISCOUNT_BY_BRAND(brandDiscountId)}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    // next: { revalidate: 60 }, // jika ingin ISR
  });
  if (!res.ok) {
    throw new Error(`Gagal mengambil data produk diskon: ${res.status}`);
  }
  const data = await res.json();
  return data;
}
