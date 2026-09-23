"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import LogoutModal from "../molecules/LogoutModal";
import { SessionManager } from "@/lib/auth";

const ProfileSettings: React.FC = () => {
  const router = useRouter();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLocationClick = () => {
    router.push("/saved-addresses");
  };

  const handleAdminClick = () => {
    toast("Kontak admin akan tersedia dari kanal resmi toko.");
  };

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const handleConfirmLogout = () => {
    // Use SessionManager to clear session
    SessionManager.clearSession();
    
    // Close modal first
    setIsLogoutModalOpen(false);
    
    // Force trigger storage event for cross-tab synchronization
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'isLoggedIn',
      newValue: null,
      oldValue: 'true',
      storageArea: localStorage
    }));
    
    // Show success message after a brief delay
    setTimeout(() => {
      toast.success("Berhasil keluar! Anda masih bisa menjelajahi toko.");
    }, 100);
    
    // Redirect to homepage
    router.push("/");
  };

  const handleCloseLogoutModal = () => {
    setIsLogoutModalOpen(false);
  };

  return (
    <div className="mx-4 mt-4 rounded-2xl bg-white p-4 sm:p-6">
      {/* Settings List */}
      <div className="space-y-2">
        {/* Location */}
        <div 
          className="-mx-2 flex cursor-pointer items-center justify-between rounded-lg px-2 py-3 transition-colors hover:bg-gray-50"
          onClick={handleLocationClick}
        >
          <div className="flex min-w-0 items-center gap-3">
            <Image
              src="/location.svg"
              alt="Location"
              width={20}
              height={20}
              className="text-[#007A4F]"
            />
            <div className="min-w-0">
              <span className="block text-sm font-medium text-[#0D0E09]">
                Alamat Pengiriman Tersimpan
              </span>
              <p className="text-xs leading-snug text-[#A2A2A2]">
                Kelola alamat tujuan valid untuk ongkir checkout
              </p>
            </div>
          </div>
          <Image
            src="/arrow-right.svg"
            alt="Arrow"
            width={24}
            height={24}
            className="shrink-0 text-[#292D32]"
          />
        </div>

        {/* Admin Contact */}
        <div 
          className="-mx-2 flex cursor-pointer items-center justify-between rounded-lg px-2 py-3 transition-colors hover:bg-gray-50"
          onClick={handleAdminClick}
        >
          <div className="flex min-w-0 items-center gap-3">
            <Image
              src="/call-calling.svg"
              alt="Call"
              width={20}
              height={20}
              className="text-[#007A4F]"
            />
            <div className="min-w-0">
              <span className="block text-sm font-medium text-[#0D0E09]">
                Kontak Admin
              </span>
              <p className="text-xs leading-snug text-[#A2A2A2]">
                Kanal resmi toko, tanpa nomor dummy
              </p>
            </div>
          </div>
          <Image
            src="/arrow-right.svg"
            alt="Arrow"
            width={24}
            height={24}
            className="shrink-0 text-[#292D32]"
          />
        </div>

        {/* Logout */}
        <div 
          className="-mx-2 flex cursor-pointer items-center justify-between rounded-lg px-2 py-3 transition-colors hover:bg-gray-50"
          onClick={handleLogoutClick}
        >
          <div className="flex min-w-0 items-center gap-3">
            <Image
              src="/logout.svg"
              alt="Logout"
              width={20}
              height={20}
              className="text-[#007A4F]"
            />
            <div className="min-w-0">
              <span className="block text-sm font-medium text-[#0D0E09]">
                Keluar Akun
              </span>
              <p className="text-xs leading-snug text-[#A2A2A2]">
                Menghapus sesi login dari perangkat ini
              </p>
            </div>
          </div>
          <Image
            src="/arrow-right.svg"
            alt="Arrow"
            width={24}
            height={24}
            className="shrink-0 text-[#292D32]"
          />
        </div>
      </div>

      {/* Logout Modal */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={handleCloseLogoutModal}
        onConfirm={handleConfirmLogout}
      />
    </div>
  );
};

export default ProfileSettings;
