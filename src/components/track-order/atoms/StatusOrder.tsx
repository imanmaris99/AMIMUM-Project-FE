"use client";

import React from "react";
import Image from "next/image";

interface StatusItem {
  id: string;
  title: string;
  icon: string;
  isCompleted: boolean;
}

interface StatusOrderProps {
  currentStatus?: number; // 0-3 untuk menentukan status saat ini
  deliveryType?: string; // 'delivery' atau 'pickup'
}

const StatusOrder: React.FC<StatusOrderProps> = ({ currentStatus = 0, deliveryType = 'delivery' }) => {
  // Different status items based on delivery type
  const getStatusItems = (deliveryType: string): StatusItem[] => {
    if (deliveryType === 'pickup') {
      return [
        {
          id: "packed",
          title: "Dibayar",
          icon: "box",
          isCompleted: currentStatus >= 0
        },
        {
          id: "ready",
          title: "Siap Diambil",
          icon: "box-time",
          isCompleted: currentStatus >= 1
        },
        {
          id: "picked",
          title: "Sudah Diambil",
          icon: "truck-tick",
          isCompleted: currentStatus >= 2
        }
      ];
    } else {
      return [
        {
          id: "packed",
          title: "Dibayar",
          icon: "box",
          isCompleted: currentStatus >= 0
        },
        {
          id: "processing",
          title: "Diproses toko",
          icon: "box-time",
          isCompleted: currentStatus >= 1
        },
        {
          id: "shipping",
          title: "Pengiriman",
          icon: "truck-time",
          isCompleted: currentStatus >= 2
        },
        {
          id: "delivered",
          title: "Sampai tujuan",
          icon: "truck-tick",
          isCompleted: currentStatus >= 3
        }
      ];
    }
  };

  const statusItems = getStatusItems(deliveryType);

  const getIconComponent = (iconName: string) => {
    return (
      <Image
        src={`/${iconName}.svg`}
        alt={`${iconName} icon`}
        width={20}
        height={20}
        className="text-[#292D32]"
      />
    );
  };

  return (
    <div className="w-full max-w-sm rounded-3xl bg-white/95 p-5 shadow-[0_8px_22px_rgba(15,23,42,0.08)] ring-1 ring-emerald-50">
      <div className="space-y-6">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">Alur status</p>
          <h3 className="mt-1 text-lg font-bold text-[#0D0E09]">
            Status Pesanan
          </h3>
        </div>
        {currentStatus < 0 && (
          <div className="rounded-2xl border border-amber-100 bg-amber-50/90 px-3 py-2 text-xs font-medium leading-relaxed text-amber-800">
            Pesanan belum masuk proses pengiriman/pickup. Jika pembayaran belum selesai, lanjutkan pembayaran dari halaman transaksi.
          </div>
        )}
        
        {/* Status List */}
        <div className="space-y-3">
          {statusItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-2xl bg-emerald-50/50 px-3 py-3">
              {/* Left side - Icon and Text */}
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  {getIconComponent(item.icon)}
                </div>
                <span className="text-sm font-semibold text-[#242424]">
                  {item.title}
                </span>
              </div>
              
              {/* Right side - Check mark */}
              {item.isCompleted && (
                <div className="flex-shrink-0">
                  <Image
                    src="/Vector.svg"
                    alt="check mark"
                    width={16}
                    height={16}
                    className="text-[#00593B]"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatusOrder;
