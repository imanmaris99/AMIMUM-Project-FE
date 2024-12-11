import useSWR from "swr";
import { fetchPromo } from "@/API/brand";
import { PromoProps } from "../components/hompage/Promo_Section/types";

export const usePromo = () => {
    const { data, error } = useSWR<PromoProps[]>("/brand/promo", fetchPromo, {
        errorRetryCount: 0,
    });

    return {
        promo: data || null,
        isLoading: !error && !data,
        isError: error?.response?.status,
    };
};
