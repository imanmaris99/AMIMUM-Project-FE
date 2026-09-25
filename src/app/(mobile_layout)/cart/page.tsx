"use client";

import React, { useEffect, useState } from "react";
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
  const { totalItems, clearAll, cartItems, isLoading, isSyncing } = useCart();
  const { resetNotification } = useNotification();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isClearingCart, setIsClearingCart] = useState(false);
  const cartRowCount = cartItems.length;
  const selectedQuantity = totalItems;
  const hasCartItems = cartRowCount > 0;
  const canClearCart = !isLoading && !isSyncing && hasCartItems && !isClearingCart;

  useEffect(() => {
    if (!showConfirmDialog) {
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
  }, [showConfirmDialog]);

  // Reset cart notification when user visits cart page
  useEffect(() => {
    resetNotification("cart");
  }, [resetNotification]);

  const handleClearAll = () => {
    if (cartItems.length === 0) {
      return;
    }
    setShowConfirmDialog(true);
  };

  const confirmClearAll = async () => {
    if (isClearingCart) {
      return;
    }

    setIsClearingCart(true);
    try {
      await clearAll();
      setShowConfirmDialog(false);
      toast.success("Semua item telah dihapus dari keranjang.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Gagal menghapus semua item keranjang."
      );
    } finally {
      setIsClearingCart(false);
    }
  };

  const cancelClearAll = () => {
    setShowConfirmDialog(false);
  };

  return (
    <LoginProtection>
      <div className="min-h-screen bg-[linear-gradient(180deg,#F7FCF9_0%,#FFFFFF_42%,#FFFDF7_100%)]">
        {/* Unified Header */}
        <UnifiedHeader 
          type="main"
          showSearch={false}
          showCart={true}
          showNotifications={true}
        />

        {/* Cart Content */}
        <div className={`px-5 py-4 ${!isLoading && hasCartItems ? "pb-[calc(12rem+env(safe-area-inset-bottom))]" : ""}`}>
          {/* Keranjangku Header */}
          <div className="mb-6">
            <h1 className="text-[#0D0E09] text-lg font-semibold mb-4">
              Keranjangku
            </h1>
            
            {/* Total Item Info */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <span className="text-[#999999] text-sm">Isi keranjang:</span>
                <span className="text-[#0D0E09] text-sm font-bold">
                  {isLoading ? "Memuat..." : `${cartRowCount} produk`}
                </span>
              </div>
              {!isLoading && hasCartItems && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearAll}
                  disabled={!canClearCart}
                  className="flex items-center gap-1 text-red-600 border-red-200 hover:bg-red-50"
                >
                  <HiOutlineTrash size={16} />
                  <span className="text-xs">{isClearingCart ? "Menghapus..." : "Hapus Semua"}</span>
                </Button>
              )}
            </div>
            {!isLoading && hasCartItems && (
              <div className="rounded-2xl border border-[#D7EDE4] bg-white/85 px-4 py-3 text-xs text-gray-600 shadow-sm">
                <span className="font-semibold text-primary">{selectedQuantity} item dipilih</span>
                <span> untuk checkout. Centang produk yang ingin dibeli sekarang.</span>
                {isSyncing && (
                  <p className="mt-1 font-medium text-primary/80">
                    Menyimpan perubahan keranjang ke server...
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Cart Items */}
          <div className="space-y-4">
            <CartList />
            {!isLoading && hasCartItems && <CartSummary />}
          </div>
        </div>

        {/* Cart Footer - Fixed at bottom */}
        {!isLoading && hasCartItems && (
          <div className="fixed bottom-0 left-0 right-0 z-40">
            <CartFooter />
          </div>
        )}

        {/* Confirmation Dialog */}
        {showConfirmDialog && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4">
            <div className="max-h-[calc(100dvh-2rem)] w-full max-w-sm overflow-y-auto rounded-2xl bg-white p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] shadow-xl">
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
                    disabled={isClearingCart}
                    className="flex-1"
                  >
                    Batal
                  </Button>
                  <Button
                    onClick={() => {
                      void confirmClearAll();
                    }}
                    disabled={isClearingCart}
                    className="flex-1 bg-red-600 hover:bg-red-700"
                  >
                    {isClearingCart ? "Menghapus..." : "Hapus Semua"}
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
