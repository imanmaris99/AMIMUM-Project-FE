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

type CourierAction = "list" | "shippingCost";

const courierActionMessage = (action: CourierAction) => {
  switch (action) {
    case "list":
      return "Data kurir belum bisa dimuat. Silakan coba lagi beberapa saat lagi.";
    case "shippingCost":
      return "Ongkir belum bisa dihitung. Periksa alamat tujuan, berat paket, atau coba lagi beberapa saat lagi.";
  }
};

const courierAuthMessage = "Silakan login kembali untuk mengelola data kurir.";
const courierValidationMessage =
  "Data ongkir belum valid. Pastikan kota asal, kota tujuan, berat paket, dan kurir sudah benar.";

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

const handleCourierError = (error: unknown, action: CourierAction): never => {
  if (axios.isAxiosError(error) && error.response) {
    const status = error.response.status;

    if (status === 401 || status === 403) {
      throw new Error(courierAuthMessage);
    }

    if (status === 400 || status === 422) {
      throw new Error(courierValidationMessage);
    }

    if (status === 404) {
      throw new Error(
        action === "list"
          ? "Belum ada data kurir tersimpan."
          : "Layanan kurir belum tersedia untuk alamat tujuan ini."
      );
    }

    throw new Error(courierActionMessage(action));
  }

  if (error instanceof Error) {
    const safeMessages = [
      courierActionMessage(action),
      courierAuthMessage,
      courierValidationMessage,
      "Belum ada data kurir tersimpan.",
      "Layanan kurir belum tersedia untuk alamat tujuan ini.",
    ];

    if (safeMessages.includes(error.message)) {
      throw error;
    }
  }

  throw new Error(courierActionMessage(action));
};

export async function getMyCouriers(): Promise<CourierListResponse> {
  try {
    const response = await axiosInstance.get<CourierListResponse>(
      API_ENDPOINTS.COURIER_MY_COURIER,
      getAuthorizedConfig()
    );

    if (response.data?.status_code === 200 && Array.isArray(response.data.data)) {
      return response.data;
    }

    throw new Error(courierActionMessage("list"));
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return {
        status_code: 200,
        message: "Belum ada data kurir tersimpan.",
        data: [],
      };
    }

    return handleCourierError(error, "list");
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

    throw new Error(courierActionMessage("shippingCost"));
  } catch (error: unknown) {
    return handleCourierError(error, "shippingCost");
  }
}
