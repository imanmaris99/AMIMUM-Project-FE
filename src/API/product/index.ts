import axiosClient from "@/lib/axiosClient";

export const SearchGetProduct = async (ProductName: string) => {
    try {
        const response = await axiosClient.get(`/product/${encodeURIComponent(ProductName)}`);
        return response.data ? response.data : response;
    } catch (error) {
        throw error;
    }
}

export const GetProductByBrandId = async (brandId: number) => {
    try {
        const response = await axiosClient.get(`/product/production/${brandId}`);
        return response.data ? response.data : response;
    } catch (error) {
        throw error;
    }
}

export const GetProductDiscountByBrandId = async (brandDiscountId: number) => {
    try {
        const response = await axiosClient.get(`/product/discount/production/${brandDiscountId}`);
        return response.data ? response.data : response;
    } catch (error) {
        throw error;
    }
}
