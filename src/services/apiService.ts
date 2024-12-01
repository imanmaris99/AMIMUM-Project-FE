import axiosClient from "@/lib/axiosClient";

export const fetchCategories = async () => {
    try {
        const response = await axiosClient.get("/categories/all");
        return response.data ? response.data : response;
    } catch (error) {
        throw error;
    }
};

export const fetchUserProfile = async () => {
    try {
        const response = await axiosClient.get("/user/profile");
        return response.data ? response.data : response;
    } catch (error) {
        throw error;
    }
};

export const fetchPromo = async () => {
    try {
        const response = await axiosClient.get("/production/promo");
        return response.data ? response.data : response;
    } catch (error) {
        throw error;
    }
};

export const fetchProduction = async () => {
    try {
        const response = await axiosClient.get("/production/all");
        return response.data ? response.data : response;
    } catch (error) {
        throw error;
    }
};

export const fetchArticles = async () => {
    try {
        const response = await axiosClient.get("/articles/all");
        return response.data ? response.data : response;
    } catch (error) {
        throw error;
    }
};
