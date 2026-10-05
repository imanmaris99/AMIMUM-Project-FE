"use client";

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { X, LogIn, UserPlus, ShoppingBag, Heart, FileText, Truck } from 'lucide-react';

interface LoginRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature?: 'checkout' | 'wishlist' | 'profile' | 'transaction' | 'tracking' | 'general';
  title?: string;
  description?: string;
  redirectAfterLogin?: string;
}

const LoginRequiredModal: React.FC<LoginRequiredModalProps> = ({
  isOpen,
  onClose,
  feature = 'general',
  title,
  description,
  redirectAfterLogin
}) => {
  const router = useRouter();
  const [isMounted, setIsMounted] = React.useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const scrollY = window.scrollY;
    const previousBodyStyles = {
      position: document.body.style.position,
      top: document.body.style.top,
      left: document.body.style.left,
      right: document.body.style.right,
      width: document.body.style.width,
      overflow: document.body.style.overflow,
    };
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.documentElement.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.position = previousBodyStyles.position;
      document.body.style.top = previousBodyStyles.top;
      document.body.style.left = previousBodyStyles.left;
      document.body.style.right = previousBodyStyles.right;
      document.body.style.width = previousBodyStyles.width;
      document.body.style.overflow = previousBodyStyles.overflow;
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  if (!isOpen || !isMounted) return null;

  const getFeatureInfo = () => {
    switch (feature) {
      case 'checkout':
        return {
          icon: <ShoppingBag className="w-8 h-8 text-primary" />,
          title: title || "Login Diperlukan",
          description: description || "Silakan login terlebih dahulu untuk melanjutkan checkout dan menyelesaikan pembelian Anda.",
          actionText: "Lanjutkan Checkout"
        };
      case 'wishlist':
        return {
          icon: <Heart className="w-8 h-8 text-red-500" />,
          title: title || "Simpan ke Wishlist",
          description: description || "Login untuk menyimpan produk ke wishlist dan mengakses daftar produk favorit Anda.",
          actionText: "Simpan ke Wishlist"
        };
      case 'profile':
        return {
          icon: <UserPlus className="w-8 h-8 text-blue-500" />,
          title: title || "Akses Profil",
          description: description || "Login untuk mengakses dan mengelola profil akun Anda.",
          actionText: "Kelola Profil"
        };
      case 'transaction':
        return {
          icon: <FileText className="w-8 h-8 text-green-500" />,
          title: title || "Riwayat Transaksi",
          description: description || "Login untuk melihat riwayat transaksi dan detail pembelian Anda.",
          actionText: "Lihat Transaksi"
        };
      case 'tracking':
        return {
          icon: <Truck className="w-8 h-8 text-orange-500" />,
          title: title || "Tracking Pesanan",
          description: description || "Login untuk melacak status pesanan dan pengiriman Anda.",
          actionText: "Lacak Pesanan"
        };
      default:
        return {
          icon: <LogIn className="w-8 h-8 text-primary" />,
          title: title || "Login Diperlukan",
          description: description || "Silakan login terlebih dahulu untuk mengakses fitur ini.",
          actionText: "Akses Fitur"
        };
    }
  };

  const featureInfo = getFeatureInfo();

  const handleLogin = () => {
    onClose();
    // Store the redirect URL in sessionStorage for after login
    if (redirectAfterLogin) {
      sessionStorage.setItem('redirectAfterLogin', redirectAfterLogin);
    }
    router.push('/login');
  };

  const handleRegister = () => {
    onClose();
    // Store the redirect URL in sessionStorage for after register
    if (redirectAfterLogin) {
      sessionStorage.setItem('redirectAfterLogin', redirectAfterLogin);
    }
    router.push('/register');
  };

  const handleContinue = () => {
    onClose();
    // User chooses to continue without login
    // This could be used for features that don't strictly require login
  };

  const modalContent = (
    <div 
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 px-4 py-[calc(1rem+env(safe-area-inset-bottom))] backdrop-blur-[1px]"
      onClick={onClose}
    >
      <div 
        className="flex max-h-[calc(100dvh-2rem)] w-full max-w-sm flex-col overflow-hidden rounded-3xl bg-white shadow-2xl animate-in fade-in-0 zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-required-title"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-gray-100 p-5">
          <div className="flex min-w-0 items-start gap-3">
            <div className="shrink-0">
              {featureInfo.icon}
            </div>
            <h3 id="login-required-title" className="text-lg font-semibold leading-6 text-gray-900">
              {featureInfo.title}
            </h3>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="shrink-0 rounded-full p-2 transition-colors hover:bg-gray-100"
            aria-label="Tutup popup login"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          <p className="mb-4 text-sm leading-relaxed text-gray-600">
            {featureInfo.description}
          </p>

          {/* Benefits of logging in */}
          <div className="mb-4 rounded-2xl bg-gray-50 p-4">
            <h4 className="mb-2 text-sm font-medium text-gray-900">
              Manfaat login:
            </h4>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Simpan produk ke wishlist</li>
              <li>• Lacak pesanan dan transaksi</li>
              <li>• Checkout lebih cepat</li>
              <li>• Riwayat pembelian lengkap</li>
            </ul>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="shrink-0 border-t border-gray-100 bg-white px-5 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-4">
          <div className="space-y-3">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleLogin();
              }}
              className="w-full rounded-2xl bg-primary py-3 font-medium text-white transition-colors hover:bg-primary/90"
            >
              <LogIn className="mr-2 h-4 w-4" />
              Masuk ke Akun
            </Button>
            
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleRegister();
              }}
              variant="outline"
              className="w-full rounded-2xl border-primary py-3 font-medium text-primary transition-colors hover:bg-primary hover:text-white"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Buat Akun Baru
            </Button>

            {feature === 'wishlist' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleContinue();
                }}
                className="w-full py-2 text-sm text-gray-500 transition-colors hover:text-gray-700"
              >
                Lanjutkan tanpa login
              </button>
            )}
          </div>
          <p className="mt-3 text-center text-xs text-gray-500">
            Dengan login, Anda akan mendapatkan pengalaman berbelanja yang lebih baik
          </p>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default LoginRequiredModal;
