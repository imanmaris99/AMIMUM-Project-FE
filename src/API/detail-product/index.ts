import axiosClient from "@/lib/axiosClient";
import { DetailProductResponseType } from "@/types/detailProduct";

export const getDetailProduct = async (productId: string) => {
    try {
        console.log("productId", productId);
        const response: DetailProductResponseType = await axiosClient.get(`/product/detail/${productId}`);
        console.log("response", response);
        if (response) return response.data ;
    } catch (error) {
        console.log("error", error);
        throw error;
    }   
};