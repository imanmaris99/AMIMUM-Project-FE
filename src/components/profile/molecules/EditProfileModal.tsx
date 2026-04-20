"use client";

import React, { useEffect, useState } from "react";

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-[375px] bg-white rounded-t-2xl shadow-2xl">
        {/* Modal Content */}
        <div className="p-6 space-y-5">
          {/* Header Section */}
          <div className="bg-white rounded-2xl shadow-lg p-4">
            <div className="space-y-6">
              {/* Edit Akunku Title */}
              <div className="flex items-center justify-center">
                <h3 className="text-lg font-medium text-[#0D0E09]">Edit Akunku</h3>
              </div>
              
              {/* Divider Line */}
              <div className="w-full h-[1.5px] bg-[#F2F2F2]"></div>
              
              {/* Form Fields */}
              <div className="space-y-6">
                {submitError && (
                  <div className="rounded-lg bg-red-50 px-4 py-3 text-center">
                    <p className="text-sm text-red-600">{submitError}</p>
                  </div>
                )}

                {/* Firstname Field */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-[#999999]">Firstname</label>
                  </div>
                  <input
                    type="text"
                    value={formData.firstname}
                    onChange={(e) => handleInputChange('firstname', e.target.value)}
                    className="w-full text-sm text-[#0D0E09] bg-transparent border-none outline-none placeholder-[#999999]"
                    placeholder="Masukkan nama depan"
                  />
                  <div className="w-full h-[1.5px] bg-[#F2F2F2]"></div>
                </div>

                {/* Lastname Field */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-[#999999]">Lastname</label>
                  </div>
                  <input
                    type="text"
                    value={formData.lastname}
                    onChange={(e) => handleInputChange('lastname', e.target.value)}
                    className="w-full text-sm text-[#0D0E09] bg-transparent border-none outline-none placeholder-[#999999]"
                    placeholder="Masukkan nama belakang"
                  />
                  <div className="w-full h-[1.5px] bg-[#F2F2F2]"></div>
                </div>

                {/* Phone Field */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-[#999999]">Phone</label>
                  </div>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full text-sm text-[#0D0E09] bg-transparent border-none outline-none placeholder-[#999999]"
                    placeholder="Masukkan nomor telepon"
                  />
                  <div className="w-full h-[1.5px] bg-[#F2F2F2]"></div>
                </div>

                {/* Address Field */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-[#999999]">Address</label>
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
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isSaving}
              className="flex-1 py-4 px-6 rounded-2xl text-lg font-medium bg-white text-[#006A47] border border-[#006A47] hover:bg-[#E6F2F0] transition-colors"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 py-4 px-6 rounded-2xl text-lg font-medium bg-[#006A47] text-white hover:bg-[#005A3C] transition-colors disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? "Menyimpan..." : "Save"}
            </button>
          </div>
        </div>

        {/* Home Indicator */}
        <div className="flex justify-center pb-4">
          <div className="w-[134px] h-[5px] bg-[#0D0E09] rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
