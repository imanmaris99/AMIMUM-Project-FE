"use client";

import React, { useState, useEffect } from "react";

interface EditAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (addressData: {
    name: string;
    phone: string;
    address: string;
    city: string;
    province: string;
    country: string;
    postalCode: string;
  }) => void;
  initialData: {
    name: string;
    phone: string;
    address: string;
    city: string;
    province: string;
    country: string;
    postalCode: string;
  };
}

const EditAddressModal: React.FC<EditAddressModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  initialData 
}) => {
  const [formData, setFormData] = useState(initialData);

  useEffect(() => {
    if (isOpen) {
      setFormData(initialData);
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-[375px] bg-white rounded-t-2xl shadow-2xl">
        <div className="p-6">
          <div className="flex flex-col items-center justify-center gap-2">
            <h3 className="text-lg font-medium text-[#0D0E09]">Edit Alamat</h3>
          </div>
          
          {/* Divider Line */}
          <div className="w-full h-[1.5px] bg-[#F2F2F2] mt-4"></div>
          
          {/* Form Fields */}
          <div className="space-y-6 mt-6">
            {/* Nama Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm text-[#999999]">Nama</label>
              </div>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full text-sm text-[#0D0E09] bg-transparent border-none outline-none placeholder-[#999999]"
                placeholder="Masukkan nama"
              />
              <div className="w-full h-[1.5px] bg-[#F2F2F2]"></div>
            </div>

            {/* No. Handphone Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm text-[#999999]">No. Handphone</label>
              </div>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full text-sm text-[#0D0E09] bg-transparent border-none outline-none placeholder-[#999999]"
                placeholder="Masukkan nomor handphone"
              />
              <div className="w-full h-[1.5px] bg-[#F2F2F2]"></div>
            </div>

            {/* Alamat Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm text-[#999999]">Alamat</label>
              </div>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="w-full text-sm text-[#0D0E09] bg-transparent border-none outline-none placeholder-[#999999]"
                placeholder="Masukkan alamat"
              />
              <div className="w-full h-[1.5px] bg-[#F2F2F2]"></div>
            </div>

            {/* Kota Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm text-[#999999]">Kota</label>
              </div>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className="w-full text-sm text-[#0D0E09] bg-transparent border-none outline-none placeholder-[#999999]"
                placeholder="Masukkan kota"
              />
              <div className="w-full h-[1.5px] bg-[#F2F2F2]"></div>
            </div>

            {/* Provinsi Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm text-[#999999]">Provinsi</label>
              </div>
              <input
                type="text"
                value={formData.province}
                onChange={(e) => handleInputChange('province', e.target.value)}
                className="w-full text-sm text-[#0D0E09] bg-transparent border-none outline-none placeholder-[#999999]"
                placeholder="Masukkan provinsi"
              />
              <div className="w-full h-[1.5px] bg-[#F2F2F2]"></div>
            </div>

            {/* Negara Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm text-[#999999]">Negara</label>
              </div>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                className="w-full text-sm text-[#0D0E09] bg-transparent border-none outline-none placeholder-[#999999]"
                placeholder="Masukkan negara"
              />
              <div className="w-full h-[1.5px] bg-[#F2F2F2]"></div>
            </div>

            {/* Kode Pos Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm text-[#999999]">Kode Pos</label>
              </div>
              <input
                type="text"
                value={formData.postalCode}
                onChange={(e) => handleInputChange('postalCode', e.target.value)}
                className="w-full text-sm text-[#0D0E09] bg-transparent border-none outline-none placeholder-[#999999]"
                placeholder="Masukkan kode pos"
              />
              <div className="w-full h-[1.5px] bg-[#F2F2F2]"></div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-6 pb-6">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-4 px-6 rounded-2xl text-lg font-medium bg-white text-[#006A47] border border-[#006A47] hover:bg-[#E6F2F0] transition-colors"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-4 px-6 rounded-2xl text-lg font-medium bg-[#006A47] text-white hover:bg-[#005A3C] transition-colors"
            >
              Save
            </button>
          </div>
        </div>

        {/* Home Indicator */}
        <div className="flex justify-center items-center h-9 bg-white">
          <div className="w-36 h-1.5 bg-[#0D0E09] rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default EditAddressModal;
