"use client";

import React from "react";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/50 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
      <div className="max-h-[calc(100dvh-2rem)] w-full max-w-[392px] overflow-y-auto rounded-2xl bg-white shadow-2xl">
        {/* Modal Content */}
        <div className="p-4">
          {/* Header Section */}
          <div className="mb-4 rounded-2xl bg-white p-4 shadow-lg">
            <div className="space-y-4">
              {/* Log Out Title */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-[#0D0E09]">Keluar Akun</h3>
                <div className="w-4 h-4"></div>
              </div>
              
              {/* Divider Line */}
              <div className="w-full h-[1.5px] bg-[#F2F2F2]"></div>
              
              {/* Confirmation Text */}
              <div className="pt-2">
                <p className="text-sm text-[#999999] leading-6">
                  Apakah anda yakin ingin keluar?
                </p>
              </div>
            </div>
          </div>

          {/* Button Section */}
          <div className="sticky bottom-0 -mx-4 flex gap-3 bg-white px-4 pb-1 pt-2">
            {/* Iya Button */}
            <button
              onClick={onConfirm}
              className="flex-1 rounded-2xl bg-[#006A47] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#005A3C]"
            >
              Iya
            </button>
            
            {/* Tidak Button */}
            <button
              onClick={onClose}
              className="flex-1 rounded-2xl border border-[#005A3C] bg-white px-5 py-3 text-sm font-medium text-[#005A3C] transition-colors hover:bg-gray-50"
            >
              Tidak
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
