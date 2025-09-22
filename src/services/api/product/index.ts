import axiosClient from "@/lib/axiosClient";

export const SearchGetProduct = async (ProductName: string) => {
    try {
        const response = await axiosClient.get(`/product/${encodeURIComponent(ProductName)}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const GetProductByBrandId = async (brandId: number) => {
    try {
        const response = await axiosClient.get(`/product/production/${brandId}`);
        return response.data ? response.data : response;
    } catch (error) {
        throw error;
    }
}

export const GetProductDiscountByBrandId = async (brandDiscountId: number) => {
    try {
        const response = await axiosClient.get(`/product/discount/production/${brandDiscountId}`);
        return response.data ? response.data : response;
    } catch (error) {
        throw error;
    }
}

export async function GetProductDiscountByBrandIdServer(brandDiscountId: number) {
  const res = await fetch(`https://amimumprojectbe-production.up.railway.app/product/discount/production/${brandDiscountId}`, {
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
