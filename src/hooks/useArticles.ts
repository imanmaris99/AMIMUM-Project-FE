import useSWR from "swr";
import { fetchArticles } from "@/services/apiService";

export const useArticles = () => {
    const { data, error } = useSWR("/articles/all", fetchArticles, {
        errorRetryCount: 0,
    });
    return {
        articles: data,
        isLoading: !data && !error,
        error: error
    };
};