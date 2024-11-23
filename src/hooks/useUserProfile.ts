import useSWR from "swr";
import { fetchUserProfile } from "@/services/apiService";

export const useUserProfile = () => {
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