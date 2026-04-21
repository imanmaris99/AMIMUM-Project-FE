"use client";

import { GoLocation, GoPlus } from "react-icons/go";
import { CheckoutAddressInfo } from "./orderPageUtils";

interface StoreAddressInfo {
  name: string;
  phone: string;
  address: string;
  cityId?: number;
}

interface OrderAddressSectionProps {
  deliveryMethod: "delivery" | "pickup";
  storeAddress: StoreAddressInfo | null;
  selectedAddress: CheckoutAddressInfo | null;
  isReferenceLoading: boolean;
  addressError?: string;
  onAddAddress: () => void;
  onChangeAddress: () => void;
}

const OrderAddressSection = ({
  deliveryMethod,
  storeAddress,
  selectedAddress,
  isReferenceLoading,
  addressError,
  onAddAddress,
  onChangeAddress,
}: OrderAddressSectionProps) => {
  if (deliveryMethod === "pickup") {
    return (
      <div className="px-4 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Informasi Pengambilan</h2>
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex items-start space-x-3">
            <GoLocation className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-medium text-gray-900">
                {storeAddress?.name || "Alamat toko belum tersedia"}
              </p>
              <p className="text-sm text-gray-600">{storeAddress?.phone || "-"}</p>
              <p className="text-sm text-gray-600 mt-1">
                {storeAddress?.address || "Alamat toko belum tersedia"}
              </p>
              <p className="text-sm text-blue-600 font-medium mt-2">
                Jam operasional: 08:00 - 17:00 WIB
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-4 border-b border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Alamat Pengiriman</h2>
        <button
          onClick={onAddAddress}
          className="text-primary text-sm font-medium hover:underline flex items-center"
        >
          <GoPlus className="w-4 h-4 mr-1" />
          Tambah Alamat
        </button>
      </div>

      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-800 font-medium mb-2">Alamat pengirim</p>
        <div className="flex items-start space-x-3">
          <GoLocation className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-medium text-gray-900">
              {storeAddress?.name || "Alamat toko belum tersedia"}
            </p>
            <p className="text-sm text-gray-600">{storeAddress?.phone || "-"}</p>
            <p className="text-sm text-gray-600 mt-1">
              {storeAddress?.address || "Alamat toko belum tersedia"}
            </p>
          </div>
        </div>
      </div>

      <div className="p-3 border-2 border-dashed border-gray-200 rounded-lg">
        <p className="text-sm text-gray-800 font-medium mb-2">Alamat tujuan</p>
        {selectedAddress ? (
          <div className="flex items-start space-x-3">
            <GoLocation className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-medium text-gray-900">{selectedAddress.name}</p>
              <p className="text-sm text-gray-600">{selectedAddress.phone}</p>
              <p className="text-sm text-gray-600 mt-1">
                {selectedAddress.address}, {selectedAddress.city} {selectedAddress.postal_code}
              </p>
            </div>
            <button
              onClick={onChangeAddress}
              className="text-primary text-xs font-medium hover:underline"
            >
              Ubah
            </button>
          </div>
        ) : (
          <button
            onClick={onChangeAddress}
            className="w-full text-center py-4 text-gray-500 hover:text-primary transition-colors"
          >
            <GoPlus className="w-6 h-6 mx-auto mb-2" />
            <p className="text-sm">
              {isReferenceLoading ? "Memuat alamat..." : "Pilih alamat pengiriman"}
            </p>
          </button>
        )}
      </div>
      {addressError && <p className="text-red-500 text-xs mt-1">{addressError}</p>}
    </div>
  );
};

export default OrderAddressSection;
