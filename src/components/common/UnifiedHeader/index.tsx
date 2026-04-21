"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { GoChevronLeft } from 'react-icons/go';
import { useNotification } from '@/contexts/NotificationContext';
import { SessionManager } from '@/lib/auth';
import { useHeaderSession } from '@/hooks/useHeaderSession';
import MainHeaderMobileMenu from './MainHeaderMobileMenu';
import MainHeaderUserMenu from './MainHeaderUserMenu';

export type HeaderType = 'main' | 'secondary' | 'auth';

interface UnifiedHeaderProps {
  type: HeaderType;
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  showCart?: boolean;
  showNotifications?: boolean;
  showSearch?: boolean;
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
  // showSearch: _showSearch = true,
  onBack,
  rightAction
}) => {
  const router = useRouter();
  const { getNotificationCount } = useNotification();
  const {
    isLoggedIn,
    userEmail,
    userDisplayName,
    userPhotoUrl,
    clearSessionState,
  } = useHeaderSession();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const cartNotificationCount = getNotificationCount("cart");
  const orderNotificationCount =
    getNotificationCount("tracking") + getNotificationCount("transaction");

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  const handleLogout = () => {
    // Use SessionManager to clear session
    SessionManager.clearSession();
    
    // Immediately update local state
    clearSessionState();
    setShowProfileDropdown(false);
    setShowMobileMenu(false);
    
    // Force trigger storage event for cross-tab synchronization
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'isLoggedIn',
      newValue: null,
      oldValue: 'true',
      storageArea: localStorage
    }));
    
    // Redirect to homepage
    router.push('/');
  };


  // Main Header (Homepage, Cart, Wishlist, etc.)
  if (type === 'main') {
    return (
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-3 sm:px-4 py-2 sm:py-3" suppressHydrationWarning={true}>
          <div className="flex items-center justify-between" suppressHydrationWarning={true}>
            {/* Left: Logo + Brand */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-shrink-0" suppressHydrationWarning={true}>
              <Image 
                src="/logo_toko.svg" 
                alt="AmImUm Logo" 
                width={32} 
                height={32}
                className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0"
              />
              <div className="min-w-0" suppressHydrationWarning>
                <h1 className="text-base sm:text-lg font-bold text-gray-900 truncate">AmImUm</h1>
                <p className="text-xs text-gray-500 hidden sm:block">Toko Herbal</p>
              </div>
            </div>

            {/* Center: Search (if enabled) - Removed to avoid redundancy with homepage Search component */}

            {/* Right: User Menu */}
            <div className="flex items-center gap-2" suppressHydrationWarning={true}>
              <div className="hidden sm:block" ref={profileDropdownRef}>
                <MainHeaderUserMenu
                  isLoggedIn={isLoggedIn}
                  showCart={showCart}
                  showNotifications={showNotifications}
                  showProfileDropdown={showProfileDropdown}
                  userDisplayName={userDisplayName}
                  userEmail={userEmail}
                  userPhotoUrl={userPhotoUrl}
                  cartNotificationCount={cartNotificationCount}
                  orderNotificationCount={orderNotificationCount}
                  onToggleProfileDropdown={() =>
                    setShowProfileDropdown(!showProfileDropdown)
                  }
                  onCloseProfileDropdown={() => setShowProfileDropdown(false)}
                  onLogout={handleLogout}
                />
              </div>

              <MainHeaderMobileMenu
                showMobileMenu={showMobileMenu}
                showCart={showCart}
                isLoggedIn={isLoggedIn}
                userEmail={userEmail}
                cartNotificationCount={cartNotificationCount}
                onToggleMobileMenu={() => setShowMobileMenu(!showMobileMenu)}
                onCloseMobileMenu={() => setShowMobileMenu(false)}
                onLogout={handleLogout}
              />
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
        <div className="px-3 sm:px-4 py-2 sm:py-3">
          <div className="flex items-center justify-between" suppressHydrationWarning={true}>
            {/* Left: Back Button */}
            {showBackButton && (
              <button
                onClick={handleBack}
                className="p-1 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
              >
                <GoChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
              </button>
            )}

            {/* Center: Title */}
            <div className="flex-1 text-center min-w-0 px-2">
              <h1 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{title}</h1>
              {subtitle && (
                <p className="text-xs sm:text-sm text-gray-500 mt-1 truncate">{subtitle}</p>
              )}
            </div>

            {/* Right: Action */}
            <div className="w-8 sm:w-10 flex-shrink-0">
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
