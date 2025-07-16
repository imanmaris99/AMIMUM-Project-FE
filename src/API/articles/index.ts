import axiosClient from "@/lib/axiosClient";

export const fetchArticles = async () => {
    try {
        const response = await axiosClient.get("/articles/all");
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Fetcher untuk Server Component (tanpa axios, tanpa localStorage, tanpa Swal)
export async function fetchArticlesServer() {
  const res = await fetch("https://amimumprojectbe-production.up.railway.app/articles/all", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    // Next.js fetch API: revalidate setiap 60 detik (bisa diubah sesuai kebutuhan)
    next: { revalidate: 60 },
  });
  if (!res.ok) {
    throw new Error(`Gagal mengambil data artikel: ${res.status}`);
  }
  const data = await res.json();
  return data;
}
