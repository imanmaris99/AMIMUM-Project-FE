import axiosClient from "@/lib/axiosClient";

export const fetchUserProfile = async () => {
    try {
        const response = await axiosClient.get("/user/profile");
        return response.data;
    } catch (error) {
        throw error;
    }
};