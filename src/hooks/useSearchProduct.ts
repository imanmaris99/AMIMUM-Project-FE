import useSWR from "swr";
import { SearchGetProduct } from "@/API/product";
import { CardProductProps } from "@/components/common/Search/CardProduct/types";

export const useSearchProduct = (ProductName: string) => {
  const { data, error, isLoading } = useSWR<CardProductProps[]>(ProductName ? `/product/${ProductName}` : null, () => SearchGetProduct(ProductName), {
    errorRetryCount: 0,
  });

  let errorMessage: string | null = null;

  if (error) {
    const status = error.response?.status;
    if (status === 404) {
      errorMessage = "Hasil pencarian tidak ditemukan.";
    } else {
      errorMessage = "Terjadi kesalahan. Silakan coba lagi.";
    }
  }

  return {
    products: data || null,
    isError: !!error,
    errorMessage,
    isLoading: isLoading,
  };
};
