import axios from "axios";
import { toast } from "react-hot-toast";

const axiosClient = axios.create({
  baseURL: "https://amimumprojectbe-production.up.railway.app",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
        const status = error.response.status;

        switch (status) {
            case 401:
                localStorage.removeItem("access_token");
                toast.error("Sesi berakhir. Silakan login kembali untuk melanjutkan.");
                setTimeout(() => {
                    window.location.replace("/login");
                }, 2000);
                break;
            case 403:
                toast.error("Anda tidak memiliki izin untuk mengakses sumber daya ini.");
                setTimeout(() => {
                    window.location.replace("/");
                }, 2000);
                break;
            case 500:
                toast.error("Terjadi masalah pada server kami. Mohon coba lagi nanti.");
                break;
        }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
