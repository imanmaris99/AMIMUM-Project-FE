import useSWR from "swr";
import { fetchPromo } from "@/services/apiService";

export const usePromo = () => {
    const { data, error } = useSWR("/production/promo", fetchPromo, {
        errorRetryCount: 0,
    });

    return {
        promo: data,
        isLoading: !error && !data,
        isError: error,
    };
};
