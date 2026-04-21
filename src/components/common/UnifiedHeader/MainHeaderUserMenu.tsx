"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import {
  HiOutlineCog,
  HiOutlineLogout,
  HiOutlineShoppingBag,
  HiOutlineUser,
} from "react-icons/hi";

interface MainHeaderUserMenuProps {
  isLoggedIn: boolean;
  showCart: boolean;
  showNotifications: boolean;
  showProfileDropdown: boolean;
  userDisplayName: string;
  userEmail: string;
  userPhotoUrl: string;
  cartNotificationCount: number;
  orderNotificationCount: number;
  onToggleProfileDropdown: () => void;
  onCloseProfileDropdown: () => void;
  onLogout: () => void;
}

const MainHeaderUserMenu = ({
  isLoggedIn,
  showCart,
  showNotifications,
  showProfileDropdown,
  userDisplayName,
  userEmail,
  userPhotoUrl,
  cartNotificationCount,
  orderNotificationCount,
  onToggleProfileDropdown,
  onCloseProfileDropdown,
  onLogout,
}: MainHeaderUserMenuProps) => {
  const combinedNotificationCount =
    cartNotificationCount + (showNotifications ? orderNotificationCount : 0);

  if (!isLoggedIn) {
    return (
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
    );
  }

  return (
    <div className="relative">
      <button
        onClick={onToggleProfileDropdown}
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
        suppressHydrationWarning={true}
      >
        <span className="hidden md:block text-sm text-gray-700 max-w-20 truncate">
          {userDisplayName}
        </span>

        <div className="relative">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center overflow-hidden">
            {userPhotoUrl ? (
              <Image
                src={userPhotoUrl}
                alt={userDisplayName || userEmail || "User"}
                width={32}
                height={32}
                className="h-8 w-8 object-cover"
                unoptimized
              />
            ) : (
              <span className="text-white text-sm font-medium">
                {(userDisplayName.charAt(0) || userEmail.charAt(0)).toUpperCase()}
              </span>
            )}
          </div>
          {combinedNotificationCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {combinedNotificationCount > 99 ? "99+" : combinedNotificationCount}
            </span>
          )}
        </div>
      </button>

      {showProfileDropdown && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">{userEmail}</p>
            <p className="text-xs text-gray-500">Terakhir login</p>
          </div>

          {showCart && (
            <Link
              href="/cart"
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              onClick={onCloseProfileDropdown}
            >
              <div className="relative">
                <HiOutlineShoppingBag className="w-4 h-4" />
                {cartNotificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {cartNotificationCount > 99 ? "99+" : cartNotificationCount}
                  </span>
                )}
              </div>
              <span>Keranjang</span>
            </Link>
          )}

          <Link
            href="/profile"
            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            onClick={onCloseProfileDropdown}
          >
            <HiOutlineUser className="w-4 h-4" />
            Profil Saya
          </Link>

          <Link
            href="/transaction"
            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            onClick={onCloseProfileDropdown}
          >
            <HiOutlineCog className="w-4 h-4" />
            Transaksi
          </Link>

          <button
            onClick={onLogout}
            className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
          >
            <HiOutlineLogout className="w-4 h-4" />
            Keluar
          </button>
        </div>
      )}
    </div>
  );
};

export default MainHeaderUserMenu;
