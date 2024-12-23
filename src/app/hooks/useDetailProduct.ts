import useSWR from "swr";
import { getDetailProduct } from "@/API/detail-product";

export const useDetailProduct = (productId: string) => {
    console.log("masuk");
    const { data, error } = useSWR(`/product/detail/${productId}`, () => getDetailProduct(productId), {
        errorRetryCount: 0,
    });
    console.log("data", data);
    return {
        detailProduct: data,
        isLoading: !data && !error,
        isError: error?.response?.status
    };
};