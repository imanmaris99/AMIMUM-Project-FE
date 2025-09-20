"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { ProfileHeader } from "@/components/profile";
import { ProfileInfo } from "@/components/profile";
import { ProfileSettings } from "@/components/profile";
import LoginProtection from "@/components/common/LoginProtection";

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    // Check if user is logged in (simulate with localStorage)
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    const email = localStorage.getItem("userEmail") || "";
    
    setIsLoggedIn(loggedIn);
    setUserEmail(email);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    setIsLoggedIn(false);
    setUserEmail("");
    
    // Show success message using toast
    toast.success("Berhasil keluar! Anda masih bisa menjelajahi toko.");
  };

  return (
    <LoginProtection>
      <div className="h-screen bg-[#FAFAFA] overflow-hidden flex flex-col">
      {/* Header */}
      <ProfileHeader 
        isLoggedIn={isLoggedIn}
        userEmail={userEmail}
        onLogout={handleLogout}
      />

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Profile Info Section */}
        <ProfileInfo />

        {/* Divider Line */}
        <div className="w-full h-1 bg-[#E6F2F0]"></div>

        {/* Settings Section */}
        <ProfileSettings />
      </div>

      {/* Footer */}
      <footer className="flex-shrink-0 mb-20">
        <div className="flex justify-center items-center gap-1">
          <span className="text-xs font-bold text-black">©2025</span>
          <span className="text-xs text-gray-500">by</span>
          <span className="text-xs font-bold text-primary">Amimum Team.</span>
        </div>
      </footer>
    </div>
    </LoginProtection>
  );
};

export default ProfilePage;
