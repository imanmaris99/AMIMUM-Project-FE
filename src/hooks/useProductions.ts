import useSWR from "swr";
import { fetchProduction } from "@/lib/api/brand";

export const useProductions = () => {
    const { data, error } = useSWR("/brand/all", fetchProduction, {
        errorRetryCount: 0,
    });

    return {
        productions: data,
        isLoading: !error && !data,
        isError: error?.response?.status,
    }
};
