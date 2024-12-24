import useSWR from "swr";
import { fetchArticles } from "@/API/articles";
import { ArticleProps } from "../components/hompage/Article_Section/types";

export const useArticles = () => {
    const { data, error } = useSWR<ArticleProps[]>("/articles/all", fetchArticles, {
        errorRetryCount: 0,
    });

    let errorMessage: string | null = null;

    if (error) {
        const status = error.response?.status;
        if (status === 404) {
            errorMessage = "Artikel tidak ditemukan";
        } else {
            errorMessage = "Terjadi kesalahan yang tidak diketahui";
        }
    }
    
    return {
        articles: data || null,
        isLoading: !data && !error,
        isError: !!error,
        errorMessage,
    };
};