import axios from "axios";
import { SessionManager } from "./auth";

const axiosInstance = axios.create({
  baseURL: '/api/backend',
  withCredentials: true,
  headers: { "Content-Type": 'application/json' },
  timeout: 30000,
});

axiosInstance.interceptors.request.use(async (config) => {
  if (!['get', 'head', 'options'].includes((config.method || 'get').toLowerCase())) {
    config.headers['X-CSRF-Token'] = await SessionManager.getCsrfToken();
  }
  return config;
});

export default axiosInstance;
