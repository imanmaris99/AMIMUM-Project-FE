import useSWR from "swr";
import { fetchCategories } from "@/API/tag-categories/get";

export const useCategories = () => {
    const { data, error } = useSWR("/categories/all", fetchCategories, {
        errorRetryCount: 0,
    });

    return {
        categories: data,
        isLoading: !error && !data,
        isError: error?.response?.status,
    };
};
