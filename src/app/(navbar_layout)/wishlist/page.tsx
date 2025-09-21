"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { HiOutlineTrash } from "react-icons/hi";
import { Button } from "@/components/ui/button";
import WishlistList from "@/components/wishlist/molecules/WishlistList";
import { WishlistItem } from "@/types/wishlist";
import { useWishlist } from "@/contexts/WishlistContext";
import LoginProtection from "@/components/common/LoginProtection";
import { toast } from "react-hot-toast";

const Wishlist = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [showLogoutMessage, setShowLogoutMessage] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { wishlistItems, removeFromWishlist, clearAll } = useWishlist();
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    // Check if user is logged in (dummy implementation)
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

  // Update total items when wishlist changes
  useEffect(() => {
    setTotalItems(wishlistItems.length);
  }, [wishlistItems]);

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

  const handleRemoveItem = (itemId: string) => {
    // This function is now handled by the context
    // We keep it for backward compatibility with WishlistList
  };

  const handleClearAll = () => {
    if (wishlistItems.length === 0) {
      toast.error("Wishlist sudah kosong");
      return;
    }
    setShowConfirmDialog(true);
  };

  const confirmClearAll = () => {
    clearAll();
    setShowConfirmDialog(false);
    toast.success("Semua item telah dihapus dari wishlist");
  };

  const cancelClearAll = () => {
    setShowConfirmDialog(false);
  };

  return (
    <LoginProtection>
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

      <div className="h-screen bg-white overflow-hidden flex flex-col">
        {/* Header - Same as homepage when logged in */}
        <header className="flex-shrink-0">
          <div className="flex justify-between items-center pt-14 pb-4 mx-6">
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
                  {/* Cart Badge - Dynamic count */}
                  {/* You can add cart context here later to make it dynamic */}
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
                </Link>
              </div>
            )}
          </div>
        </header>

        {/* Wishlist Content - Based on Figma Design */}
        <div className="px-6 flex-1 flex flex-col">
          {/* Produk Idamanku Header */}
          <div className="mb-4 mt-10">
            <h1 className="text-[#0D0E09] text-lg font-semibold mb-4">
              Produk Idamanku
            </h1>
            
            {/* Total Produk Info */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <span className="text-[#999999] text-sm">
                  Total Produk Idaman :
                </span>
                <span className="text-[#0D0E09] text-sm font-bold">
                  {totalItems} Produk
                </span>
              </div>
              {totalItems > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearAll}
                  className="flex items-center gap-1 text-red-600 border-red-200 hover:bg-red-50"
                >
                  <HiOutlineTrash size={16} />
                  <span className="text-xs">Hapus Semua</span>
                </Button>
              )}
            </div>
          </div>

          {/* Wishlist Items - Scrollable */}
          <div className="flex-1 overflow-y-auto">
            <WishlistList 
              items={wishlistItems} 
              onRemoveItem={handleRemoveItem}
            />
          </div>
        </div>

        {/* Footer - Fixed at bottom */}
        <footer className="flex-shrink-0 mb-20
        ">
          <div className="flex justify-center items-center gap-1">
            <span className="text-xs font-bold text-black">©2025</span>
            <span className="text-xs text-gray-500">by</span>
            <span className="text-xs font-bold text-primary">Amimum Team.</span>
          </div>
        </footer>

        {/* Confirmation Dialog */}
        {showConfirmDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 mx-4 max-w-sm w-full">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <HiOutlineTrash className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Hapus Semua Item?
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  Anda yakin ingin menghapus semua item dari wishlist? Tindakan ini tidak dapat dibatalkan.
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={cancelClearAll}
                    className="flex-1"
                  >
                    Batal
                  </Button>
                  <Button
                    onClick={confirmClearAll}
                    className="flex-1 bg-red-600 hover:bg-red-700"
                  >
                    Hapus Semua
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </LoginProtection>
  );
};

export default Wishlist;

