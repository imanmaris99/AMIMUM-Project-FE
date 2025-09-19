"use client";

import { useState, useEffect } from "react";
import HeaderWithNotifications from "@/components/common/HeaderWithNotifications";

const Header = () => {
  const [userEmail, setUserEmail] = useState("");
  const [showLogoutMessage, setShowLogoutMessage] = useState(false);

  useEffect(() => {
    // Get user email from localStorage
    const email = localStorage.getItem('userEmail');
    setUserEmail(email || "");
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    
    // Show success message
    setShowLogoutMessage(true);
    setTimeout(() => {
      setShowLogoutMessage(false);
    }, 3000);
  };

  return (
    <>
      {/* Logout Success Message */}
      {showLogoutMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-bounce">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm font-medium">Berhasil keluar! Anda masih bisa menjelajahi toko.</span>
          </div>
        </div>
      )}

      <div className="mt-14">
        <HeaderWithNotifications 
          userEmail={userEmail}
          showLogo={true}
          title="Selamat Datang"
          subtitle="di Toko Herbal"
          onLogout={handleLogout}
        />
      </div>
    </>
  );
};

export default Header;
