import axiosClient from "@/lib/axiosClient";

export const fetchArticles = async () => {
    try {
        const response = await axiosClient.get("/articles/all");
        return response.data ? response.data : response;
    } catch (error) {
        throw error;
    }
};
