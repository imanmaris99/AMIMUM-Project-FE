import axios from "axios";
import Swal from "sweetalert2";

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
                Swal.fire({
                    icon: 'warning',
                    title: 'Sesi Berakhir',
                    text: 'Silakan login kembali untuk melanjutkan.',
                    confirmButtonText: 'Login',
                    customClass: {
                        popup: 'swal-mobile-popup'
                    }
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.replace("/login");
                    }
                });
                break;
            case 403:
                Swal.fire({
                    icon: 'warning',
                    title: 'Tidak Dapat Mengakses',
                    text: 'Anda tidak memiliki izin untuk mengakses sumber daya ini.',
                    confirmButtonText: 'Kembali ke Beranda',
                    customClass: {
                        popup: 'swal-mobile-popup'
                    }
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.replace("/");
                    }
                });
                break;
            case 500:
                Swal.fire({
                    icon: 'error',
                    title: 'Kesalahan Server',
                    text: 'Terjadi masalah pada server kami. Mohon coba lagi nanti.',
                    confirmButtonText: 'OK',
                    customClass: {
                        popup: 'swal-mobile-popup'
                    }
                });
                break;
        }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
