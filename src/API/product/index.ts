import axiosClient from "@/lib/axiosClient";

export const SearchGetProduct = async (ProductName: string) => {
    try {
        const response = await axiosClient.get(`/product/${encodeURIComponent(ProductName)}`);
        return response.data ? response.data : response;
    } catch (error) {
        throw error;
    }
}