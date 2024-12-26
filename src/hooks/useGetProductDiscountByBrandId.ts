import useSWR from "swr";
import { GetProductDiscountByBrandId } from "@/API/product";

export const useGetProductDiscountByBrandId = (brandDiscountId: number) => {
    const { data, error } = useSWR(`/product/discount/production/${brandDiscountId}`, () => GetProductDiscountByBrandId(brandDiscountId), {
        errorRetryCount: 0,
    });

    let errorMessage: string | null = null;
    if (error) {
        const status = error.response?.status;
        if (status === 404) {
            errorMessage = "Tidak ada produk diskon ditemukan.";
        } else {
            errorMessage = "Terjadi kesalahan yang tidak diketahui";
        }
    }
    return {
        productDiscountByBrandId: data,
        isLoading: !data && !error,
        isError: error?.response?.status,
        errorMessage
    };
}