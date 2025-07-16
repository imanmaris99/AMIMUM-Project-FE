import axiosClient from "@/lib/axiosClient";

export const fetchCategories = async () => {
    try {
        const response = await axiosClient.get("/categories/all");
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Fetcher untuk Server Component (tanpa axios, tanpa localStorage, tanpa Swal)
export async function fetchCategoriesServer() {
  const res = await fetch("https://amimumprojectbe-production.up.railway.app/categories/all", {
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