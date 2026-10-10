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
    <div className="w-full max-w-sm rounded-3xl bg-white/95 p-4 shadow-[0_8px_22px_rgba(15,23,42,0.08)] ring-1 ring-emerald-50">
      <div className="space-y-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
            {isPickup ? "Pickup toko" : "Pengiriman"}
          </p>
          <h3 className="mt-1 text-lg font-bold text-[#0D0E09]">
            {isPickup ? "Detail Pengambilan" : "Detail Pelacakan"}
          </h3>
        </div>
        
        {/* Order Details */}
        <div className="space-y-3">
          {/* Tanggal Order */}
          <div className="flex items-start justify-between gap-4 rounded-2xl bg-emerald-50/50 px-3 py-2">
            <span className="text-sm text-[#6B7C73]">
              Tanggal order
            </span>
            <span className="text-right text-sm font-semibold text-[#0D0E09]">
              {orderDate}
            </span>
          </div>
          
          {/* Status Pembayaran */}
          <div className="flex items-start justify-between gap-4 rounded-2xl bg-emerald-50/50 px-3 py-2">
            <span className="text-sm text-[#6B7C73]">
              Status pembayaran
            </span>
            <span className="text-right text-sm font-semibold text-[#0D0E09]">
              {paymentStatus}
            </span>
          </div>
          
          {isPickup ? (
            <div className="rounded-2xl bg-emerald-50/90 px-3 py-2 text-xs font-medium leading-relaxed text-emerald-800">
              Pesanan dipilih untuk ambil langsung di Toko Herbal Amimum. Tidak ada nomor resi karena pesanan tidak dikirim melalui kurir.
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between gap-4 rounded-2xl bg-emerald-50/50 px-3 py-2">
                <span className="text-sm text-[#6B7C73]">
                  No. Resi
                </span>
                <span className="text-right text-sm font-semibold text-[#0D0E09]">
                  {trackingDisplay}
                </span>
              </div>
              {!trackingNumber && (
                <div className="rounded-2xl border border-amber-100 bg-amber-50/90 px-3 py-2 text-xs font-medium leading-relaxed text-amber-800">
                  No. resi belum tersedia. Resi akan muncul setelah admin menyerahkan paket ke kurir dan memasukkan kode tracking resmi.
                </div>
              )}
            </>
          )}
          {recipientName && (
            <div className="flex items-start justify-between gap-4 rounded-2xl bg-emerald-50/50 px-3 py-2">
              <span className="text-sm text-[#6B7C73]">
                Penerima
              </span>
              <span className="text-right text-sm font-semibold text-[#0D0E09]">
                {recipientName}
              </span>
            </div>
          )}
          {phone && (
            <div className="flex items-start justify-between gap-4 rounded-2xl bg-emerald-50/50 px-3 py-2">
              <span className="text-sm text-[#6B7C73]">
                Telepon
              </span>
              <span className="text-right text-sm font-semibold text-[#0D0E09]">
                {phone}
              </span>
            </div>
          )}
          {address && (
            <div className="flex items-start justify-between gap-4 rounded-2xl bg-emerald-50/50 px-3 py-2">
              <span className="text-sm text-[#6B7C73]">
                Alamat
              </span>
              <span className="text-right text-sm font-semibold text-[#0D0E09]">
                {[address, city].filter(Boolean).join(", ")}
              </span>
            </div>
          )}
          {!isPickup && courier && (
            <div className="flex items-start justify-between gap-4 rounded-2xl bg-emerald-50/50 px-3 py-2">
              <span className="text-sm text-[#6B7C73]">
                Kurir
              </span>
              <span className="text-right text-sm font-semibold text-[#0D0E09]">
                {[courier, service].filter(Boolean).join(" - ")}
              </span>
            </div>
          )}
          {!isPickup && estimatedDelivery && (
            <div className="flex items-start justify-between gap-4 rounded-2xl bg-emerald-50/50 px-3 py-2">
              <span className="text-sm text-[#6B7C73]">
                Estimasi
              </span>
              <span className="text-right text-sm font-semibold text-[#0D0E09]">
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
