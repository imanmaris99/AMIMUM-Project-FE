import useSWR from "swr";
import { SearchGetProduct } from "@/API/product";
import axios from "axios";
import { CardProductProps } from "@/app/components/common/Search/CardProduct/types";

export const useSearchProduct = (ProductName: string) => {
    const { data, error, isLoading } = useSWR<CardProductProps[]>(ProductName ? `/product/${ProductName}` : null, () => SearchGetProduct(ProductName), {
        errorRetryCount: 0,
    });

    const getErrorMessage = (error: any): string => {
        if (axios.isAxiosError(error)) {
            switch (error.response?.status) {
                case 404:
                    return "Hasil pencarian tidak ditemukan.";
                default:
                    return "Terjadi kesalahan. Silakan coba lagi.";
            }
        }
        return "Terjadi kesalahan yang tidak diketahui.";
    }

    return {
        products: data || null,
        isError: error ? getErrorMessage(error) : null,
        isLoading: isLoading,
    };
};

