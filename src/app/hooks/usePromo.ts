import useSWR from "swr";
import { fetchPromo } from "@/API/brand";
import { PromoProps } from "../components/hompage/Promo_Section/types";

export const usePromo = () => {
    const { data, error } = useSWR<PromoProps[]>("/brand/promo", fetchPromo, {
        errorRetryCount: 0,
    });

    let errorMessage: string | null = null;

    if (error) {
        const status = error.response?.status;
        if (status === 404) {
            errorMessage = "Promo tidak ditemukan";
        } else {
            errorMessage = "Terjadi kesalahan yang tidak diketahui";
        }
    }

    return {
        promo: data || null,
        isLoading: !error && !data,
        isError: !!error,
        errorMessage,
    };
};
