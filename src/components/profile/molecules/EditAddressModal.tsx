"use client";

import React, { useState, useEffect } from "react";
import { AddressFormData } from "./AddAddressModal";
import RajaOngkirLocationFields from "./RajaOngkirLocationFields";

interface EditAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (addressData: AddressFormData) => Promise<void>;
  initialData: AddressFormData;
}

const EditAddressModal: React.FC<EditAddressModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  initialData 
}) => {
  const [formData, setFormData] = useState(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const scrollY = window.scrollY;
    const previousBodyStyles = {
      position: document.body.style.position,
      top: document.body.style.top,
      left: document.body.style.left,
      right: document.body.style.right,
      width: document.body.style.width,
      overflow: document.body.style.overflow,
    };
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.documentElement.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.position = previousBodyStyles.position;
      document.body.style.top = previousBodyStyles.top;
      document.body.style.left = previousBodyStyles.left;
      document.body.style.right = previousBodyStyles.right;
      document.body.style.width = previousBodyStyles.width;
      document.body.style.overflow = previousBodyStyles.overflow;
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setFormData(initialData);
      setSubmitError(null);
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const hasRajaOngkirCity = Boolean(formData.cityId.trim());

  const handleSave = async () => {
    if (isSaving) {
      return;
    }

    setIsSaving(true);
    setSubmitError(null);

    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Gagal memperbarui alamat."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/50 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
      <div className="max-h-[calc(100dvh-2rem)] w-full max-w-[392px] overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="space-y-4 p-4">
          <div className="flex flex-col items-center justify-center gap-2">
            <h3 className="text-lg font-medium text-[#0D0E09]">Edit Alamat Pengiriman</h3>
            <p className="text-center text-xs text-[#666666]">
              Pastikan kota/kabupaten dipilih dari RajaOngkir sebelum dipakai checkout.
            </p>
          </div>
          
          {/* Divider Line */}
          <div className="w-full h-[1.5px] bg-[#F2F2F2] mt-4"></div>
          
          {/* Form Fields */}
          <div className="mt-4 space-y-4">
            {submitError && (
              <div className="rounded-lg bg-red-50 px-4 py-3 text-center">
                <p className="text-sm text-red-600">{submitError}</p>
              </div>
            )}

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
                placeholder="Tulis alamat lengkap tujuan pengiriman"
              />
              <div className="w-full h-[1.5px] bg-[#F2F2F2]"></div>
            </div>

            <RajaOngkirLocationFields
              value={{
                province: formData.province,
                city: formData.city,
                cityId: formData.cityId,
              }}
              onChange={(field, nextValue) => handleInputChange(field, nextValue)}
            />

            {!hasRajaOngkirCity && (
              <p className="rounded-lg bg-yellow-50 px-3 py-2 text-xs text-yellow-700">
                Pilih ulang kota/kabupaten dari RajaOngkir agar alamat ini siap dipakai checkout.
              </p>
            )}

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
        <div className="sticky bottom-0 bg-white px-4 pb-4 pt-2">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isSaving}
              className="flex-1 rounded-2xl border border-[#006A47] bg-white px-5 py-3 text-base font-medium text-[#006A47] transition-colors hover:bg-[#E6F2F0] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || !hasRajaOngkirCity}
              className="flex-1 rounded-2xl bg-[#006A47] px-5 py-3 text-base font-medium text-white transition-colors hover:bg-[#005A3C] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditAddressModal;
