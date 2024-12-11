import useSWR from "swr";
import { fetchCategories } from "@/API/tag-categories";
import { CategoryProps } from "../components/hompage/Category_Section/types";

export const useCategories = () => {
    const { data, error } = useSWR<CategoryProps[]>("/categories/all", fetchCategories, {
        errorRetryCount: 0,
    });

    return {
        categories: data || null,
        isLoading: !error && !data,
        isError: error?.response?.status,
    };
};
