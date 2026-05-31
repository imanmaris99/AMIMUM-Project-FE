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

interface ShipmentAddressErrorResponse {
  status_code?: number;
  error?: string;
  message?: string;
  detail?: Array<{
    msg?: string;
    message?: string;
  }> | {
    message?: string;
  } | string;
}

const extractApiErrorMessage = (
  errorData: ShipmentAddressErrorResponse,
  fallback: string
): string => {
  if (errorData?.message) return errorData.message;

  const detail = errorData?.detail;
  if (typeof detail === 'string' && detail.trim()) return detail;

  if (Array.isArray(detail)) {
    const msg = detail
      .map((item) => item?.msg || item?.message)
      .filter(Boolean)
      .join(', ');
    if (msg) return msg;
  } else if (detail && typeof detail === 'object' && 'message' in detail && detail.message) {
    return detail.message;
  }

  return fallback;
};

export const getMyShipmentAddresses =
  async (): Promise<ShipmentAddressListResponse> => {
    try {
      const session = SessionManager.getSession();
      const token = session?.token?.token;

      const response = await axiosInstance.get<ShipmentAddressListResponse>(
        API_ENDPOINTS.SHIPMENT_ADDRESS_MY_ADDRESS,
        token && isJwtToken(token)
          ? {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          : undefined
      );

      if (response.data?.status_code === 200 && Array.isArray(response.data.data)) {
        return response.data;
      }

      throw new Error(
        response.data?.message || "Gagal mengambil alamat pengiriman."
      );
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        const status = error.response.status;
        const errorData = error.response.data as ShipmentAddressErrorResponse;

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
          errorData.message || "Gagal mengambil alamat pengiriman."
        );
      }

      if (error instanceof Error) {
        throw error;
      }

      throw new Error("Terjadi kesalahan yang tidak diketahui.");
    }
  };

export const getOwnerShipmentAddress =
  async (): Promise<ShipmentAddressSingleResponse> => {
    try {
      const session = SessionManager.getSession();
      const token = session?.token?.token;

      const response = await axiosInstance.get<ShipmentAddressSingleResponse>(
        API_ENDPOINTS.SHIPMENT_ADDRESS_OWNER,
        token && isJwtToken(token)
          ? {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          : undefined
      );

      if (
        (response.data?.status_code === 200 || response.data?.status_code === 201) &&
        response.data.data
      ) {
        return response.data;
      }

      throw new Error(
        response.data?.message || "Gagal mengambil alamat pemilik toko."
      );
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        const status = error.response.status;
        const errorData = error.response.data as ShipmentAddressErrorResponse;

        if (status === 403) {
          throw new Error(
            errorData.message ||
              "Pengguna tidak diizinkan untuk mengakses informasi ini."
          );
        }

        if (status === 404) {
          throw new Error(
            errorData.message || "Alamat pemilik toko tidak ditemukan."
          );
        }

        if (status === 500) {
          throw new Error(
            errorData.message ||
              "Terjadi kesalahan tak terduga saat mengambil data alamat."
          );
        }

        throw new Error(
          errorData.message || "Gagal mengambil alamat pemilik toko."
        );
      }

      if (error instanceof Error) {
        throw error;
      }

      throw new Error("Terjadi kesalahan yang tidak diketahui.");
    }
  };

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

export interface UpdateShipmentAddressRequest
  extends CreateShipmentAddressRequest {
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

export const createShipmentAddress = async (
  data: CreateShipmentAddressRequest
): Promise<CreateShipmentAddressResponse> => {
  try {
    const session = SessionManager.getSession();
    const token = session?.token?.token;

    const response = await axiosInstance.post<CreateShipmentAddressResponse>(
      API_ENDPOINTS.SHIPMENT_ADDRESS_CREATE,
      data,
      token && isJwtToken(token)
        ? {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        : undefined
    );

    if (
      (response.data?.status_code === 200 || response.data?.status_code === 201) &&
      response.data.data
    ) {
      return response.data;
    }

    throw new Error(
      response.data?.message || "Gagal menyimpan alamat pengiriman."
    );
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      const errorData = error.response.data as ShipmentAddressErrorResponse;

      if (status === 400) {
        throw new Error(
          extractApiErrorMessage(errorData, "Data yang dikirimkan tidak sesuai dengan format yang diharapkan.")
        );
      }

      if (status === 401) {
        throw new Error(
          extractApiErrorMessage(errorData, "Token autentikasi tidak valid atau tidak ditemukan.")
        );
      }

      if (status === 422) {
        const detail = errorData.detail;
        const errorMessages = Array.isArray(detail)
          ? detail.map((item) => item.msg || item.message).filter(Boolean).join(', ')
          : typeof detail === 'string'
            ? detail
            : detail?.message;

        throw new Error(
          errorMessages || extractApiErrorMessage(errorData, "Data alamat tidak lolos validasi.")
        );
      }

      if (status === 500) {
        throw new Error(
          extractApiErrorMessage(errorData, "Terjadi kesalahan tak terduga saat memproses permintaan.")
        );
      }

      throw new Error(
        extractApiErrorMessage(errorData, "Gagal menyimpan alamat pengiriman.")
      );
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Terjadi kesalahan yang tidak diketahui.");
  }
};

export const updateShipmentAddress = async (
  data: UpdateShipmentAddressRequest
): Promise<UpdateShipmentAddressResponse> => {
  try {
    const session = SessionManager.getSession();
    const token = session?.token?.token;

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
      token && isJwtToken(token)
        ? {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        : undefined
    );

    if (
      (response.data?.status_code === 200 || response.data?.status_code === 201) &&
      response.data.data
    ) {
      return response.data;
    }

    throw new Error(
      response.data?.message || "Gagal memperbarui alamat pengiriman."
    );
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      const errorData = error.response.data as ShipmentAddressErrorResponse;

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
        const detail = errorData.detail;
        const errorMessages = Array.isArray(detail)
          ? detail.map((item) => item.msg || item.message).filter(Boolean).join(', ')
          : detail?.message;

        throw new Error(
          errorMessages || errorData.message || "Data alamat tidak lolos validasi."
        );
      }

      if (status === 500) {
        throw new Error(
          errorData.message ||
            "Kesalahan tak terduga saat memperbarui data alamat tujuan pengiriman."
        );
      }

      throw new Error(
        errorData.message || "Gagal memperbarui alamat pengiriman."
      );
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Terjadi kesalahan yang tidak diketahui.");
  }
};

export const deleteShipmentAddress = async (
  addressId: number
): Promise<DeleteShipmentAddressResponse> => {
  try {
    const session = SessionManager.getSession();
    const token = session?.token?.token;

    const response = await axiosInstance.delete<DeleteShipmentAddressResponse>(
      `/shipment-address/delete/${addressId}`,
      token && isJwtToken(token)
        ? {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            data: {
              address_id: addressId,
            },
          }
        : {
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

    throw new Error(
      response.data?.message || "Gagal menghapus alamat pengiriman."
    );
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      const errorData = error.response.data as ShipmentAddressErrorResponse;

      if (status === 403) {
        throw new Error(
          errorData.message ||
            "You do not have permission to delete this address item."
        );
      }

      if (status === 404) {
        throw new Error(
          errorData.message ||
            "Alamat dengan ID yang diberikan tidak ditemukan."
        );
      }

      if (status === 422) {
        const detail = errorData.detail;
        const errorMessages = Array.isArray(detail)
          ? detail.map((item) => item.msg || item.message).filter(Boolean).join(', ')
          : detail?.message;

        throw new Error(
          errorMessages || errorData.message || "Permintaan hapus alamat tidak lolos validasi."
        );
      }

      if (status === 500) {
        throw new Error(
          errorData.message ||
            "Terjadi kesalahan tak terduga saat menghapus alamat."
        );
      }

      throw new Error(
        errorData.message || "Gagal menghapus alamat pengiriman."
      );
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Terjadi kesalahan yang tidak diketahui.");
  }
};
