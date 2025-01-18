import TopNavigation from "@/components/cart/2_widgets/TopNavigation";
import Ceklis from "@/components/track-order/Ceklis";
import Dibungkus from "@/components/track-order/Dibungkus";
import Diproses from "@/components/track-order/Diproses";
import Pengiriman from "@/components/track-order/Pengiriman";
import Sampai from "@/components/track-order/Sampai";
import Image from "next/image";
import React from "react";

const TrackOrder = () => {
  return (
    <div className="bg-black">
      <main className="flex flex-col w-[375px] mx-auto bg-[#FAFAFA] text-[#000D09]">
        <TopNavigation>Track Order</TopNavigation>
        <div className="px-[22px] pt-[133px]">
          <div className="border-b-2 py-8">
            <div className="flex items-center w-[300px] mx-auto space-x-4">
              <Image
                src="/buyungupik_agr1.png"
                alt="buyung upik anggur"
                width={88}
                height={88}
              />
              <div>
                <p className="font-medium text-sm">Buyung Upik</p>
                <p className="text-xs text-[#C4C4C4]">
                  <span>Anggur</span> • <span>Size: dus</span> •{" "}
                  <span>Qty: 1</span>
                </p>
                <p className="font-medium pt-3">Rp 17500</p>
              </div>
            </div>
          </div>

          <div className="border-b-2 py-4">
            <div className="bg-white py-4 px-4 space-y-1.5 rounded-2xl">
              <p className="text-base font-semibold">Detail Order</p>

              <div className="flex">
                <p className="w-1/2 text-sm text-[#A2A2A2]">Tanggal order</p>
                <p className="w-1/2 text-center text-xs">03 Oktober 2024</p>
              </div>

              <div className="flex">
                <p className="w-1/2 text-sm text-[#A2A2A2]">
                  Status Pembayaran
                </p>
                <p className="w-1/2 text-center text-xs">Lunas</p>
              </div>

              <div className="flex">
                <p className="w-1/2 text-sm text-[#A2A2A2]">No. Resi</p>
                <p className="w-1/2 text-center text-xs">11000280330003</p>
              </div>
            </div>
          </div>

          <div className="py-8">
            <div className="bg-white py-4 pl-6 pr-10 space-y-3.5 rounded-2xl">
              <p className="text-base font-semibold">Status Order</p>
              <div className="flex justify-between">
                <div className="flex items-center space-x-4">
                  <Dibungkus />
                  <p className="text-sm">Dibungkus</p>
                </div>
                <Ceklis />
              </div>
              <div className="flex justify-between">
                <div className="flex items-center space-x-4">
                  <Diproses />
                  <p className="text-sm">Diproses ke kurir</p>
                </div>
                {false && <Ceklis />}
              </div>
              <div className="flex justify-between">
                <div className="flex items-center space-x-4">
                  <Pengiriman />
                  <p className="text-sm">Pengiriman</p>
                </div>
                {false && <Ceklis />}
              </div>
              <div className="flex justify-between">
                <div className="flex items-center space-x-4">
                  <Sampai />
                  <p className="text-sm">Sampai tujuan</p>
                </div>
                {false && <Ceklis />}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TrackOrder;
