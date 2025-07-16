import axiosClient from "@/lib/axiosClient";
import { DetailProductResponseType } from "@/types/detailProduct";

export const getDetailProduct = async (productId: string) => {
    try {
        const response: DetailProductResponseType = await axiosClient.get(`/product/detail/${productId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};