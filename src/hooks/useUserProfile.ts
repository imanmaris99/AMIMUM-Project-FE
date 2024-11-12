import useSWR from "swr";
import { fetchUserProfile } from "@/services/apiService";

export const useUserProfile = () => {
    const { data, error } = useSWR("/user/profile", fetchUserProfile);

    return {
        userProfile: data,
        isLoading: !error && !data,
        isError: error,
    };
};