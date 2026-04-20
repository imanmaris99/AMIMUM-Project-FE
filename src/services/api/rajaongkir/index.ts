import axios from "axios";
import axiosInstance from "@/lib/axiosInstance";
import { API_ENDPOINTS } from "@/lib/apiConfig";

export const SUPPORTED_COURIERS = [
  { id: "jne", name: "JNE" },
  { id: "pos", name: "POS" },
  { id: "tiki", name: "TIKI" },
] as const;

export interface RajaOngkirShippingCostRequest {
  origin: number;
  destination: number;
  weight: number;
  courier: string;
}

export interface RajaOngkirShippingDetail {
  service: string;
  description: string;
  cost: number;
  etd: string;
}

export interface RajaOngkirShippingCostResponse {
  courier: string;
  details: RajaOngkirShippingDetail[];
}

export interface RajaOngkirProvince {
  province_id: number;
  province: string;
}

export interface RajaOngkirCity {
  city_id: number;
  province_id: number;
  province: string;
  type: string;
  city_name: string;
  postal_code: number;
}

interface RajaOngkirErrorResponse {
  status_code?: number;
  error?: string;
  message?: string;
  detail?: Array<{
    msg: string;
  }>;
}

export async function getRajaOngkirProvinces(): Promise<RajaOngkirProvince[]> {
  try {
    const response = await axiosInstance.get<RajaOngkirProvince[]>(
      API_ENDPOINTS.RAJAONGKIR_PROVINCES
    );

    if (Array.isArray(response.data)) {
      return response.data;
    }

    throw new Error("Gagal mengambil daftar provinsi.");
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      const errorData = error.response.data as RajaOngkirErrorResponse;
      throw new Error(errorData.message || "Gagal mengambil daftar provinsi.");
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Terjadi kesalahan yang tidak diketahui.");
  }
}

export async function getRajaOngkirCities(
  provinceId: number
): Promise<RajaOngkirCity[]> {
  try {
    const response = await axiosInstance.get<RajaOngkirCity[]>(
      API_ENDPOINTS.RAJAONGKIR_CITIES(provinceId)
    );

    if (Array.isArray(response.data)) {
      return response.data;
    }

    throw new Error("Gagal mengambil daftar kota.");
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      const errorData = error.response.data as RajaOngkirErrorResponse;
      throw new Error(errorData.message || "Gagal mengambil daftar kota.");
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Terjadi kesalahan yang tidak diketahui.");
  }
}

export async function getRajaOngkirShippingCost(
  payload: RajaOngkirShippingCostRequest
): Promise<RajaOngkirShippingCostResponse> {
  try {
    const response = await axiosInstance.post<RajaOngkirShippingCostResponse>(
      API_ENDPOINTS.RAJAONGKIR_SHIPPING_COST,
      payload
    );

    if (response.data?.courier && Array.isArray(response.data.details)) {
      return response.data;
    }

    throw new Error("Gagal mengambil estimasi ongkos kirim.");
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      const errorData = error.response.data as RajaOngkirErrorResponse;

      if (status === 400) {
        throw new Error(
          errorData.message ||
            "Parameter yang diberikan tidak valid, periksa ulang nilai origin, destination, weight, atau courier."
        );
      }

      if (status === 404) {
        throw new Error(
          errorData.message ||
            "Data biaya pengiriman tidak ditemukan untuk parameter yang diberikan."
        );
      }

      if (status === 422) {
        const messages = (errorData.detail || []).map((item) => item.msg).join(", ");
        throw new Error(messages || "Permintaan ongkir tidak lolos validasi.");
      }

      if (status === 500) {
        throw new Error(
          errorData.message ||
            "Kesalahan tak terduga saat memproses permintaan."
        );
      }

      throw new Error(
        errorData.message || "Gagal mengambil estimasi ongkos kirim."
      );
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Terjadi kesalahan yang tidak diketahui.");
  }
}
