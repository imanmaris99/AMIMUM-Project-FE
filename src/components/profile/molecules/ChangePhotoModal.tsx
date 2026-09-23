"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

interface ChangePhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => Promise<void>;
}

const ChangePhotoModal: React.FC<ChangePhotoModalProps> = ({ isOpen, onClose, onUpload }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
      const maxSizeInBytes = 300 * 1024;

      if (!allowedTypes.includes(file.type)) {
        setSubmitError(
          "Format file tidak didukung. Gunakan png, jpeg, jpg, atau webp."
        );
        setSelectedFile(null);
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
        }
        setPreviewUrl(null);
        return;
      }

      if (file.size > maxSizeInBytes) {
        setSubmitError("Ukuran file melebihi 300 KB.");
        setSelectedFile(null);
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
        }
        setPreviewUrl(null);
        return;
      }

      setSubmitError(null);
      setSelectedFile(file);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || isUploading) {
      return;
    }

    setIsUploading(true);
    setSubmitError(null);

    try {
      await onUpload(selectedFile);
      handleClose();
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Gagal mengunggah foto profil."
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setSubmitError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/50 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
      <div className="max-h-[calc(100dvh-2rem)] w-full max-w-[392px] overflow-y-auto rounded-2xl bg-white shadow-2xl">
        {/* Modal Content */}
        <div className="space-y-4 p-4">
          {/* Header Section */}
          <div className="rounded-2xl bg-white p-4 shadow-lg">
            <div className="space-y-4">
              {/* Ganti Foto Title */}
              <div className="flex items-center justify-center">
                <h3 className="text-lg font-medium text-[#0D0E09]">Ganti Foto</h3>
              </div>
              
              {/* Divider Line */}
              <div className="w-full h-[1.5px] bg-[#F2F2F2]"></div>

              {submitError && (
                <div className="rounded-lg bg-red-50 px-4 py-3 text-center">
                  <p className="text-sm text-red-600">{submitError}</p>
                </div>
              )}
              
              {/* Upload Area */}
              <div className="bg-[#F8F8F8] rounded-lg p-4 relative">
                <div className="flex flex-col items-center space-y-3">
                  {/* Gallery Icon */}
                  <div className="w-6 h-6 flex items-center justify-center">
                    <Image
                      src="/gallery-export.svg"
                      alt="Gallery"
                      width={24}
                      height={24}
                      className="text-[#2D2D2D]"
                    />
                  </div>
                  
                  {/* Upload Text */}
                  <p className="text-sm text-[#999999] text-center">
                    Klik untuk mengunggah
                  </p>
                </div>
                
                {/* Hidden File Input */}
                <input
                  type="file"
                  accept=".png,.jpeg,.jpg,.webp,image/png,image/jpeg,image/webp"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>

              {/* Preview Image */}
              {previewUrl && (
                <div className="flex justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="h-[100px] w-[100px] rounded-lg object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="sticky bottom-0 -mx-4 flex gap-3 bg-white px-4 pb-1 pt-2">
            <button
              onClick={handleClose}
              disabled={isUploading}
              className="flex-1 rounded-2xl border border-[#006A47] bg-white px-5 py-3 text-base font-medium text-[#006A47] transition-colors hover:bg-[#E6F2F0] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Batal
            </button>
            <button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className={`flex-1 rounded-2xl px-5 py-3 text-base font-medium transition-colors ${
                selectedFile && !isUploading
                  ? "bg-[#006A47] text-white hover:bg-[#005A3C]" 
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {isUploading ? "Mengunggah..." : "Upload"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePhotoModal;
