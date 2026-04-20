"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GoChevronLeft } from 'react-icons/go';
import { HiOutlineShoppingBag, HiOutlineBell, HiOutlineUser, HiOutlineMenu, HiOutlineX, HiOutlineLogout, HiOutlineCog } from 'react-icons/hi';
import { useNotification } from '@/contexts/NotificationContext';
import { SessionManager } from '@/lib/auth';

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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userDisplayName, setUserDisplayName] = useState("");
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if user is logged in using SessionManager
    const checkAuth = () => {
      const isAuthenticated = SessionManager.isAuthenticated();
      setIsLoggedIn(isAuthenticated);
      
      if (isAuthenticated) {
        const session = SessionManager.getSession();
        const email = session?.user?.email || "";
        const firstname = session?.user?.firstname?.trim();
        const derivedName = session?.user?.name?.trim() || (email ? email.split('@')[0] : "");

        setUserEmail(email);
        setUserDisplayName(firstname || derivedName);
      } else {
        setUserEmail("");
        setUserDisplayName("");
      }
    };

    checkAuth();
    
    // Listen for storage changes (login/logout from other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'isLoggedIn' || e.key === 'userEmail') {
        checkAuth();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

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
    setIsLoggedIn(false);
    setUserEmail("");
    setUserDisplayName("");
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
              {/* User Menu */}
              {isLoggedIn ? (
                <div className="relative" ref={profileDropdownRef}>
                  {/* Profile Button */}
                  <button
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    suppressHydrationWarning={true}
                  >
                    {/* Username */}
                    <span className="hidden md:block text-sm text-gray-700 max-w-20 truncate">
                      {userDisplayName}
                    </span>
                    
                    {/* Profile Avatar with Notification Badge */}
                    <div className="relative">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {(userDisplayName.charAt(0) || userEmail.charAt(0)).toUpperCase()}
                        </span>
                      </div>
                      {/* Combined notification badge on avatar */}
                      {(getNotificationCount("cart") > 0 || getNotificationCount("tracking") + getNotificationCount("transaction") > 0) && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {getNotificationCount("cart") + getNotificationCount("tracking") + getNotificationCount("transaction") > 99 ? '99+' : getNotificationCount("cart") + getNotificationCount("tracking") + getNotificationCount("transaction")}
                        </span>
                      )}
                    </div>
                  </button>

                  {/* Profile Dropdown */}
                  {showProfileDropdown && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{userEmail}</p>
                        <p className="text-xs text-gray-500">Terakhir login</p>
                      </div>
                      
                      {/* Cart in Dropdown */}
                      {showCart && (
                        <Link
                          href="/cart"
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => setShowProfileDropdown(false)}
                        >
                          <div className="relative">
                            <HiOutlineShoppingBag className="w-4 h-4" />
                            {getNotificationCount("cart") > 0 && (
                              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                {getNotificationCount("cart") > 99 ? '99+' : getNotificationCount("cart")}
                              </span>
                            )}
                          </div>
                          <span>Keranjang</span>
                        </Link>
                      )}

                      {/* Notifications in Dropdown */}
                      {showNotifications && (
                        <Link
                          href="/notifications"
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => setShowProfileDropdown(false)}
                        >
                          <div className="relative">
                            <HiOutlineBell className="w-4 h-4" />
                            {getNotificationCount("tracking") + getNotificationCount("transaction") > 0 && (
                              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                {getNotificationCount("tracking") + getNotificationCount("transaction") > 99 ? '99+' : getNotificationCount("tracking") + getNotificationCount("transaction")}
                              </span>
                            )}
                          </div>
                          <span>Notifikasi</span>
                        </Link>
                      )}
                      
                      <Link
                        href="/profile"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setShowProfileDropdown(false)}
                      >
                        <HiOutlineUser className="w-4 h-4" />
                        Profil Saya
                      </Link>
                      
                      <Link
                        href="/transaction"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setShowProfileDropdown(false)}
                      >
                        <HiOutlineCog className="w-4 h-4" />
                        Transaksi
                      </Link>
                      
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                      >
                        <HiOutlineLogout className="w-4 h-4" />
                        Keluar
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2" suppressHydrationWarning={true}>
                  <Link
                    href="/login"
                    className="text-sm text-primary hover:text-primary/80 transition-colors px-3 py-2 rounded-lg"
                  >
                    Masuk
                  </Link>
                  <Link
                    href="/register"
                    className="text-sm bg-primary text-white hover:bg-primary/90 transition-colors px-4 py-2 rounded-lg"
                  >
                    Daftar
                  </Link>
                </div>
              )}

              {/* Mobile Hamburger Menu */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="sm:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {showMobileMenu ? (
                  <HiOutlineX className="w-6 h-6 text-gray-700" />
                ) : (
                  <HiOutlineMenu className="w-6 h-6 text-gray-700" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {showMobileMenu && (
          <div className="sm:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setShowMobileMenu(false)}>
            <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between" suppressHydrationWarning={true}>
                  <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
                  <button
                    onClick={() => setShowMobileMenu(false)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <HiOutlineX className="w-6 h-6 text-gray-700" />
                  </button>
                </div>
              </div>

              <div className="p-4 space-y-4">
                {/* Cart */}
                {showCart && (
                  <Link
                    href="/cart"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <div className="relative">
                      <HiOutlineShoppingBag className="w-6 h-6 text-gray-700" />
                      {getNotificationCount("cart") > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {getNotificationCount("cart") > 99 ? '99+' : getNotificationCount("cart")}
                        </span>
                      )}
                    </div>
                    <span className="text-gray-700">Keranjang</span>
                  </Link>
                )}

                {/* Notifications */}
                {showNotifications && (
                  <Link
                    href="/notifications"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <div className="relative">
                      <HiOutlineBell className="w-6 h-6 text-gray-700" />
                      {getNotificationCount("tracking") + getNotificationCount("transaction") > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {getNotificationCount("tracking") + getNotificationCount("transaction") > 99 ? '99+' : getNotificationCount("tracking") + getNotificationCount("transaction")}
                        </span>
                      )}
                    </div>
                    <span className="text-gray-700">Notifikasi</span>
                  </Link>
                )}

                {/* User Menu */}
                {isLoggedIn ? (
                  <>
                    <div className="border-t border-gray-200 pt-4">
                      <div className="px-3 py-2">
                        <p className="text-sm font-medium text-gray-900">{userEmail}</p>
                        <p className="text-xs text-gray-500">Terakhir login</p>
                      </div>
                    </div>

                    <Link
                      href="/profile"
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <HiOutlineUser className="w-6 h-6 text-gray-700" />
                      <span className="text-gray-700">Profil Saya</span>
                    </Link>

                    <Link
                      href="/transaction"
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <HiOutlineCog className="w-6 h-6 text-gray-700" />
                      <span className="text-gray-700">Transaksi</span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 transition-colors w-full text-left"
                    >
                      <HiOutlineLogout className="w-6 h-6 text-red-600" />
                      <span className="text-red-600">Keluar</span>
                    </button>
                  </>
                ) : (
                  <div className="border-t border-gray-200 pt-4 space-y-3">
                    <Link
                      href="/login"
                      className="block w-full text-center py-3 px-4 text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      Masuk
                    </Link>
                    <Link
                      href="/register"
                      className="block w-full text-center py-3 px-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      Daftar
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
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
