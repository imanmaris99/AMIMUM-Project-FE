"use client";

import useSWR from "swr";
import { fetchUserProfile } from "@/lib/api/user-customers";

export const useUserProfile = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null
    const shouldFetch = token !== null
    const { data, error } = useSWR(shouldFetch ? "/user/profile" : null, fetchUserProfile, {
        errorRetryCount: 0,
    });

    return {
        user: data,
        isLoading: !error && !data,
        isError: error?.response?.status || (shouldFetch ? null : 401)
    };
};