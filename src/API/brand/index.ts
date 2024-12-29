import axiosClient from "@/lib/axiosClient";

export const GetAllPromo = async () => {
    try {
        const response = await axiosClient.get("/brand/promo");
        return response.data ? response.data : response;
    } catch (error) {
        throw error;
    }
};

export const GetAllBrand = async () => {
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

export const GetBrandLoader = async (skip = 0, limit = 8) => {
    try {
        const response = await axiosClient.get("/brand/loader", {
            params: {
                skip,
                limit
            },
        });
        const { data, remaining_records, has_more } = response.data ? response : response.data;
        return {
            data,
            remaining_records,
            has_more
        }
    } catch (error) {
        throw error;
    }
}

