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

type ShipmentAction = "load" | "create" | "activate" | "delete";

const shipmentActionMessage = (action: ShipmentAction) => {
  switch (action) {
    case "load":
      return "Data pengiriman belum bisa dimuat. Silakan coba lagi beberapa saat lagi.";
    case "create":
      return "Pengiriman belum bisa dibuat. Periksa alamat, kurir, dan ongkir lalu coba lagi.";
    case "activate":
      return "Pilihan pengiriman belum bisa diperbarui. Silakan coba lagi beberapa saat lagi.";
    case "delete":
      return "Pengiriman belum bisa dihapus. Silakan coba lagi beberapa saat lagi.";
  }
};

const shipmentAuthMessage = "Silakan login kembali untuk mengelola pengiriman.";
const shipmentValidationMessage =
  "Data pengiriman belum valid. Pastikan alamat tujuan, kurir, layanan ongkir, dan berat produk sudah benar.";

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

const handleShipmentError = (error: unknown, action: ShipmentAction): never => {
  if (axios.isAxiosError(error) && error.response) {
    const status = error.response.status;

    if (status === 401 || status === 403) {
      throw new Error(shipmentAuthMessage);
    }

    if (status === 400 || status === 422) {
      throw new Error(shipmentValidationMessage);
    }

    if (status === 404) {
      throw new Error("Data pengiriman ini belum tersedia atau sudah berubah. Silakan muat ulang halaman.");
    }

    throw new Error(shipmentActionMessage(action));
  }

  if (error instanceof Error) {
    const safeMessages = [
      shipmentActionMessage(action),
      shipmentAuthMessage,
      shipmentValidationMessage,
      "Data pengiriman ini belum tersedia atau sudah berubah. Silakan muat ulang halaman.",
    ];

    if (safeMessages.includes(error.message)) {
      throw error;
    }
  }

  throw new Error(shipmentActionMessage(action));
};

export async function getMyShipments(): Promise<ShipmentListResponse> {
  try {
    const response = await axiosInstance.get<ShipmentListResponse>(
      API_ENDPOINTS.SHIPMENT_MY_LIST,
      getAuthorizedConfig()
    );

    if (response.data?.status_code === 200 && Array.isArray(response.data.data)) {
      return response.data;
    }

    throw new Error(shipmentActionMessage("load"));
  } catch (error: unknown) {
    return handleShipmentError(error, "load");
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

    throw new Error(shipmentActionMessage("create"));
  } catch (error: unknown) {
    return handleShipmentError(error, "create");
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

    throw new Error(shipmentActionMessage("activate"));
  } catch (error: unknown) {
    return handleShipmentError(error, "activate");
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

    throw new Error(shipmentActionMessage("delete"));
  } catch (error: unknown) {
    return handleShipmentError(error, "delete");
  }
}
