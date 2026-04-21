"use client";

import Link from "next/link";
import React from "react";
import {
  HiOutlineCog,
  HiOutlineLogout,
  HiOutlineMenu,
  HiOutlineShoppingBag,
  HiOutlineUser,
  HiOutlineX,
} from "react-icons/hi";

interface MainHeaderMobileMenuProps {
  showMobileMenu: boolean;
  showCart: boolean;
  isLoggedIn: boolean;
  userEmail: string;
  cartNotificationCount: number;
  onToggleMobileMenu: () => void;
  onCloseMobileMenu: () => void;
  onLogout: () => void;
}

const MainHeaderMobileMenu = ({
  showMobileMenu,
  showCart,
  isLoggedIn,
  userEmail,
  cartNotificationCount,
  onToggleMobileMenu,
  onCloseMobileMenu,
  onLogout,
}: MainHeaderMobileMenuProps) => {
  return (
    <>
      <button
        onClick={onToggleMobileMenu}
        className="sm:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        {showMobileMenu ? (
          <HiOutlineX className="w-6 h-6 text-gray-700" />
        ) : (
          <HiOutlineMenu className="w-6 h-6 text-gray-700" />
        )}
      </button>

      {showMobileMenu && (
        <div className="sm:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={onCloseMobileMenu}>
          <div
            className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between" suppressHydrationWarning={true}>
                <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
                <button
                  onClick={onCloseMobileMenu}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <HiOutlineX className="w-6 h-6 text-gray-700" />
                </button>
              </div>
            </div>

            <div className="p-4 space-y-4">
              {showCart && (
                <Link
                  href="/cart"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                  onClick={onCloseMobileMenu}
                >
                  <div className="relative">
                    <HiOutlineShoppingBag className="w-6 h-6 text-gray-700" />
                    {cartNotificationCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {cartNotificationCount > 99 ? "99+" : cartNotificationCount}
                      </span>
                    )}
                  </div>
                  <span className="text-gray-700">Keranjang</span>
                </Link>
              )}

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
                    onClick={onCloseMobileMenu}
                  >
                    <HiOutlineUser className="w-6 h-6 text-gray-700" />
                    <span className="text-gray-700">Profil Saya</span>
                  </Link>

                  <Link
                    href="/transaction"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                    onClick={onCloseMobileMenu}
                  >
                    <HiOutlineCog className="w-6 h-6 text-gray-700" />
                    <span className="text-gray-700">Transaksi</span>
                  </Link>

                  <button
                    onClick={onLogout}
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
                    onClick={onCloseMobileMenu}
                  >
                    Masuk
                  </Link>
                  <Link
                    href="/register"
                    className="block w-full text-center py-3 px-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    onClick={onCloseMobileMenu}
                  >
                    Daftar
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MainHeaderMobileMenu;
