"use client";

import React, { useState, useEffect } from "react";
import { HiOutlineTrash } from "react-icons/hi";
import { Button } from "@/components/ui/button";
import WishlistList from "@/components/wishlist/molecules/WishlistList";
import { WishlistItem } from "@/types/wishlist";
import { useWishlist } from "@/contexts/WishlistContext";
import LoginProtection from "@/components/common/LoginProtection";
import { toast } from "react-hot-toast";
import UnifiedHeader from "@/components/common/UnifiedHeader";

const Wishlist = () => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { wishlistItems, removeFromWishlist, clearAll } = useWishlist();
  const [totalItems, setTotalItems] = useState(0);

  // Update total items when wishlist changes
  useEffect(() => {
    setTotalItems(wishlistItems.length);
  }, [wishlistItems]);

  const handleRemoveItem = (itemId: string) => {
    // This function is now handled by the context
    // We keep it for backward compatibility with WishlistList
  };

  const handleClearAll = () => {
    if (wishlistItems.length === 0) {
      toast.error("Wishlist sudah kosong");
      return;
    }
    setShowConfirmDialog(true);
  };

  const confirmClearAll = () => {
    clearAll();
    setShowConfirmDialog(false);
    toast.success("Semua item telah dihapus dari wishlist");
  };

  const cancelClearAll = () => {
    setShowConfirmDialog(false);
  };

  return (
    <LoginProtection useModal={true} feature="wishlist">
      <div className="min-h-screen bg-white">
        {/* Unified Header */}
        <UnifiedHeader 
          type="main"
          showSearch={false}
          showCart={true}
          showNotifications={true}
        />

        {/* Wishlist Content */}
        <div className="px-6 py-4">
          {/* Produk Idamanku Header */}
          <div className="mb-6">
            <h1 className="text-[#0D0E09] text-lg font-semibold mb-4">
              Produk Idamanku
            </h1>
            
            {/* Total Produk Info */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <span className="text-[#999999] text-sm">
                  Total Produk Idaman :
                </span>
                <span className="text-[#0D0E09] text-sm font-bold">
                  {totalItems} Produk
                </span>
              </div>
              {totalItems > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearAll}
                  className="flex items-center gap-1 text-red-600 border-red-200 hover:bg-red-50"
                >
                  <HiOutlineTrash size={16} />
                  <span className="text-xs">Hapus Semua</span>
                </Button>
              )}
            </div>
          </div>

          {/* Wishlist Items */}
          <div className="space-y-4">
            <WishlistList 
              items={wishlistItems} 
              onRemoveItem={handleRemoveItem}
            />
          </div>
        </div>

        {/* Confirmation Dialog */}
        {showConfirmDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 mx-4 max-w-sm w-full">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <HiOutlineTrash className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Hapus Semua Item?
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  Anda yakin ingin menghapus semua item dari wishlist? Tindakan ini tidak dapat dibatalkan.
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={cancelClearAll}
                    className="flex-1"
                  >
                    Batal
                  </Button>
                  <Button
                    onClick={confirmClearAll}
                    className="flex-1 bg-red-600 hover:bg-red-700"
                  >
                    Hapus Semua
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

