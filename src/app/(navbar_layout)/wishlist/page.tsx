"use client";

import React, { useState } from "react";
import { HiOutlineTrash } from "react-icons/hi";
import { Button } from "@/components/ui/button";
import WishlistList from "@/components/wishlist/molecules/WishlistList";
import { useWishlist } from "@/contexts/WishlistContext";
import LoginProtection from "@/components/common/LoginProtection";
import { toast } from "react-hot-toast";
import UnifiedHeader from "@/components/common/UnifiedHeader";

const Wishlist = () => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const { wishlistItems, clearAll, isLoading } = useWishlist();
  const totalItems = wishlistItems.length;

  const handleRemoveItem = () => {
    // Removal is handled by WishlistContext inside WishlistList.
  };

  const handleClearAll = () => {
    if (totalItems === 0 || isClearing) {
      return;
    }
    setShowConfirmDialog(true);
  };

  const confirmClearAll = async () => {
    try {
      setIsClearing(true);
      await clearAll();
      setShowConfirmDialog(false);
      toast.success("Semua item telah dihapus dari wishlist");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Gagal menghapus wishlist. Silakan coba lagi."
      );
    } finally {
      setIsClearing(false);
    }
  };

  const cancelClearAll = () => {
    if (!isClearing) setShowConfirmDialog(false);
  };

  return (
    <LoginProtection useModal={true} feature="wishlist">
      <div className="min-h-screen bg-transparent">
        <UnifiedHeader
          type="main"
          showSearch={false}
          showCart={true}
          showNotifications={true}
        />

        <div className="px-4 py-4 pb-[calc(6.5rem+env(safe-area-inset-bottom))]">
          <div className="mb-4 rounded-3xl bg-white/95 p-4 shadow-[0_8px_22px_rgba(15,23,42,0.08)]">
            <h1 className="mb-2 text-lg font-semibold text-[#0D0E09]">
              Produk Idamanku
            </h1>
            <p className="mb-5 text-xs leading-relaxed text-[#6B7C73]">
              Daftar ini hanya berisi produk yang tersimpan dari akun Anda.
            </p>

            <div className="mb-1 flex items-center justify-between gap-3 rounded-2xl bg-emerald-50/70 px-3 py-3">
              <div className="flex items-center gap-3">
                <span className="text-sm text-[#6B7C73]">Total Produk:</span>
                <span className="text-sm font-bold text-[#0D0E09]">
                  {isLoading ? "Memuat..." : `${totalItems} Produk`}
                </span>
              </div>
              {totalItems > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearAll}
                  disabled={isClearing}
                  className="flex items-center gap-1 rounded-2xl border-red-200 bg-white/80 text-red-600 hover:bg-red-50 disabled:opacity-60"
                >
                  <HiOutlineTrash size={16} />
                  <span className="text-xs">Hapus Semua</span>
                </Button>
              )}
            </div>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center rounded-3xl bg-white/95 py-16 text-center shadow-[0_8px_22px_rgba(15,23,42,0.08)]">
              <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
              <p className="text-sm text-[#6B7C73]">Memuat wishlist Anda...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <WishlistList
                items={wishlistItems}
                onRemoveItem={handleRemoveItem}
              />
            </div>
          )}
        </div>

        {showConfirmDialog && (
          <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
            <div className="max-h-[calc(100dvh-2rem)] w-full max-w-sm overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                  <HiOutlineTrash className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  Hapus Semua Item?
                </h3>
                <p className="mb-6 text-sm leading-relaxed text-gray-500">
                  Anda yakin ingin menghapus semua produk dari wishlist akun ini? Tindakan ini tidak dapat dibatalkan.
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={cancelClearAll}
                    disabled={isClearing}
                    className="flex-1 rounded-2xl"
                  >
                    Batal
                  </Button>
                  <Button
                    onClick={() => void confirmClearAll()}
                    disabled={isClearing}
                    className="flex-1 rounded-2xl bg-red-600 hover:bg-red-700 disabled:opacity-60"
                  >
                    {isClearing ? "Menghapus..." : "Hapus Semua"}
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
