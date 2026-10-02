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
  deliveryType?: string;
}

const DeliveryAddress: React.FC<DeliveryAddressProps> = ({
  orderDate = "-",
  paymentStatus = "Belum tersedia",
  trackingNumber,
  recipientName,
  phone,
  address,
  city,
  courier,
  service,
  estimatedDelivery,
  deliveryType = "delivery"
}) => {
  const trackingDisplay = trackingNumber?.trim() || "Belum tersedia";
  const isPickup = deliveryType === "pickup";

  return (
    <div className="bg-white rounded-2xl p-4 w-full max-w-sm">
      <div className="space-y-4">
        {/* Title */}
        <h3 className="text-lg font-semibold text-[#313131]">
          {isPickup ? "Detail Pengambilan" : "Detail Pelacakan"}
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
          
          {isPickup ? (
            <div className="rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-800">
              Pesanan dipilih untuk ambil langsung di Toko Herbal Amimum. Tidak ada nomor resi karena pesanan tidak dikirim melalui kurir.
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#A2A2A2]">
                  No. Resi
                </span>
                <span className="text-sm font-medium text-[#0D0E09] text-right">
                  {trackingDisplay}
                </span>
              </div>
              {!trackingNumber && (
                <div className="rounded-lg bg-yellow-50 px-3 py-2 text-xs font-medium text-yellow-800">
                  No. resi belum tersedia. Resi akan muncul setelah admin mengirim paket dan memasukkan kode tracking resmi dari kurir.
                </div>
              )}
            </>
          )}
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
          {!isPickup && courier && (
            <div className="flex justify-between items-start gap-4">
              <span className="text-sm text-[#A2A2A2]">
                Kurir
              </span>
              <span className="text-sm font-medium text-[#0D0E09] text-right">
                {[courier, service].filter(Boolean).join(" - ")}
              </span>
            </div>
          )}
          {!isPickup && estimatedDelivery && (
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
