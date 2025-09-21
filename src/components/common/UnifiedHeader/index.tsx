"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GoChevronLeft } from 'react-icons/go';
import { HiOutlineShoppingBag, HiOutlineBell } from 'react-icons/hi';
import { useNotification } from '@/contexts/NotificationContext';

export type HeaderType = 'main' | 'secondary' | 'auth';

interface UnifiedHeaderProps {
  type: HeaderType;
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  showCart?: boolean;
  showNotifications?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

const UnifiedHeader: React.FC<UnifiedHeaderProps> = ({
  type,
  title = "AmImUm",
  subtitle,
  showBackButton = false,
  showCart = true,
  showNotifications = true,
  onBack,
  rightAction
}) => {
  const router = useRouter();
  const { getNotificationCount } = useNotification();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };


  // Main Header (Homepage, Cart, Wishlist, etc.)
  if (type === 'main') {
    return (
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left: Logo + Brand */}
            <div className="flex items-center gap-3">
              <Image 
                src="/logo_toko.svg" 
                alt="AmImUm Logo" 
                width={40} 
                height={40}
                className="w-10 h-10"
              />
              <div>
                <h1 className="text-lg font-bold text-gray-900">AmImUm</h1>
                <p className="text-xs text-gray-500">Toko Herbal</p>
              </div>
            </div>

            {/* Center: Search (if enabled) - Removed to avoid redundancy with homepage Search component */}

            {/* Right: Only Cart (no navbar redundancy) */}
            <div className="flex items-center gap-3">
              {showCart && (
                <Link href="/cart" className="relative">
                  <HiOutlineShoppingBag className="w-6 h-6 text-gray-700 hover:text-primary transition-colors" />
                  {getNotificationCount("cart") > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {getNotificationCount("cart") > 99 ? '99+' : getNotificationCount("cart")}
                    </span>
                  )}
                </Link>
              )}

              {/* Notifications (only for tracking + transaction, not wishlist) */}
              {showNotifications && (
                <Link href="/notifications" className="relative">
                  <HiOutlineBell className="w-6 h-6 text-gray-700 hover:text-primary transition-colors" />
                  {getNotificationCount("tracking") + getNotificationCount("transaction") > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {getNotificationCount("tracking") + getNotificationCount("transaction") > 99 ? '99+' : getNotificationCount("tracking") + getNotificationCount("transaction")}
                    </span>
                  )}
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>
    );
  }

  // Secondary Header (Track Order, Detail Product, etc.)
  if (type === 'secondary') {
    return (
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left: Back Button */}
            {showBackButton && (
              <button
                onClick={handleBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <GoChevronLeft className="w-6 h-6 text-gray-700" />
              </button>
            )}

            {/* Center: Title */}
            <div className="flex-1 text-center">
              <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
              {subtitle && (
                <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
              )}
            </div>

            {/* Right: Action */}
            <div className="w-10">
              {rightAction}
            </div>
          </div>
        </div>
      </header>
    );
  }

  // Auth Header (Login, Register, etc.)
  if (type === 'auth') {
    return (
      <header className="bg-gradient-to-r from-primary to-primary/80 text-white">
        <div className="px-4 py-6">
          <div className="flex flex-col items-center text-center">
            <Image 
              src="/logo_toko.svg" 
              alt="AmImUm Logo" 
              width={60} 
              height={60}
              className="w-15 h-15 mb-4"
            />
            <h1 className="text-2xl font-bold">Toko Herbal</h1>
            <h2 className="text-3xl font-bold">AmImUm</h2>
            <div className="w-20 h-1 bg-white/30 rounded-full mt-2"></div>
          </div>
        </div>
      </header>
    );
  }

  return null;
};

export default UnifiedHeader;
