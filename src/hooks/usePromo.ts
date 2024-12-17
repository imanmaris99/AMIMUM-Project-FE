"use client";

import useSWR from "swr";
import { fetchPromo } from "@/lib/api/brand";

export const usePromo = () => {
    const { data, error } = useSWR("/brand/promo", fetchPromo, {
        errorRetryCount: 0,
    });

    return {
        promo: data,
        isLoading: !error && !data,
        isError: error?.response?.status,
    };
};
