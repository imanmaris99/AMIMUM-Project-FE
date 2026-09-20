import axios from "axios";
import axiosInstance from "@/lib/axiosInstance";
import { API_ENDPOINTS } from "@/lib/apiConfig";

export const SUPPORTED_COURIERS = [
  { id: "jne", name: "JNE" },
  { id: "pos", name: "POS" },
  { id: "tiki", name: "TIKI" },
  { id: "jnt", name: "J&T Express" },
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

const RAJAONGKIR_LOCATION_ERROR =
  "Data lokasi RajaOngkir belum bisa dimuat. Silakan coba lagi beberapa saat lagi.";

const RAJAONGKIR_SHIPPING_ERROR =
  "Estimasi ongkir belum bisa dimuat. Silakan coba kurir lain atau coba lagi beberapa saat lagi.";

export async function getRajaOngkirProvinces(): Promise<RajaOngkirProvince[]> {
  try {
    const response = await axiosInstance.get<RajaOngkirProvince[]>(
      API_ENDPOINTS.RAJAONGKIR_PROVINCES
    );

    if (Array.isArray(response.data)) {
      return response.data;
    }

    throw new Error(RAJAONGKIR_LOCATION_ERROR);
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(RAJAONGKIR_LOCATION_ERROR);
    }

    if (error instanceof Error && error.message === RAJAONGKIR_LOCATION_ERROR) {
      throw error;
    }

    throw new Error(RAJAONGKIR_LOCATION_ERROR);
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

    throw new Error(RAJAONGKIR_LOCATION_ERROR);
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(RAJAONGKIR_LOCATION_ERROR);
    }

    if (error instanceof Error && error.message === RAJAONGKIR_LOCATION_ERROR) {
      throw error;
    }

    throw new Error(RAJAONGKIR_LOCATION_ERROR);
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

    throw new Error(RAJAONGKIR_SHIPPING_ERROR);
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;

      if (status === 400 || status === 422) {
        throw new Error("Data alamat atau berat pengiriman belum valid untuk menghitung ongkir.");
      }

      if (status === 404) {
        throw new Error("Layanan kurir ini belum tersedia untuk alamat tujuan tersebut. Silakan pilih kurir lain.");
      }

      throw new Error(RAJAONGKIR_SHIPPING_ERROR);
    }

    if (error instanceof Error && error.message !== RAJAONGKIR_SHIPPING_ERROR) {
      throw error;
    }

    throw new Error(RAJAONGKIR_SHIPPING_ERROR);
  }
}
