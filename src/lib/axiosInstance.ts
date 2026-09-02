import axios from "axios"
import { API_BASE_URL } from "./apiConfig"

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": 'application/json'
    },
    // Email flows can take >10s when the backend waits for SMTP/provider response.
    // Keep this above backend SMTP timeout so users receive the real API error/success.
    timeout: 30000,
})

export default axiosInstance