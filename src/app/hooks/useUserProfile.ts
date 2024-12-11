import useSWR from "swr";
import { fetchUserProfile } from "@/API/user-customers";
import { UserProfileProps } from "../components/hompage/Header_Section/types";

export const useUserProfile = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null
    const shouldFetch = token !== null
    const { data, error } = useSWR<UserProfileProps>(shouldFetch ? "/user/profile" : null, fetchUserProfile, {
        errorRetryCount: 0,
    });

    return {
        user: data || null,
        isLoading: !error && !data,
        isError: error?.response?.status || (shouldFetch ? null : 401)
    };
};