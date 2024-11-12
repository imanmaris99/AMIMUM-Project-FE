import axios from "axios";

export const getCategories = async () => {

    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const apiToken = process.env.NEXT_API_TOKEN;

    try {
        const response = await axios.get(`${baseUrl}/categories/all`, {
            headers: {
                Authorization: `Bearer ${apiToken}`
            }
        });
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error("Failed to fetch categories");
        }
    } catch (error) {
        throw error;
    }
};