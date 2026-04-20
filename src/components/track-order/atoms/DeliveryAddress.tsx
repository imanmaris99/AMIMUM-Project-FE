"use client";

import React from "react";

interface DeliveryAddressProps {
  orderDate?: string;
  paymentStatus?: string;
  trackingNumber?: string;
  recipientName?: string;
  phone?: string;
  address?: string;
  city?: string;
  courier?: string;
  service?: string;
  estimatedDelivery?: string;
}

const DeliveryAddress: React.FC<DeliveryAddressProps> = ({
  orderDate = "03 Oktober 2024",
  paymentStatus = "Lunas",
  trackingNumber = "11000280330003",
  recipientName,
  phone,
  address,
  city,
  courier,
  service,
  estimatedDelivery
}) => {
  return (
    <div className="bg-white rounded-2xl p-4 w-full max-w-sm">
      <div className="space-y-4">
        {/* Title */}
        <h3 className="text-lg font-semibold text-[#313131]">
          Detail Order
        </h3>
        
        {/* Order Details */}
        <div className="space-y-3">
          {/* Tanggal Order */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-[#A2A2A2]">
              Tanggal order
            </span>
            <span className="text-sm font-medium text-[#0D0E09]">
              {orderDate}
            </span>
          </div>
          
          {/* Status Pembayaran */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-[#A2A2A2]">
              Status pembayaran
            </span>
            <span className="text-sm font-medium text-[#0D0E09]">
              {paymentStatus}
            </span>
          </div>
          
          {/* No. Resi */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-[#A2A2A2]">
              No. Resi
            </span>
            <span className="text-sm font-medium text-[#0D0E09]">
              {trackingNumber}
            </span>
          </div>
          {recipientName && (
            <div className="flex justify-between items-start gap-4">
              <span className="text-sm text-[#A2A2A2]">
                Penerima
              </span>
              <span className="text-sm font-medium text-[#0D0E09] text-right">
                {recipientName}
              </span>
            </div>
          )}
          {phone && (
            <div className="flex justify-between items-start gap-4">
              <span className="text-sm text-[#A2A2A2]">
                Telepon
              </span>
              <span className="text-sm font-medium text-[#0D0E09] text-right">
                {phone}
              </span>
            </div>
          )}
          {address && (
            <div className="flex justify-between items-start gap-4">
              <span className="text-sm text-[#A2A2A2]">
                Alamat
              </span>
              <span className="text-sm font-medium text-[#0D0E09] text-right">
                {[address, city].filter(Boolean).join(", ")}
              </span>
            </div>
          )}
          {courier && (
            <div className="flex justify-between items-start gap-4">
              <span className="text-sm text-[#A2A2A2]">
                Kurir
              </span>
              <span className="text-sm font-medium text-[#0D0E09] text-right">
                {[courier, service].filter(Boolean).join(" - ")}
              </span>
            </div>
          )}
          {estimatedDelivery && (
            <div className="flex justify-between items-start gap-4">
              <span className="text-sm text-[#A2A2A2]">
                Estimasi
              </span>
              <span className="text-sm font-medium text-[#0D0E09] text-right">
                {estimatedDelivery}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeliveryAddress;
