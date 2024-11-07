import axios from "axios"

export const getPromo = async () => {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/promo`, {
            headers: {
            "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`
        }
        });
        if (response.status === 200) {
            console.log(response.data);
            return response.data;
        } else {
            throw new Error("Failed to fetch promo");
        }
    } catch (error) {
        console.error(error);
    }
};
