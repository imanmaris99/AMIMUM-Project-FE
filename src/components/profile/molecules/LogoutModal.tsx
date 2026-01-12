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
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-[375px] bg-white rounded-t-2xl shadow-2xl">
        {/* Modal Content */}
        <div className="p-6">
          {/* Header Section */}
          <div className="bg-white rounded-2xl shadow-lg p-4 mb-4">
            <div className="space-y-4">
              {/* Log Out Title */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-[#0D0E09]">Log Out</h3>
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
          <div className="flex gap-5">
            {/* Iya Button */}
            <button
              onClick={onConfirm}
              className="flex-1 bg-[#006A47] text-white text-sm font-medium py-3 px-6 rounded-[10px] hover:bg-[#005A3C] transition-colors"
            >
              Iya
            </button>
            
            {/* Tidak Button */}
            <button
              onClick={onClose}
              className="flex-1 bg-white text-[#005A3C] text-sm font-medium py-3 px-6 rounded-[10px] border border-[#005A3C] hover:bg-gray-50 transition-colors"
            >
              Tidak
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

export default LogoutModal;
