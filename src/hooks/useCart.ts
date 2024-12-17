"use client";

import useSWR from "swr";
import { getCart } from "@/lib/api/cart";

export const useCart = () => {
  const { data, error } = useSWR("/cart/my-cart", getCart, {
    errorRetryCount: 0,
  });

  return {
    cart: data,
    isLoading: !error && !data,
    isError: error?.response?.status,
  };
};
