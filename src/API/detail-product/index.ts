import axiosClient from "@/lib/axiosClient";
import { DetailProductResponseType } from "@/types/detailProduct";

export const getDetailProduct = async (productId: string) => {
    try {
        const response: DetailProductResponseType = await axiosClient.get(`/product/detail/${productId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Fungsi khusus untuk SSR/Server Component
export async function getDetailProductServer(productId: string) {
  const res = await fetch(`https://amimumprojectbe-production.up.railway.app/product/detail/${productId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    // next: { revalidate: 60 }, // optional: ISR
  });
  if (!res.ok) throw new Error("Gagal mengambil detail produk");
  const data = await res.json();
  // Normalisasi field gambar
  if (data?.data) {
    if (!data.data.image_url && data.data.photo_url) {
      data.data.image_url = data.data.photo_url;
    }
    // Jika tetap tidak ada, ambil dari variant pertama
    if (!data.data.image_url && Array.isArray(data.data.variants_list) && data.data.variants_list[0]?.img) {
      data.data.image_url = data.data.variants_list[0].img;
    }
  }
  return data?.data;
}