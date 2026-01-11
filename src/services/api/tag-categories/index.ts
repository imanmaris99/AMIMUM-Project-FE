import axiosClient from "@/lib/axiosClient";
import { API_BASE_URL, API_ENDPOINTS } from "@/lib/apiConfig";

export const fetchCategories = async () => {
    try {
        const response = await axiosClient.get(API_ENDPOINTS.CATEGORIES_ALL);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Fetcher untuk Server Component (tanpa axios, tanpa localStorage, tanpa Swal)
export async function fetchCategoriesServer() {
  const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CATEGORIES_ALL}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    next: { revalidate: 60 },
  });
  if (!res.ok) {
    throw new Error(`Gagal mengambil data kategori: ${res.status}`);
  }
  const data = await res.json();
  return data;
}