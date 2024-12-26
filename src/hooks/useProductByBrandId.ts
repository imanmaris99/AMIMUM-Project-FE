import useSWR from "swr";
import { GetProductByBrandId } from "@/API/product";

export const useProductByBrandId = (brandId: number) => {
    const { data, error } = useSWR(`/product/production/${brandId}`, () => GetProductByBrandId(brandId), {
        errorRetryCount: 0,
    });
    let errorMessage: string | null = null;
    if (error) {
        const status = error.response?.status;
        if (status === 404) {
            errorMessage = "Tidak ada produk ditemukan.";
        } else {
            errorMessage = "Terjadi kesalahan yang tidak diketahui";
        }
    }
    return {
        productByBrandId: data,
        isLoading: !data && !error,
        isError: error?.response?.status,
        errorMessage
    };
}