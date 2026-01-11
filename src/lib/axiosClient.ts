import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { ErrorHandler, withRetry, safeAsync } from "./errorHandler";
import { SessionManager } from "./auth";
import { API_BASE_URL } from "./apiConfig";

interface AxiosRequestConfigWithMetadata extends AxiosRequestConfig {
  metadata?: {
    startTime: number;
  };
}

// Enhanced axios client with comprehensive error handling
const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor with enhanced security
axiosClient.interceptors.request.use(
  async (config) => {
    try {
      // Add authentication token
      const session = SessionManager.getSession();
      if (session?.token) {
        config.headers.Authorization = `Bearer ${session.token.token}`;
      }

      // Add CSRF token
      const csrfToken = localStorage.getItem('csrf_token');
      if (csrfToken) {
        config.headers['X-CSRF-Token'] = csrfToken;
      }

      // Add request ID for tracking
      config.headers['X-Request-ID'] = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Add timestamp for debugging
      (config as AxiosRequestConfigWithMetadata).metadata = { startTime: Date.now() };

      return config;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  (error) => {
    ErrorHandler.handleError(error, 'RequestInterceptor');
    return Promise.reject(error);
  }
);

// Response interceptor with comprehensive error handling
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log successful requests
    // const duration = Date.now() - ((response.config as any).metadata?.startTime || 0);
    
    // Validate response data structure
    if (!response.data || typeof response.data !== 'object') {
      throw new Error('Invalid response format: response data is not an object');
    }

    // Validate common API response structure
    if (response.data.status_code && typeof response.data.status_code !== 'number') {
      throw new Error('Invalid response format: status_code must be a number');
    }

    if (response.data.message && typeof response.data.message !== 'string') {
      throw new Error('Invalid response format: message must be a string');
    }

    // Log response validation
    
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const errorMessage = error.response?.data?.message || error.message;

    // Log error details

    // Handle different error types
    if (error.response) {
      switch (status) {
        case 401:
          // Unauthorized - clear session and redirect
          SessionManager.clearSession();
          await ErrorHandler.handleError(
            new Error('Session expired'),
            'API_401',
            false
          );
          setTimeout(() => {
            window.location.replace("/login");
          }, 2000);
          break;

        case 403:
          // Forbidden - insufficient permissions
          await ErrorHandler.handleError(
            new Error('Access forbidden'),
            'API_403',
            false
          );
          break;

        case 404:
          // Not found
          await ErrorHandler.handleError(
            new Error('Resource not found'),
            'API_404',
            false
          );
          break;

        case 422:
          // Validation error
          await ErrorHandler.handleError(
            new Error(errorMessage || 'Validation failed'),
            'API_422',
            false
          );
          break;

        case 429:
          // Rate limited
          await ErrorHandler.handleError(
            new Error('Rate limit exceeded'),
            'API_429',
            true,
            () => axiosClient(originalRequest)
          );
          break;

        case 500:
        case 502:
        case 503:
        case 504:
          // Server errors - retry with exponential backoff
          await ErrorHandler.handleError(
            new Error('Server error'),
            'API_5xx',
            true,
            () => axiosClient(originalRequest)
          );
          break;

        default:
          // Other client errors
          await ErrorHandler.handleError(
            new Error(errorMessage || 'Request failed'),
            'API_4xx',
            false
          );
      }
    } else if (error.request) {
      // Network error - retry with exponential backoff
      await ErrorHandler.handleError(
        new Error('Network error - no response received'),
        'API_NETWORK',
        true,
        () => axiosClient(originalRequest)
      );
    } else {
      // Other errors
      await ErrorHandler.handleError(
        new Error(errorMessage || 'Request setup error'),
        'API_SETUP',
        false
      );
    }

    return Promise.reject(error);
  }
);

// Enhanced API methods with retry and error handling
export const apiClient = {
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return withRetry(async () => {
      const response = await axiosClient.get(url, config);
      return response as T;
    });
  },

  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return withRetry(async () => {
      const response = await axiosClient.post(url, data, config);
      return response as T;
    });
  },

  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return withRetry(async () => {
      const response = await axiosClient.put(url, data, config);
      return response as T;
    });
  },

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return withRetry(async () => {
      const response = await axiosClient.delete(url, config);
      return response as T;
    });
  },

  async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return withRetry(async () => {
      const response = await axiosClient.patch(url, data, config);
      return response as T;
    });
  }
};

// Safe API methods that return undefined on error
export const safeApiClient = {
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T | undefined> {
    return safeAsync(() => apiClient.get<T>(url, config), `GET ${url}`);
  },

  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T | undefined> {
    // Validate request data before sending
    if (data && typeof data !== 'object') {
      ErrorHandler.handleError(new Error('Request data must be an object'), 'SafeAPIPost');
      return undefined;
    }
    return safeAsync(() => apiClient.post<T>(url, data, config), `POST ${url}`);
  },

  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T | undefined> {
    // Validate request data before sending
    if (data && typeof data !== 'object') {
      ErrorHandler.handleError(new Error('Request data must be an object'), 'SafeAPIPut');
      return undefined;
    }
    return safeAsync(() => apiClient.put<T>(url, data, config), `PUT ${url}`);
  },

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T | undefined> {
    return safeAsync(() => apiClient.delete<T>(url, config), `DELETE ${url}`);
  },

  async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T | undefined> {
    // Validate request data before sending
    if (data && typeof data !== 'object') {
      ErrorHandler.handleError(new Error('Request data must be an object'), 'SafeAPIPatch');
      return undefined;
    }
    return safeAsync(() => apiClient.patch<T>(url, data, config), `PATCH ${url}`);
  }
};

export default axiosClient;
