'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import rupiahFormater from '@/utils/rupiahFormater';
import { SessionManager } from '@/lib/auth';
import LoginRequiredModal from '@/components/common/LoginRequiredModal';

interface CartFooterProps {
  onCheckout?: () => void;
}

export default function CartFooter({ onCheckout }: CartFooterProps) {
  const router = useRouter();
  const { cartItems, totalPrices, updateAllActiveStatus, isLoading } = useCart();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isSelectingAll, setIsSelectingAll] = useState(false);

  const activeItems = useMemo(
    () => cartItems.filter((item) => item.is_active !== false),
    [cartItems]
  );
  const selectedSubtotal = activeItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const total = selectedSubtotal > 0 ? selectedSubtotal : totalPrices.total;
  const selectedItemCount = activeItems.reduce((sum, item) => sum + item.quantity, 0);
  const hasSelectedItems = activeItems.length > 0;
  const hasValidTotal = total > 0;
  const hasSyncMismatch = hasSelectedItems && !hasValidTotal && !isLoading;
  const canCheckout = !isLoading && !isSelectingAll && hasSelectedItems && hasValidTotal;
  const allItemsSelected =
    cartItems.length > 0 && cartItems.every((item) => item.is_active !== false);

  const handleSelectAll = useCallback(async () => {
    if (cartItems.length === 0 || isSelectingAll) return;

    const newStatus = !allItemsSelected;

    setIsSelectingAll(true);
    try {
      await updateAllActiveStatus(newStatus);
    } finally {
      setIsSelectingAll(false);
    }
  }, [cartItems.length, allItemsSelected, updateAllActiveStatus, isSelectingAll]);

  const handleCheckout = () => {
    if (isLoading || isSelectingAll) {
      return;
    }

    if (!hasSelectedItems) {
      return;
    }

    if (!hasValidTotal) {
      return;
    }

    const isLoggedIn = SessionManager.isAuthenticated();

    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    if (onCheckout) {
      onCheckout();
    } else {
      router.push('/order-1');
    }
  };

  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 bg-white border-t border-gray-200 z-50" style={{ maxWidth: '440px', width: '100%' }}>
      <div className="px-4 py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                void handleSelectAll();
              }}
              disabled={isLoading || isSelectingAll || cartItems.length === 0}
              aria-pressed={allItemsSelected}
              aria-label="Pilih semua produk"
              className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${
                allItemsSelected
                  ? 'border-primary bg-primary'
                  : 'border-gray-300 bg-white'
              }`}
            >
              {allItemsSelected && (
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
            <span className="text-gray-600 text-sm">
              {isSelectingAll
                ? 'Menyinkronkan...'
                : selectedItemCount > 0
                  ? `${selectedItemCount} dipilih`
                  : 'Pilih item'}
            </span>
          </div>

          <button
            onClick={handleCheckout}
            disabled={!canCheckout}
            aria-disabled={!canCheckout}
            className="bg-primary text-white px-6 py-3 rounded-full font-medium text-sm disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading || isSelectingAll
              ? 'Memuat...'
              : hasSelectedItems
                ? `Checkout (${rupiahFormater(total)})`
                : 'Pilih item dulu'}
          </button>
        </div>
        {!hasSelectedItems && cartItems.length > 0 && !isLoading && (
          <p className="mt-2 rounded-lg bg-yellow-50 px-3 py-2 text-xs text-yellow-800">
            Pilih minimal satu produk untuk melanjutkan checkout.
          </p>
        )}
        {hasSyncMismatch && (
          <p className="mt-2 rounded-lg bg-yellow-50 px-3 py-2 text-xs text-yellow-800">
            Data keranjang sedang disinkronkan. Coba pilih ulang produk atau refresh halaman.
          </p>
        )}
      </div>

      <div className="flex justify-center pb-2">
        <div className="w-32 h-1 bg-gray-800 rounded-full"></div>
      </div>

      <LoginRequiredModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        feature="checkout"
        title="Login Diperlukan untuk Checkout"
        description="Silakan login terlebih dahulu untuk melanjutkan checkout dan menyelesaikan pembelian Anda dengan aman."
      />
    </div>
  );
}
