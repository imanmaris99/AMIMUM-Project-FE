import React from "react";
import { LuContact, LuPhone, LuMapPin } from "react-icons/lu";
import { Button } from "@/components/ui/button";

interface SenderFormProps {
  onSubmit: (event: React.FormEvent) => void;
}

const SenderForm: React.FC<SenderFormProps> = ({ onSubmit }) => {
  return (
    <form onSubmit={onSubmit} className="bg-gray-100 px-10 py-4 w-full flex flex-col gap-4">
      <div className="flex flex-col gap-2 relative">
        <label htmlFor="senderName" className="text-[14px] font-semibold">Nama Pengirim</label>
        <LuContact className="text-xl absolute left-2 top-9 stroke-1" />
        <input type="text" id="senderName" name="senderName" className="border border-gray-300 rounded-md outline-none px-2 py-1 bg-gray-200 pl-10" />
      </div>
      <div className="flex flex-col gap-2 relative">
        <label htmlFor="phoneNumber" className="text-[14px] font-semibold">Nomor Handphone</label>
        <LuPhone className="text-xl absolute left-2 top-9 stroke-1" />
        <input type="text" id="phoneNumber" name="phoneNumber" className="border border-gray-300 rounded-md outline-none px-2 py-1 bg-gray-200 pl-10" />
      </div>
      <div className="flex flex-col gap-2 relative">
        <label htmlFor="country" className="text-[14px] font-semibold">Negara</label>
        <LuMapPin className="text-xl absolute left-2 top-9 stroke-1" />
        <input type="text" id="country" name="country" className="border border-gray-300 rounded-md outline-none px-2 py-1 bg-gray-200 pl-10" />
      </div>
      <div className="flex flex-col gap-2 relative">
        <label htmlFor="province" className="text-[14px] font-semibold">Provinsi</label>
        <LuMapPin className="text-xl absolute left-2 top-9 stroke-1" />
        <input type="text" id="province" name="province" className="border border-gray-300 rounded-md outline-none px-2 py-1 bg-gray-200 pl-10" />
      </div>
      <div className="flex flex-col gap-2 relative">
        <label htmlFor="city" className="text-[14px] font-semibold">Kota/Kabupaten</label>
        <LuMapPin className="text-xl absolute left-2 top-9 stroke-1" />
        <input type="text" id="city" name="city" className="border border-gray-300 rounded-md outline-none px-2 py-1 bg-gray-200 pl-10" />
      </div>
      <div className="flex flex-col gap-2 relative">
        <label htmlFor="cityId" className="text-[14px] font-semibold">ID.Kota/Kabupaten</label>
        <LuMapPin className="text-xl absolute left-2 top-9 stroke-1" />
        <input type="text" id="cityId" name="cityId" className="border border-gray-300 rounded-md outline-none px-2 py-1 bg-gray-200 pl-10" />
      </div>
      <div className="flex flex-col gap-2 relative">
        <label htmlFor="postalCode" className="text-[14px] font-semibold">Kode Pos</label>
        <LuMapPin className="text-xl absolute left-2 top-9 stroke-1" />
        <input type="text" id="postalCode" name="postalCode" className="border border-gray-300 rounded-md outline-none px-2 py-1 bg-gray-200 pl-10" />
      </div>
      <div className="flex flex-col gap-2 relative">
        <label htmlFor="fullAddress" className="text-[14px] font-semibold">Alamat Lengkap</label>
        <LuMapPin className="text-xl absolute left-2 top-9 stroke-1" />
        <textarea id="fullAddress" name="fullAddress" className="border border-gray-300 rounded-md outline-none px-2 py-1 bg-gray-200 pl-10 min-h-[100px] resize-none" />
      </div>

      <div className="flex justify-center items-center mt-auto mb-10">
        <Button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg w-96 mt-10 h-14 text-lg">Selanjutnya</Button>
      </div>
    </form>
  );
};

export default SenderForm; 