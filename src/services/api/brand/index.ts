import axiosClient from "@/lib/axiosClient";

export const GetAllPromo = async () => {
    try {
        const response = await axiosClient.get("/brand/promo");
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const GetAllBrand = async () => {
    try {
        const response = await axiosClient.get("/brand/all");
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const GetBrandDetailByID = async (BrandDetailId: number) => {
    try {
        const response = await axiosClient.get(`/brand/detail/${BrandDetailId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const GetBrandLoader = async (skip = 0, limit = 8) => {
    try {
        const response = await axiosClient.get("/brand/loader", {
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
        const response = await axiosClient.get(`/brand/loader/categories/${categoryId}`, {
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
  const res = await fetch("https://amimumprojectbe-production.up.railway.app/brand/promo", {
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
  const res = await fetch("https://amimumprojectbe-production.up.railway.app/brand/all", {
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
  const res = await fetch(`https://amimumprojectbe-production.up.railway.app/brand/detail/${brandDetailId}`, {
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
