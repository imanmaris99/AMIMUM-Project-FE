import { API_BASE_URL, API_ENDPOINTS } from "@/lib/apiConfig";

export async function getCartServer() {
  const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CART_MY_CART}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    // next: { revalidate: 30 }, // aktifkan jika ingin ISR
    credentials: "include", // jika butuh cookie/session
  });
  if (!res.ok) {
    throw new Error(`Gagal mengambil data cart: ${res.status}`);
  }
  const data = await res.json();
  return data;
} 