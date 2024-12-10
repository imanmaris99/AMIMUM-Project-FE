import useSWR from "swr";
import { SearchGetProduct } from "@/API/product";
import axios from "axios";

export const useSearchProduct = (ProductName: string) => {
    const { data, error, isLoading } = useSWR(ProductName ? `/product/${ProductName}` : null, () => SearchGetProduct(ProductName), {
        errorRetryCount: 0,
    });

    let errorMessage = null;
    if (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            errorMessage = "Hasil pencarian tidak ditemukan.";
        } else {
            errorMessage = "Terjadi kesalahan. Silakan coba lagi.";
        }
    }

    return {
        products: data,
        isError: errorMessage,
        isLoading: isLoading,
    };
};

