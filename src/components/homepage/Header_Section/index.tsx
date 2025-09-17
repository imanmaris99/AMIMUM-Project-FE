"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [showLogoutMessage, setShowLogoutMessage] = useState(false);

  useEffect(() => {
    // Check if user is logged in (dummy implementation)
    // In real app, this would check localStorage, cookies, or API
    const checkLoginStatus = () => {
      const loginStatus = localStorage.getItem('isLoggedIn');
      const email = localStorage.getItem('userEmail');
      
      if (loginStatus === 'true' && email) {
        setIsLoggedIn(true);
        setUserEmail(email);
      }
    };

    checkLoginStatus();
    
    // Listen for storage changes (when user logs in from another tab)
    window.addEventListener('storage', checkLoginStatus);
    
    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    setIsLoggedIn(false);
    setUserEmail("");
    
    // Show success message
    setShowLogoutMessage(true);
    setTimeout(() => {
      setShowLogoutMessage(false);
    }, 3000);
    
    // Stay on homepage - no redirect needed
    // Homepage is accessible without login
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

      <header>
        <div className="flex justify-between items-center mt-14 mx-6">
          <div className="flex flex-col justify-center gap-2">
            <div className="flex flex-col justify-center gap-2">
              {isLoggedIn ? (
                // Logged in state - only show welcome message
                <div>
                  <p>Selamat Datang,</p>
                  <h4 className="font-bold text-2xl font-jakarta">
                    {userEmail}
                  </h4>
                  <div className="w-full mt-4">
                    <Button 
                      variant="outline" 
                      className="w-1/2 text-primary border-primary hover:bg-primary hover:text-white"
                      onClick={handleLogout}
                    >
                      Keluar
                    </Button>
                  </div>
                </div>
              ) : (
                // Not logged in state - show full welcome message
                <div>
                  <p>Selamat Datang,</p>
                  <h4 className="font-bold text-2xl font-jakarta">
                    di Toko Herbal <span className="text-primary">AmImUm</span>
                  </h4>
                  <div className="w-full mt-4">
                    <Link href="/login">
                      <Button variant="secondary" className="w-1/2 text-primary bg-customGreen4 hover:bg-primary hover:text-white">
                        Silahkan masuk
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Logo - only show when not logged in */}
          {!isLoggedIn && (
            <div className="flex justify-center items-center gap-3">
              <Image src="/logo_toko.svg" alt="logo" width={100} height={125} priority />
            </div>
          )}

          {/* Icons Section - Only show when logged in */}
          {isLoggedIn && (
            <div className="flex items-center gap-4">
              {/* Cart Icon */}
              <Link href="/cart" className="relative">
                <Image 
                  src="/bag-2.svg" 
                  alt="cart" 
                  width={32} 
                  height={32} 
                  className="hover:opacity-70 transition-opacity cursor-pointer"
                />
                {/* Cart Badge */}
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                  2
                </div>
              </Link>

              {/* Notification Icon */}
              <Link href="/notifications" className="relative">
                <Image 
                  src="/notification.svg" 
                  alt="notification" 
                  width={32} 
                  height={32} 
                  className="hover:opacity-70 transition-opacity cursor-pointer"
                />
                {/* Notification Badge */}
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                  3
                </div>
              </Link>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;
