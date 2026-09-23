"use client";

import React, { useEffect } from 'react';
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

  if (!isOpen) return null;

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

  return (
    <div 
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]"
      onClick={onClose}
    >
      <div 
        className="max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto rounded-2xl bg-white shadow-2xl animate-in fade-in-0 zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            {featureInfo.icon}
            <h3 className="text-lg font-semibold text-gray-900">
              {featureInfo.title}
            </h3>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 text-sm leading-relaxed mb-6">
            {featureInfo.description}
          </p>

          {/* Benefits of logging in */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              Manfaat login:
            </h4>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Simpan produk ke wishlist</li>
              <li>• Lacak pesanan dan transaksi</li>
              <li>• Checkout lebih cepat</li>
              <li>• Riwayat pembelian lengkap</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleLogin();
              }}
              className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 rounded-lg transition-colors"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Masuk ke Akun
            </Button>
            
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleRegister();
              }}
              variant="outline"
              className="w-full border-primary text-primary hover:bg-primary hover:text-white font-medium py-3 rounded-lg transition-colors"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Buat Akun Baru
            </Button>

            {feature === 'wishlist' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleContinue();
                }}
                className="w-full text-gray-500 hover:text-gray-700 text-sm py-2 transition-colors"
              >
                Lanjutkan tanpa login
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 rounded-b-2xl">
          <p className="text-xs text-gray-500 text-center">
            Dengan login, Anda akan mendapatkan pengalaman berbelanja yang lebih baik
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginRequiredModal;
