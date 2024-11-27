import useSWR from "swr";
import { fetchUserProfile } from "@/API/user-customers/get";

export const useUserProfile = () => {
    if (typeof window === "undefined") {
        return {
            userProfile: null,
            isLoading: false,
            isError: 401,
        };
    }
    const token = localStorage.getItem("access_token");
    if (!token) {
        return {
            userProfile: null,
            isLoading: false,
            isError: 401,
        };
    }
    const { data, error } = useSWR("/user/profile", fetchUserProfile, {
        errorRetryCount: 0,
    });

    return {
        userProfile: data,
        isLoading: !error && !data,
        isError: error?.response?.status,
    };
};