import React from "react";
import BagIcon from "./BagIcon";
import PencilIcon from "./PencilIcon";

const AmbilDiToko = () => {
  return (
    <div className="w-[320px] mx-auto pt-7 text-[#242424] font-semibold mb-5">
      <div className="flex items-center space-x-2">
        <BagIcon />

        <h2>Bayar & Ambil di Toko</h2>
      </div>

      <hr className="bg-[#E5E5E5] h-[1px] w-full my-3" />

      <div className="my-2 p-2 bg-white rounded-lg leading-7">
        <h3 className="text-sm">Catatan Tambahan</h3>

        <div className="p-2 text-xs leading-5 bg-[#D9D9D9] rounded-md mt-2 bg-opacity-30">
          <p className="font-normal">
            Saya rencana mau ambil pesanan jam 3 sore ya
          </p>
        </div>

        <div className="grid grid-cols-4 space-x-3 mt-4">
          <div></div>
          <div></div>
          <button className="text-xs font-normal border border-[#A2A2A2] rounded-full flex items-center pl-2.5 space-x-1 py-1">
            <PencilIcon />

            <p>Edit</p>
          </button>
          <button className="text-xs font-normal border border-[#A2A2A2] rounded-full flex items-center pl-2.5 space-x-1 py-1">
            <p>Simpan</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AmbilDiToko;
