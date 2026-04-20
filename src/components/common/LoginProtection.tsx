"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { SessionManager } from '@/lib/auth';
import LoginRequiredModal from './LoginRequiredModal';

interface LoginProtectionProps {
  children: React.ReactNode;
  redirectTo?: string;
  showMessage?: boolean;
  useModal?: boolean;
  feature?: 'profile' | 'transaction' | 'wishlist' | 'tracking' | 'general';
}

const LoginProtection: React.FC<LoginProtectionProps> = ({ 
  children, 
  redirectTo = '/login',
  showMessage = true,
  useModal = true,
  feature = 'general'
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkLoginStatus = () => {
      const isAuthenticated = SessionManager.isAuthenticated();
      
      if (isAuthenticated) {
        setIsLoggedIn(true);
        setShowLoginModal(false);
      } else {
        setIsLoggedIn(false);
        if (useModal) {
          setShowLoginModal(true);
        } else {
          if (showMessage) {
            toast.error('Silakan login terlebih dahulu untuk mengakses halaman ini');
          }
          router.replace(redirectTo);
        }
      }
    };

    checkLoginStatus();
    
    // Listen for storage changes (when user logs in from another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'isLoggedIn' || e.key === 'userEmail') {
        checkLoginStatus();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [router, redirectTo, showMessage, useModal]);

  // Show loading while checking login status
  if (isLoggedIn === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <span className="loader mb-4" aria-label="Memuat..." />
        <p className="text-gray-600 text-lg font-medium">Memuat halaman, mohon tunggu sebentar...</p>
      </div>
    );
  }

  // If not logged in and using modal, show modal and redirect to homepage
  if (!isLoggedIn && useModal) {
    return (
      <LoginRequiredModal
        isOpen={showLoginModal}
        onClose={() => {
          // When modal is closed, redirect to homepage
          router.push('/');
        }}
        feature={feature}
        title={`Login Diperlukan untuk ${feature === 'profile' ? 'Profil' : feature === 'transaction' ? 'Transaksi' : feature === 'wishlist' ? 'Wishlist' : feature === 'tracking' ? 'Tracking' : 'Fitur Ini'}`}
        description={`Silakan login terlebih dahulu untuk mengakses ${feature === 'profile' ? 'dan mengelola profil akun Anda' : feature === 'transaction' ? 'riwayat transaksi dan detail pembelian Anda' : feature === 'wishlist' ? 'daftar produk favorit Anda' : feature === 'tracking' ? 'status pesanan dan pengiriman Anda' : 'fitur ini'}.`}
        redirectAfterLogin={window.location.pathname}
      />
    );
  }

  // If not logged in and not using modal, don't render children (redirect will happen)
  if (!isLoggedIn) {
    return null;
  }

  // If logged in, render children
  return <>{children}</>;
};

export default LoginProtection;
