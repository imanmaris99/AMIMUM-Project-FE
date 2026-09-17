import axios from "axios";
import axiosInstance from "@/lib/axiosInstance";
import { API_ENDPOINTS } from "@/lib/apiConfig";
import { isJwtToken, SessionManager } from "@/lib/auth";

export interface ShipmentAddress {
  id: number;
  name: string;
  phone: string;
  address: string;
  city: string;
  city_id: number;
  state: string;
  country: string;
  zip_code: number;
  created_at: string;
}

export interface ShipmentAddressListResponse {
  status_code: number;
  message: string;
  data: ShipmentAddress[];
}

export interface ShipmentAddressSingleResponse {
  status_code: number;
  message: string;
  data: ShipmentAddress;
}

export interface CreateShipmentAddressRequest {
  name: string;
  phone: string;
  address: string;
  city: string;
  city_id?: number;
  state: string;
  country: string;
  zip_code?: number;
}

export interface CreateShipmentAddressResponse {
  status_code: number;
  message: string;
  data: ShipmentAddress;
}

export interface UpdateShipmentAddressRequest extends CreateShipmentAddressRequest {
  address_id: number;
}

export interface UpdateShipmentAddressResponse {
  status_code: number;
  message: string;
  data: ShipmentAddress;
}

export interface DeleteShipmentAddressResponse {
  status_code: number;
  message: string;
  data: {
    address_id: number;
    name: string;
    phone: string;
    address: string | null;
  };
}

type ShipmentAddressAction = "load" | "loadOwner" | "create" | "update" | "delete";

const customerAddressActionMessage = (action: ShipmentAddressAction) => {
  switch (action) {
    case "load":
      return "Alamat pengiriman belum bisa dimuat. Silakan coba lagi beberapa saat lagi.";
    case "loadOwner":
      return "Alamat toko belum bisa dimuat. Silakan coba lagi beberapa saat lagi.";
    case "create":
      return "Alamat pengiriman belum bisa disimpan. Silakan coba lagi beberapa saat lagi.";
    case "update":
      return "Alamat pengiriman belum bisa diperbarui. Silakan coba lagi beberapa saat lagi.";
    case "delete":
      return "Alamat pengiriman belum bisa dihapus. Silakan coba lagi beberapa saat lagi.";
  }
};

const customerAddressAuthMessage = () => "Silakan login kembali untuk mengelola alamat pengiriman.";

const customerAddressNotFoundMessage = (action: ShipmentAddressAction) => {
  if (action === "load") {
    return "Belum ada alamat pengiriman tersimpan di akun Anda.";
  }

  if (action === "loadOwner") {
    return "Alamat toko belum tersedia. Hubungi admin toko sebelum checkout.";
  }

  return "Alamat pengiriman ini belum tersedia atau sudah tidak dapat diubah.";
};

const safeAddressValidationMessage = () =>
  "Data alamat belum valid. Pastikan nama, nomor telepon, alamat, provinsi, kota/kabupaten RajaOngkir, dan kode pos sudah benar.";

const getAuthConfig = () => {
  const session = SessionManager.getSession();
  const token = session?.token?.token;

  return token && isJwtToken(token)
    ? {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    : undefined;
};

const handleShipmentAddressError = (error: unknown, action: ShipmentAddressAction): never => {
  if (axios.isAxiosError(error) && error.response) {
    const status = error.response.status;

    if (status === 401 || status === 403) {
      throw new Error(customerAddressAuthMessage());
    }

    if (status === 404) {
      throw new Error(customerAddressNotFoundMessage(action));
    }

    if (status === 400 || status === 422) {
      throw new Error(safeAddressValidationMessage());
    }

    throw new Error(customerAddressActionMessage(action));
  }

  if (error instanceof Error) {
    const message = error.message;
    const safePrefixes = [
      "Nomor telepon",
      "Alamat wajib",
      "Provinsi dan Kota",
      "Negara wajib",
      "Kode pos",
      "Kota/Kabupaten",
      "Alamat yang akan",
    ];

    if (safePrefixes.some((prefix) => message.startsWith(prefix))) {
      throw error;
    }
  }

  throw new Error(customerAddressActionMessage(action));
};

export const getMyShipmentAddresses = async (): Promise<ShipmentAddressListResponse> => {
  try {
    const response = await axiosInstance.get<ShipmentAddressListResponse>(
      API_ENDPOINTS.SHIPMENT_ADDRESS_MY_ADDRESS,
      getAuthConfig()
    );

    if (response.data?.status_code === 200 && Array.isArray(response.data.data)) {
      return response.data;
    }

    throw new Error(customerAddressActionMessage("load"));
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return {
        status_code: 200,
        message: customerAddressNotFoundMessage("load"),
        data: [],
      };
    }

    return handleShipmentAddressError(error, "load");
  }
};

export const getOwnerShipmentAddress = async (): Promise<ShipmentAddressSingleResponse> => {
  try {
    const response = await axiosInstance.get<ShipmentAddressSingleResponse>(
      API_ENDPOINTS.SHIPMENT_ADDRESS_OWNER,
      getAuthConfig()
    );

    if (
      (response.data?.status_code === 200 || response.data?.status_code === 201) &&
      response.data.data
    ) {
      return response.data;
    }

    throw new Error(customerAddressActionMessage("loadOwner"));
  } catch (error: unknown) {
    return handleShipmentAddressError(error, "loadOwner");
  }
};

export const createShipmentAddress = async (
  data: CreateShipmentAddressRequest
): Promise<CreateShipmentAddressResponse> => {
  try {
    const response = await axiosInstance.post<CreateShipmentAddressResponse>(
      API_ENDPOINTS.SHIPMENT_ADDRESS_CREATE,
      data,
      getAuthConfig()
    );

    if (
      (response.data?.status_code === 200 || response.data?.status_code === 201) &&
      response.data.data
    ) {
      return response.data;
    }

    throw new Error(customerAddressActionMessage("create"));
  } catch (error: unknown) {
    return handleShipmentAddressError(error, "create");
  }
};

export const updateShipmentAddress = async (
  data: UpdateShipmentAddressRequest
): Promise<UpdateShipmentAddressResponse> => {
  try {
    const response = await axiosInstance.put<UpdateShipmentAddressResponse>(
      `/shipment-address/edit/${data.address_id}`,
      {
        update_request: {
          address_id: data.address_id,
        },
        address_data: {
          name: data.name,
          phone: data.phone,
          address: data.address,
          city: data.city,
          city_id: data.city_id,
          state: data.state,
          country: data.country,
          zip_code: data.zip_code,
        },
      },
      getAuthConfig()
    );

    if (
      (response.data?.status_code === 200 || response.data?.status_code === 201) &&
      response.data.data
    ) {
      return response.data;
    }

    throw new Error(customerAddressActionMessage("update"));
  } catch (error: unknown) {
    return handleShipmentAddressError(error, "update");
  }
};

export const deleteShipmentAddress = async (
  addressId: number
): Promise<DeleteShipmentAddressResponse> => {
  try {
    const response = await axiosInstance.delete<DeleteShipmentAddressResponse>(
      `/shipment-address/delete/${addressId}`,
      {
        ...getAuthConfig(),
        data: {
          address_id: addressId,
        },
      }
    );

    if (
      (response.data?.status_code === 200 || response.data?.status_code === 201) &&
      response.data.data
    ) {
      return response.data;
    }

    throw new Error(customerAddressActionMessage("delete"));
  } catch (error: unknown) {
    return handleShipmentAddressError(error, "delete");
  }
};
