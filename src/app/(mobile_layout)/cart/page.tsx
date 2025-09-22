"use client";

import React, { useEffect, useState } from "react";
// import { useRouter } from "next/navigation"; // Removed unused import
import { HiOutlineTrash } from "react-icons/hi";
import CartList from "@/components/cart/CartList";
import CartSummary from "@/components/cart/CartSummary";
import CartFooter from "@/components/cart/CartFooter";
import { useCart } from "@/contexts/CartContext";
import { useNotification } from "@/contexts/NotificationContext";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import LoginProtection from "@/components/common/LoginProtection";
import UnifiedHeader from "@/components/common/UnifiedHeader";

export default function CartPage() {
  // const router = useRouter(); // Removed unused variable
  const { totalItems, clearAll, cartItems } = useCart();
  const { resetNotification } = useNotification();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Reset cart notification when user visits cart page
  useEffect(() => {
    resetNotification("cart");
  }, [resetNotification]);

  const handleClearAll = () => {
    if (cartItems.length === 0) {
      toast.error("Keranjang sudah kosong");
      return;
    }
    setShowConfirmDialog(true);
  };

  const confirmClearAll = () => {
    clearAll();
    setShowConfirmDialog(false);
    toast.success("Semua item telah dihapus dari keranjang");
  };

  const cancelClearAll = () => {
    setShowConfirmDialog(false);
  };

  return (
    <LoginProtection>
      <div className="min-h-screen bg-white">
        {/* Unified Header */}
        <UnifiedHeader 
          type="main"
          showSearch={false}
          showCart={true}
          showNotifications={true}
        />

        {/* Cart Content */}
        <div className="px-6 py-4">
          {/* Keranjangku Header */}
          <div className="mb-6">
            <h1 className="text-[#0D0E09] text-lg font-semibold mb-4">
              Keranjangku
            </h1>
            
            {/* Total Item Info */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <span className="text-[#999999] text-sm">
                  Total Item :
                </span>
                <span className="text-[#0D0E09] text-sm font-bold">
                  {totalItems} Item
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

          {/* Cart Items */}
          <div className="space-y-4">
            <CartList />
            <CartSummary />
          </div>
        </div>

        {/* Cart Footer - Fixed at bottom */}
        <div className="fixed bottom-0 left-0 right-0 z-40">
          <CartFooter />
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
                  Anda yakin ingin menghapus semua item dari keranjang? Tindakan ini tidak dapat dibatalkan.
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
}