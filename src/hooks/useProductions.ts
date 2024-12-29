import useSWR from "swr";
import { GetAllBrand } from "@/API/brand";
import { ProductionProps } from "@/components/homepage/Production_Section/types";

export const useGetAllProductions = () => {
  const { data, error } = useSWR<ProductionProps[]>("/brand/all", GetAllBrand, {
    errorRetryCount: 0,
  });

  let errorMessage: string | null = null;

  if (error) {
    const status = error.response?.status;
    if (status === 404) {
      errorMessage = "Produk tidak ditemukan";
    } else {
      errorMessage = "Terjadi kesalahan yang tidak diketahui";
    }
  }

  return {
    AllProductions: data || null,
    isLoading: !error && !data,
    isError: !!error,
    errorMessage,
  };
};
