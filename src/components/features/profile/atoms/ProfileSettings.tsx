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
    // Handle admin contact
    console.log("Contact admin");
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
    <div className="bg-white rounded-2xl mx-4 mt-4 p-6">
      {/* Settings List */}
      <div className="space-y-4">
        {/* Location */}
        <div 
          className="flex items-center justify-between py-3 cursor-pointer hover:bg-gray-50 rounded-lg px-2 -mx-2 transition-colors"
          onClick={handleLocationClick}
        >
          <div className="flex items-center gap-4">
            <Image
              src="/location.svg"
              alt="Location"
              width={20}
              height={20}
              className="text-[#007A4F]"
            />
            <span className="text-sm font-medium text-[#0D0E09]">
              Alamat pengiriman tersimpan
            </span>
          </div>
          <Image
            src="/arrow-right.svg"
            alt="Arrow"
            width={24}
            height={24}
            className="text-[#292D32]"
          />
        </div>

        {/* Admin Contact */}
        <div 
          className="flex items-center justify-between py-3 cursor-pointer hover:bg-gray-50 rounded-lg px-2 -mx-2 transition-colors"
          onClick={handleAdminClick}
        >
          <div className="flex items-center gap-4">
            <Image
              src="/call-calling.svg"
              alt="Call"
              width={20}
              height={20}
              className="text-[#007A4F]"
            />
            <span className="text-sm font-medium text-[#0D0E09]">
              Kontak admin
            </span>
          </div>
          <Image
            src="/arrow-right.svg"
            alt="Arrow"
            width={24}
            height={24}
            className="text-[#292D32]"
          />
        </div>

        {/* Logout */}
        <div 
          className="flex items-center justify-between py-3 cursor-pointer hover:bg-gray-50 rounded-lg px-2 -mx-2 transition-colors"
          onClick={handleLogoutClick}
        >
          <div className="flex items-center gap-4">
            <Image
              src="/logout.svg"
              alt="Logout"
              width={20}
              height={20}
              className="text-[#007A4F]"
            />
            <span className="text-sm font-medium text-[#0D0E09]">
              Log out
            </span>
          </div>
          <Image
            src="/arrow-right.svg"
            alt="Arrow"
            width={24}
            height={24}
            className="text-[#292D32]"
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
