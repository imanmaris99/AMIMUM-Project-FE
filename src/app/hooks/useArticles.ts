import useSWR from "swr";
import { fetchArticles } from "@/API/articles";
import { ArticleProps } from "../components/hompage/Article_Section/types";

export const useArticles = () => {
    const { data, error } = useSWR<ArticleProps[]>("/articles/all", fetchArticles, {
        errorRetryCount: 0,
    });
    return {
        articles: data || null,
        isLoading: !data && !error,
        isError: error?.response?.status
    };
};