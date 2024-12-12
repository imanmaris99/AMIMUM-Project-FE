import useSWR from "swr";
import { fetchProduction } from "@/API/brand";
import { ProductionProps } from "../components/hompage/Production_Section/types";

export const useProductions = () => {
    const { data, error } = useSWR<ProductionProps[]>("/brand/all", fetchProduction, {
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
        productions: data || null,
        isLoading: !error && !data,
        isError: !!error,
        errorMessage,
    }
};
