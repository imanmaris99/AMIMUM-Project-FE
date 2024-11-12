import axiosClient from "@/lib/axiosClient";

export const fetchCategories = async () => {
    try {
        const response = await axiosClient.get("/categories/all");
        return response.data ? response.data : response;
    } catch (error) {
        throw error;
    }
};
