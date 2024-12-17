import axiosInstance from "../axiosInstance";

interface RegisterData {
    firstname: string;
    lastname: string;
    gender: 'male' | 'female'; 
    email: string;
    phone: string;
    password: string;
}

export const postRegister = async (data: RegisterData) => {
    const response = await axiosInstance.post('/user/register', data)
    return response.data
}