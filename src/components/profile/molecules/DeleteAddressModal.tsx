"use client";

import React, { useEffect } from "react";

interface DeleteAddressModalProps {
  isOpen: boolean;
  addressName: string;
  isDeleting?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteAddressModal: React.FC<DeleteAddressModalProps> = ({
  isOpen,
  addressName,
  isDeleting = false,
  onClose,
  onConfirm,
}) => {

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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
      <div className="max-h-[calc(100dvh-2rem)] w-full max-w-[392px] overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="p-6">
          <div className="mb-4 rounded-2xl bg-white p-4 shadow-lg">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-[#0D0E09]">
                  Hapus Alamat
                </h3>
                <div className="h-4 w-4" />
              </div>

              <div className="h-[1.5px] w-full bg-[#F2F2F2]" />

              <div className="pt-2">
                <p className="text-sm leading-6 text-[#999999]">
                  Apakah Anda yakin ingin menghapus alamat
                  {" "}
                  <span className="font-medium text-[#313131]">
                    {addressName || "ini"}
                  </span>
                  ?
                </p>
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 -mx-6 flex gap-3 bg-white px-6 pb-1 pt-2">
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex-1 rounded-2xl bg-[#C62828] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#A81F1F] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isDeleting ? "Menghapus..." : "Hapus"}
            </button>

            <button
              onClick={onClose}
              disabled={isDeleting}
              className="flex-1 rounded-2xl border border-[#005A3C] bg-white px-5 py-3 text-sm font-medium text-[#005A3C] transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Batal
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DeleteAddressModal;
