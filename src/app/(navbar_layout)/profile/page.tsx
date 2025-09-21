"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { ProfileInfo } from "@/components/profile";
import { ProfileSettings } from "@/components/profile";
import LoginProtection from "@/components/common/LoginProtection";
import UnifiedHeader from "@/components/common/UnifiedHeader";

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    // Get user email from localStorage
    const email = localStorage.getItem("userEmail") || "";
    setUserEmail(email);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    setUserEmail("");
    
    // Show success message using toast
    toast.success("Berhasil keluar! Anda masih bisa menjelajahi toko.");
  };

  return (
    <LoginProtection>
      <div className="min-h-screen bg-[#FAFAFA]">
        {/* Unified Header */}
        <UnifiedHeader 
          type="main"
          showSearch={false}
          showCart={true}
          showNotifications={true}
        />

        {/* Content */}
        <div className="py-4">
          {/* Profile Info Section */}
          <ProfileInfo />

          {/* Divider Line */}
          <div className="w-full h-1 bg-[#E6F2F0]"></div>

          {/* Settings Section */}
          <ProfileSettings />
        </div>
      </div>
    </LoginProtection>
  );
};

export default ProfilePage;
