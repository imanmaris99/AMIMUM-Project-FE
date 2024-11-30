import axiosClient from "@/lib/axiosClient";

export const fetchPromo = async () => {
    try {
        const response = await axiosClient.get("/brand/promo");
        return response.data ? response.data : response;
    } catch (error) {
        throw error;
    }
};

export const fetchProduction = async () => {
    try {
        const response = await axiosClient.get("/brand/all");
        return response.data ? response.data : response;
    } catch (error) {
        throw error;
    }
};