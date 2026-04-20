import axios from "axios";
import axiosInstance from "@/lib/axiosInstance";
import { API_ENDPOINTS } from "@/lib/apiConfig";
import { isJwtToken, SessionManager } from "@/lib/auth";

export interface ShipmentListItem {
  id: string;
  my_address: {
    id: number;
    name: string;
    phone: string;
    address: string;
    city?: string;
    city_id?: number;
    state?: string;
    country?: string;
    zip_code?: number;
    created_at?: string;
  };
  my_courier: {
    id: number;
    courier_name: string;
    weight: number;
    service_type?: string;
    cost?: number;
    estimated_delivery?: string;
    created_at?: string;
  };
  is_active: boolean;
  created_at: string;
}

export interface ShipmentListResponse {
  status_code: number;
  message: string;
  data: ShipmentListItem[];
}

export interface CreateShipmentRequest {
  address: {
    name: string;
    phone: string;
    address: string;
    city: string;
    city_id: number;
    state: string;
    country: string;
    zip_code: number;
  };
  courier: {
    courier_name: string;
    weight: number;
    length: number;
    width: number;
    height: number;
    service_type: string;
    cost: number;
    estimated_delivery: string;
  };
}

export interface CreateShipmentResponse {
  status_code: number;
  message: string;
  data: {
    shipment_id: string;
    courier_id: number;
    address_id: number;
    code_tracking: string;
    created_at: string;
    is_active?: boolean;
  };
}

export interface DeleteShipmentResponse {
  status_code: number;
  message: string;
  data: ShipmentListItem;
}

interface ShipmentErrorResponse {
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

export async function getMyShipments(): Promise<ShipmentListResponse> {
  try {
    const response = await axiosInstance.get<ShipmentListResponse>(
      API_ENDPOINTS.SHIPMENT_MY_LIST,
      getAuthorizedConfig()
    );

    if (response.data?.status_code === 200 && Array.isArray(response.data.data)) {
      return response.data;
    }

    throw new Error(
      response.data?.message || "Gagal mengambil data pengiriman."
    );
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      const errorData = error.response.data as ShipmentErrorResponse;

      if (status === 401) {
        throw new Error(
          errorData.message ||
            "Pengguna harus login untuk mengakses alamat pengiriman."
        );
      }

      if (status === 500) {
        throw new Error(
          errorData.message ||
            "Terjadi kesalahan tak terduga saat mengambil data alamat."
        );
      }

      throw new Error(
        errorData.message || "Gagal mengambil data pengiriman."
      );
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Terjadi kesalahan yang tidak diketahui.");
  }
}

export async function createShipment(
  payload: CreateShipmentRequest
): Promise<CreateShipmentResponse> {
  try {
    const response = await axiosInstance.post<CreateShipmentResponse>(
      API_ENDPOINTS.SHIPMENT_CREATE,
      payload,
      getAuthorizedConfig()
    );

    if (
      (response.data?.status_code === 200 || response.data?.status_code === 201) &&
      response.data.data
    ) {
      return response.data;
    }

    throw new Error(response.data?.message || "Gagal membuat pengiriman.");
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      const errorData = error.response.data as ShipmentErrorResponse;

      if (status === 400) {
        throw new Error(
          errorData.message ||
            "Data yang diberikan tidak valid. Pastikan semua informasi lengkap dan benar."
        );
      }

      if (status === 401) {
        throw new Error(
          errorData.message ||
            "Token tidak valid atau pengguna tidak terautentikasi."
        );
      }

      if (status === 422) {
        const messages = (errorData.detail || []).map((item) => item.msg).join(", ");
        throw new Error(messages || "Data shipment tidak lolos validasi.");
      }

      if (status === 500) {
        throw new Error(
          errorData.message ||
            "Terjadi kesalahan tak terduga saat mencoba membuat shipment."
        );
      }

      throw new Error(errorData.message || "Gagal membuat pengiriman.");
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Terjadi kesalahan yang tidak diketahui.");
  }
}

export async function activateShipment(
  shipmentId: string,
  isActive: boolean
): Promise<CreateShipmentResponse> {
  try {
    const response = await axiosInstance.put<CreateShipmentResponse>(
      API_ENDPOINTS.SHIPMENT_ACTIVATE(shipmentId),
      {
        update_request: {
          shipment_id: shipmentId,
        },
        activate_update: {
          is_active: isActive,
        },
      },
      getAuthorizedConfig()
    );

    if (response.data?.status_code === 200 && response.data.data) {
      return response.data;
    }

    throw new Error(
      response.data?.message || "Gagal memperbarui status pengiriman."
    );
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      const errorData = error.response.data as ShipmentErrorResponse;

      if (status === 400) {
        throw new Error(
          errorData.message ||
            "Data yang diberikan tidak valid atau format tidak sesuai."
        );
      }

      if (status === 403) {
        throw new Error(
          errorData.message ||
            "Token tidak valid atau pengguna tidak memiliki akses untuk memperbarui data ini."
        );
      }

      if (status === 404) {
        throw new Error(
          errorData.message ||
            "Alamat dengan ID yang diberikan tidak ditemukan."
        );
      }

      if (status === 422) {
        const messages = (errorData.detail || []).map((item) => item.msg).join(", ");
        throw new Error(messages || "Permintaan aktivasi tidak lolos validasi.");
      }

      if (status === 500) {
        throw new Error(
          errorData.message ||
            "Kesalahan tak terduga saat memperbarui data pengiriman."
        );
      }

      throw new Error(
        errorData.message || "Gagal memperbarui status pengiriman."
      );
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Terjadi kesalahan yang tidak diketahui.");
  }
}

export async function deleteShipment(
  shipmentId: string
): Promise<DeleteShipmentResponse> {
  try {
    const response = await axiosInstance.delete<DeleteShipmentResponse>(
      API_ENDPOINTS.SHIPMENT_DELETE(shipmentId),
      {
        ...getAuthorizedConfig(),
        data: {
          shipment_id: shipmentId,
        },
      }
    );

    if (
      (response.data?.status_code === 200 || response.data?.status_code === 201) &&
      response.data.data
    ) {
      return response.data;
    }

    throw new Error(response.data?.message || "Gagal menghapus pengiriman.");
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      const errorData = error.response.data as ShipmentErrorResponse;

      if (status === 403) {
        throw new Error(
          errorData.message ||
            "You do not have permission to delete this address item."
        );
      }

      if (status === 404) {
        throw new Error(
          errorData.message ||
            "Shipment dengan ID yang diberikan tidak ditemukan."
        );
      }

      if (status === 422) {
        const messages = (errorData.detail || []).map((item) => item.msg).join(", ");
        throw new Error(messages || "Permintaan hapus shipment tidak valid.");
      }

      if (status === 500) {
        throw new Error(
          errorData.message ||
            "Terjadi kesalahan tak terduga saat menghapus shipment."
        );
      }

      throw new Error(errorData.message || "Gagal menghapus pengiriman.");
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Terjadi kesalahan yang tidak diketahui.");
  }
}
