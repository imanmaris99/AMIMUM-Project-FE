import useSWR from "swr";
import { fetchArticles } from "@/lib/api/articles";

export const useArticles = () => {
    const { data, error } = useSWR("/articles/all", fetchArticles, {
        errorRetryCount: 0,
    });
    return {
        articles: data,
        isLoading: !data && !error,
        isError: error?.response?.status
    };
};