import useSWR from "swr";
import { fetchCategories } from "@/services/categoriesService";

export const useCategories = () => {
    const { data, error } = useSWR("/categories/all", fetchCategories);

    return {
        categories: data,
        isLoading: !error && !data,
        isError: error,
    };
};
