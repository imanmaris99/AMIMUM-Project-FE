"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (profileData: ProfileData) => Promise<void>;
  initialData?: ProfileData;
}

export interface ProfileData {
  firstname: string;
  lastname: string;
  phone: string;
  address: string;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  initialData = {
    firstname: "",
    lastname: "",
    phone: "",
    address: ""
  }
}) => {
  const [formData, setFormData] = useState<ProfileData>(initialData);
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
    setFormData(initialData);
    setSubmitError(null);
  }, [initialData, isOpen]);

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (isSaving) {
      return;
    }

    if (!formData.firstname.trim() && !formData.lastname.trim()) {
      setSubmitError("Isi minimal nama depan atau nama belakang agar profil mudah dikenali.");
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
          : "Gagal menyimpan perubahan profil."
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[90] flex items-end justify-center bg-black/50 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
      <div className="max-h-[calc(100dvh-2rem)] w-full max-w-[392px] overflow-y-auto rounded-3xl bg-white shadow-2xl">
        {/* Modal Content */}
        <div className="space-y-4 p-4">
          {/* Header Section */}
          <div className="rounded-3xl bg-white p-4 shadow-[0_8px_22px_rgba(15,23,42,0.08)] ring-1 ring-emerald-50">
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
                  Akun customer
                </p>
                <h3 className="mt-1 text-lg font-bold text-[#0D0E09]">
                  Edit Profil Customer
                </h3>
              </div>
              
              {/* Divider Line */}
              <div className="h-[1.5px] w-full bg-[#F2F2F2]"></div>
              
              {/* Form Fields */}
              <div className="space-y-4">
                {submitError && (
                  <div className="rounded-lg bg-red-50 px-4 py-3 text-center">
                    <p className="text-sm text-red-600">{submitError}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-[#999999]">Nama depan</label>
                  </div>
                  <input
                    type="text"
                    value={formData.firstname}
                    onChange={(e) => handleInputChange('firstname', e.target.value)}
                    className="w-full rounded-2xl bg-emerald-50/60 px-3 py-3 text-sm text-[#0D0E09] outline-none placeholder-[#999999]"
                    placeholder="Masukkan nama depan"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-[#999999]">Nama belakang</label>
                  </div>
                  <input
                    type="text"
                    value={formData.lastname}
                    onChange={(e) => handleInputChange('lastname', e.target.value)}
                    className="w-full rounded-2xl bg-emerald-50/60 px-3 py-3 text-sm text-[#0D0E09] outline-none placeholder-[#999999]"
                    placeholder="Masukkan nama belakang"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-[#999999]">Nomor telepon</label>
                  </div>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full rounded-2xl bg-emerald-50/60 px-3 py-3 text-sm text-[#0D0E09] outline-none placeholder-[#999999]"
                    placeholder="Masukkan nomor telepon"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-[#999999]">Alamat profil</label>
                  </div>
                  <textarea
                    rows={2}
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="max-h-28 min-h-[88px] w-full resize-none rounded-2xl bg-emerald-50/60 px-3 py-3 text-sm text-[#0D0E09] outline-none placeholder-[#999999]"
                    placeholder="Tulis alamat profil bila ingin ditampilkan di akun"
                  />
                  <p className="text-xs leading-relaxed text-[#999999]">
                    Alamat pengiriman checkout tetap dikelola dari menu Alamat Pengiriman Tersimpan.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="sticky bottom-0 -mx-4 flex gap-3 bg-white/95 px-4 pb-1 pt-2 backdrop-blur">
            <button
              onClick={onClose}
              disabled={isSaving}
              className="flex-1 rounded-2xl border border-[#006A47] bg-white px-5 py-3 text-base font-medium text-[#006A47] transition-colors hover:bg-[#E6F2F0] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 rounded-2xl bg-[#006A47] px-5 py-3 text-base font-medium text-white transition-colors hover:bg-[#005A3C] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default EditProfileModal;
