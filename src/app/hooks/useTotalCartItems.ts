import useSWR from "swr";
import { getTotalCartItems } from "@/services/apiService";

export const useTotalCartItems = () => {
  const { data, error } = useSWR("/cart/total-items", getTotalCartItems, {
    errorRetryCount: 0,
  });

  return {
    totalCartItems: data,
    isLoading: !error && !data,
    isError: error?.response?.status,
  };
};
