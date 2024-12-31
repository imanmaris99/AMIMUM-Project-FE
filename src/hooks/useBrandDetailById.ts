import useSWR from "swr";
import { GetBrandDetailByID } from "@/API/brand";

export const useBrandDetailById = (brandDetailId: number) => {
    const { data, error } = useSWR(`/brand/detail/${brandDetailId}`, () => GetBrandDetailByID(brandDetailId), {
        errorRetryCount: 0,
    });
    let errorMessage: string | null = null;
    if (error) {
        const status = error.response?.status;
        if (status === 404) {
            errorMessage = "Detail merek tidak ditemukan.";
        } else {
            errorMessage = "Terjadi kesalahan yang tidak diketahui";
        }
    }
    return {
        brandDetailById: data,
        isLoading: !data && !error,
        isError: error?.response?.status,
        errorMessage
    }
}