"use client";

import React, { useEffect } from "react";
import { createPortal } from "react-dom";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({ isOpen, onClose, onConfirm }) => {

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
  if (!isOpen || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[90] flex items-end justify-center bg-black/50 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
      <div className="max-h-[calc(100dvh-2rem)] w-full max-w-[392px] overflow-y-auto rounded-3xl bg-white shadow-2xl">
        {/* Modal Content */}
        <div className="p-4">
          {/* Header Section */}
          <div className="mb-4 rounded-3xl bg-white p-4 shadow-[0_8px_22px_rgba(15,23,42,0.08)] ring-1 ring-emerald-50">
            <div className="space-y-4">
              {/* Log Out Title */}
              <div className="text-center">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">Sesi akun</p>
                <h3 className="mt-1 text-lg font-bold text-[#0D0E09]">Keluar Akun</h3>
              </div>
              
              {/* Divider Line */}
              <div className="w-full h-[1.5px] bg-[#F2F2F2]"></div>
              
              {/* Confirmation Text */}
              <div className="pt-2">
                <p className="text-sm text-[#999999] leading-6">
                  Yakin ingin keluar dari akun di perangkat ini? Anda tetap bisa melihat katalog toko setelah keluar.
                </p>
              </div>
            </div>
          </div>

          {/* Button Section */}
          <div className="sticky bottom-0 -mx-4 flex gap-3 bg-white/95 px-4 pb-1 pt-2 backdrop-blur">
            {/* Iya Button */}
            <button
              onClick={onConfirm}
              className="flex-1 rounded-2xl bg-[#006A47] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#005A3C]"
            >
              Keluar
            </button>
            
            {/* Tidak Button */}
            <button
              onClick={onClose}
              className="flex-1 rounded-2xl border border-[#005A3C] bg-white px-5 py-3 text-sm font-medium text-[#005A3C] transition-colors hover:bg-gray-50"
            >
              Batal
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default LogoutModal;
