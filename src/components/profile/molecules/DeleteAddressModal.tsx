"use client";

import React from "react";

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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
      <div className="w-full max-w-[375px] rounded-2xl bg-white shadow-2xl">
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

          <div className="flex gap-5">
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex-1 rounded-[10px] bg-[#C62828] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#A81F1F] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isDeleting ? "Menghapus..." : "Hapus"}
            </button>

            <button
              onClick={onClose}
              disabled={isDeleting}
              className="flex-1 rounded-[10px] border border-[#005A3C] bg-white px-6 py-3 text-sm font-medium text-[#005A3C] transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
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
