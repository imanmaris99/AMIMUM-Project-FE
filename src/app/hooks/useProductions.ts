import useSWR from "swr";
import { fetchProduction } from "@/API/brand";
import { ProductionProps } from "../components/hompage/Production_Section/types";

export const useProductions = () => {
    const { data, error } = useSWR<ProductionProps[]>("/brand/all", fetchProduction, {
        errorRetryCount: 0,
    });

    return {
        productions: data || null,
        isLoading: !error && !data,
        isError: error?.response?.status,
    }
};
