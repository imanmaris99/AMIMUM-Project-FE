"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import TransactionList from "@/components/transaction/molecules/TransactionList";
import { Transaction } from "@/types/transaction";
import { useTransaction } from "@/contexts/TransactionContext";
import { toast } from "react-hot-toast";
import LoginProtection from "@/components/common/LoginProtection";

const TransactionPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [showLogoutMessage, setShowLogoutMessage] = useState(false);
  const { transactions, clearTransactions } = useTransaction();
  const totalTransactions = transactions.length;

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

  // Transactions are now managed by TransactionContext

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

  const handleViewDetails = (transactionId: string) => {
    console.log("View details for transaction:", transactionId);
    // Navigate to transaction details page
    window.location.href = `/transaction/${transactionId}`;
  };

  const handleClearTransactions = () => {
    if (transactions.length === 0) {
      toast.info('Tidak ada transaksi untuk dihapus');
      return;
    }

    if (window.confirm('Apakah Anda yakin ingin menghapus semua transaksi? Tindakan ini tidak dapat dibatalkan.')) {
      clearTransactions();
      toast.success('Semua transaksi berhasil dihapus');
    }
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

        {/* Transaction Content - Based on Figma Design */}
        <div className="px-6 flex-1 flex flex-col">
          {/* Riwayat Transaksi Header */}
          <div className="mb-10 mt-10">
            <div className="flex justify-between items-center">
              <h1 className="text-[#0D0E09] text-lg font-semibold">
                Riwayat Transaksi
              </h1>
              {transactions.length > 0 && (
                <button
                  onClick={handleClearTransactions}
                  className="text-red-500 text-sm font-medium hover:text-red-700 transition-colors"
                >
                  Hapus Semua
                </button>
              )}
            </div>
            {transactions.length > 0 && (
              <p className="text-gray-500 text-sm mt-1">
                {totalTransactions} transaksi ditemukan
              </p>
            )}
          </div>

          {/* Transaction List - Scrollable */}
          <div className="flex-1 overflow-y-auto">
            <TransactionList 
              transactions={transactions} 
              onViewDetails={handleViewDetails}
            />
          </div>
        </div>

        {/* Footer - Fixed at bottom */}
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

export default TransactionPage;
