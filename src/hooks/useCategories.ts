import useSWR from "swr";
import { fetchCategories } from "@/API/tag-categories";
import { CategoryProps } from "@/components/homepage/Category_Section/types";

export const useCategories = () => {
  const { data, error } = useSWR<CategoryProps[]>("/categories/all", fetchCategories, {
    errorRetryCount: 0,
  });

  let errorMessage: string | null = null;

  if (error) {
    const status = error.response?.status;
    if (status === 404) {
      errorMessage = "Kategori tidak ditemukan";
    } else {
      errorMessage = "Terjadi kesalahan yang tidak diketahui";
    }
  }

  return {
    categories: data || null,
    isLoading: !error && !data,
    isError: !!error,
    errorMessage,
  };
};
