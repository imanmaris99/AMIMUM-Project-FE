import useSWR from "swr";
import { fetchProduction } from "@/services/apiService";

export const useProductions = () => {
    const { data, error } = useSWR("/production/all", fetchProduction, {
        errorRetryCount: 0,
    });

    return {
        productions: data,
        isLoading: !error && !data,
        isError: error?.response?.status,
    }
};
