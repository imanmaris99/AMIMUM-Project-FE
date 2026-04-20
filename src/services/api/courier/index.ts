import axios from "axios";
import axiosInstance from "@/lib/axiosInstance";
import { API_ENDPOINTS } from "@/lib/apiConfig";
import { isJwtToken, SessionManager } from "@/lib/auth";

export interface CourierInfo {
  id: number;
  courier_name: string;
  weight: number;
  phone_number?: string;
  service_type?: string;
  length?: number;
  width?: number;
  height?: number;
  cost?: number;
  estimated_delivery?: string;
  is_active?: boolean;
  created_at?: string;
}

export interface CourierListResponse {
  status_code: number;
  message: string;
  data: CourierInfo[];
}

export interface CourierShippingCostRequest {
  origin: number;
  destination: number;
  weight: number;
  courier: string;
}

export interface CourierShippingCostResponse {
  status_code: number;
  message: string;
  data: {
    shipping_id: string;
    courier_name: string;
    shipping_cost: number;
    estimated_delivery_time: string;
  };
}

interface CourierErrorResponse {
  status_code?: number;
  error?: string;
  message?: string;
  detail?: Array<{
    msg: string;
  }>;
}

function getAuthorizedConfig() {
  const session = SessionManager.getSession();
  const token = session?.token?.token;

  if (token && isJwtToken(token)) {
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }

  return undefined;
}

export async function getMyCouriers(): Promise<CourierListResponse> {
  try {
    const response = await axiosInstance.get<CourierListResponse>(
      API_ENDPOINTS.COURIER_MY_COURIER,
      getAuthorizedConfig()
    );

    if (response.data?.status_code === 200 && Array.isArray(response.data.data)) {
      return response.data;
    }

    throw new Error(response.data?.message || "Gagal mengambil data kurir.");
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      const errorData = error.response.data as CourierErrorResponse;

      if (status === 403) {
        throw new Error(
          errorData.message ||
            "Token tidak valid atau pengguna tidak memiliki akses."
        );
      }

      if (status === 404) {
        return {
          status_code: 200,
          message: errorData.message || "Belum ada data kurir tersimpan.",
          data: [],
        };
      }

      if (status === 500) {
        throw new Error(
          errorData.message ||
            "Kesalahan tak terduga saat mengambil data kurir."
        );
      }

      throw new Error(errorData.message || "Gagal mengambil data kurir.");
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Terjadi kesalahan yang tidak diketahui.");
  }
}

export async function createCourierShippingCost(
  payload: CourierShippingCostRequest
): Promise<CourierShippingCostResponse> {
  try {
    const response = await axiosInstance.post<CourierShippingCostResponse>(
      API_ENDPOINTS.COURIER_SHIPPING_COST,
      payload,
      getAuthorizedConfig()
    );

    if (
      (response.data?.status_code === 200 || response.data?.status_code === 201) &&
      response.data.data
    ) {
      return response.data;
    }

    throw new Error(
      response.data?.message || "Gagal menghitung biaya pengiriman."
    );
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      const errorData = error.response.data as CourierErrorResponse;

      if (status === 400) {
        throw new Error(
          errorData.message ||
            "Data yang dimasukkan tidak valid atau ada kesalahan dalam request."
        );
      }

      if (status === 403) {
        throw new Error(
          errorData.message ||
            "Token tidak valid atau pengguna tidak memiliki akses."
        );
      }

      if (status === 422) {
        const messages = (errorData.detail || []).map((item) => item.msg).join(", ");
        throw new Error(messages || "Data pengiriman tidak lolos validasi.");
      }

      if (status === 500) {
        throw new Error(
          errorData.message ||
            "Terjadi kesalahan saat memproses data pengiriman."
        );
      }

      throw new Error(
        errorData.message || "Gagal menghitung biaya pengiriman."
      );
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Terjadi kesalahan yang tidak diketahui.");
  }
}
