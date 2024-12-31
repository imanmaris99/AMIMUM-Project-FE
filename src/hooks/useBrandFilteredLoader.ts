import useSWR from "swr";
import { GetBrandFilterLoader } from "@/API/brand";

export const useBrandFilteredLoader = (categoryId: number, skip = 0, limit = 8) => {
    const { data, error } = useSWR([`/brand/loader/categories/${categoryId}`, skip, limit], () => GetBrandFilterLoader(categoryId, skip, limit), {
        errorRetryCount: 0,
    });

    let errorMessage: string | null = null;

    if (error) {
        const status = error.response?.status;
        if (status === 404) {
            errorMessage = "Tidak ada merek yang sesuai dengan kategori ini.";
        } else {
            errorMessage = "Terjadi kesalahan yang tidak diketahui";
        }
    }

    return {
        brandFilteredLoader: data,
        remainingRecords: data?.remaining_records ?? 0,
        hasMore: data?.has_more ?? false,
        isLoading: !data && !error,
        isError: error?.response?.status,
        errorMessage
    }
}

