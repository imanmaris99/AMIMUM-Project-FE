import React from "react";
import MapIcon from "./MapIcon";
import CourierIcon from "./CourierIcon";
import PencilIcon from "./PencilIcon";
import NoteIcon from "./NoteIcon";

const KirimKeTujuan = () => {
  return (
    <div className="w-[320px] mx-auto pt-7 text-[#242424] font-semibold mb-5">
      <div className="flex items-center space-x-2">
        <MapIcon />

        <h2>Alamat Pengiriman</h2>
      </div>

      <hr className="bg-[#E5E5E5] h-[1px] w-full my-3" />

      <h3 className="text-sm">Alamat pengirim</h3>

      <div className="p-2 text-xs leading-5">
        <h4>Pati, Jawa Tengah</h4>

        <p className="text-[#A2A2A2] font-normal">
          Jalan Silugonggo No. 15, Kelurahan Pati Wetan, Kecamatan Pati, Kota
          Pati, Kode Pos 59185, Jawa Tengah, Indonesia
        </p>
      </div>

      <h3 className="text-sm font-semibold">Alamat tujuan</h3>

      <div className="p-2 text-xs leading-5">
        <h4 className="font-semibold">Lengkapi alamat tujuanmu</h4>
        <p className="text-[#A2A2A2] font-normal">-</p>
      </div>

      <div className="flex items-center space-x-2 pt-4">
        <CourierIcon />

        <h2>Kurir</h2>
      </div>

      <hr className="bg-[#E5E5E5] h-[1px] w-full my-3" />

      <div className="my-2 p-2 bg-gray-50 rounded-lg leading-7">
        <h3 className="text-[15px]">Pilihan layanan</h3>

        <p className="text-[#A2A2A2] font-normal text-xs">Layanan - Estimasi</p>
      </div>

      <div className="grid grid-cols-2 space-x-2 mt-4">
        <button className="text-xs font-normal border border-[#A2A2A2] rounded-full flex items-center pl-3 space-x-1 py-1">
          <PencilIcon />

          <p>Lengkapi data</p>
        </button>

        <button className="text-xs font-normal border border-[#A2A2A2] rounded-full flex items-center pl-3 space-x-1 py-1">
          <NoteIcon />

          <p>Add Note</p>
        </button>
      </div>
    </div>
  );
};

export default KirimKeTujuan;
