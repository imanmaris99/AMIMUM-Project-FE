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

export const GetBrandDetailByID = async (BrandDetailId: number) => {
    try {
        const response = await axiosClient.get(`/brand/detail/${BrandDetailId}`);
        return response.data ? response.data : response;
    } catch (error) {
        throw error;
    }
}

export const GetBrandLoader = async (skip = 0, limit = 9) => {
    try {
        const response = await axiosClient.get(`/brand/loader`, {
            params: {
                skip,
                limit
            }
        });
        return response.data ? {
            data: response.data,
            remaining_records: response.data.remaining_records,
            has_more: response.data.has_more
        } : response;
    } catch (error) {
        throw error;
    }
};

