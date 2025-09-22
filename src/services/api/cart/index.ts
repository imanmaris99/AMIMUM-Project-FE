export async function getCartServer() {
  const res = await fetch("https://amimumprojectbe-production.up.railway.app/cart", {
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