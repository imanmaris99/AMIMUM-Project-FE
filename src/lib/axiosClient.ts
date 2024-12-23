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
      let title = "Error";
      let text = error.response.data;
      let confirmButtonText = "OK";

      const token = localStorage.getItem("access_token");
      if (token && status === 401) {
        localStorage.removeItem("access_token");
      }

      switch (status) {
        case 401:
          title = "Sesi Berakhir";
          text = "Sesi Anda telah berakhir. Silakan masuk kembali untuk melanjutkan.";
          confirmButtonText = "Pergi ke Login";
          break;
        case 403:
          title = "Tidak Dapat Mengakses";
          text = "Anda tidak memiliki izin untuk mengakses sumber daya ini. Mohon periksa izin Anda dan coba lagi.";
          break;
        case 404:
          title = "Tidak Ditemukan";
          text = "Sumber daya yang Anda minta tidak dapat ditemukan. Mohon periksa kembali URL atau hubungi dukungan.";
          break;
        case 409:
          title = "Konflik";
          text = "Terjadi konflik dengan status sumber daya saat ini. Mohon periksa data Anda dan coba lagi.";
          break;
        case 500:
          title = "Kesalahan Server";
          text = "Terjadi kesalahan pada server kami. Mohon coba lagi nanti atau hubungi dukungan jika masalah berlanjut.";
          break;
      }

      Swal.fire({
        icon: status === 401 && token ? "warning" : "error",
        title: title,
        text: text,
        confirmButtonText: confirmButtonText,
        customClass: {
          popup: "swal-mobile-popup",
        },
      }).then((result) => {
        if (status === 401 && result.isConfirmed) {
          window.location.href = "/login";
        }
      });
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
