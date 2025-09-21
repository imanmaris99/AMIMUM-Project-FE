"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useNotification } from "@/contexts/NotificationContext";

interface HeaderWithNotificationsProps {
  userEmail?: string;
  showLogo?: boolean;
  title?: string;
  subtitle?: string;
  onLogout?: () => void;
}

const HeaderWithNotifications = ({ 
  userEmail, 
  showLogo = true,
  title = "Selamat Datang",
  subtitle = "di Toko Herbal AmImUm",
  onLogout
}: HeaderWithNotificationsProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { cartItems, totalItems } = useCart();
  const { getNotificationCount, resetNotification } = useNotification();

  useEffect(() => {
    // Check if user is logged in - using the same logic as original header
    const checkAuth = () => {
      const loginStatus = localStorage.getItem('isLoggedIn');
      const email = localStorage.getItem('userEmail');
      
      if (loginStatus === 'true' && email) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    };

    checkAuth();
    
    // Listen for storage changes (login/logout from other tabs)
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const handleLogout = () => {
    // Use the same logout logic as original header
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    setIsLoggedIn(false);
    
    // Call parent's logout handler if provided
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <>
      <header className="bg-white px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Welcome Section */}
          <div className="flex flex-col justify-center gap-2">
            <div className="flex flex-col justify-center gap-2">
              {isLoggedIn ? (
                // Logged in state - only show welcome message
                <div>
                  <p>{title},</p>
                  <h4 className="font-bold text-2xl font-jakarta">
                    {userEmail || "User"}
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
                  <p>{title},</p>
                  <h4 className="font-bold text-2xl font-jakarta">
                    {subtitle} <span className="text-primary">AmImUm</span>
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

          {/* Logo - only show when not logged in and showLogo is true */}
          {!isLoggedIn && showLogo && (
            <div className="flex justify-center items-center gap-3">
              <Image src="/logo_toko.svg" alt="logo" width={100} height={125} priority />
            </div>
          )}

          {/* Icons Section - Only show when logged in */}
          {isLoggedIn && (
            <div className="flex items-center gap-4">
              {/* Cart Icon */}
              <Link 
                href="/cart" 
                className="relative"
                onClick={() => resetNotification("cart")}
              >
                <Image 
                  src="/bag-2.svg" 
                  alt="cart" 
                  width={32} 
                  height={32} 
                  className="hover:opacity-70 transition-opacity cursor-pointer"
                />
                {/* Cart Badge - Show notification count only */}
                {getNotificationCount("cart") > 0 && (
                  <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                    {getNotificationCount("cart") > 99 ? '99+' : getNotificationCount("cart")}
                  </div>
                )}
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
                {/* Notification Badge - Only show when there are notifications */}
                {/* You can add notification context here later to make it dynamic */}
                {/* For now, it will be hidden since there are no notifications */}
              </Link>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default HeaderWithNotifications;
