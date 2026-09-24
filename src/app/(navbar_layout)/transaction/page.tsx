"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import TransactionList from "@/components/transaction/molecules/TransactionList";
import LoginProtection from "@/components/common/LoginProtection";
import UnifiedHeader from "@/components/common/UnifiedHeader";
import { Transaction } from "@/types/transaction";
import { SessionManager } from "@/lib/auth";
import {
  getMyOrders,
  mapOrderSummaryToTransaction,
} from "@/services/api/orders";
import { useTransaction } from "@/contexts/TransactionContext";

const TransactionPage = () => {
  const router = useRouter();
  const { transactions: localTransactions, clearTransactions } = useTransaction();
  const [apiTransactions, setApiTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showClearConfirmDialog, setShowClearConfirmDialog] = useState(false);

  useEffect(() => {
    const loadOrders = async () => {
      if (!SessionManager.isAuthenticated()) {
        setApiTransactions([]);
        setIsLoading(false);
        setErrorMessage(null);
        return;
      }

      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await getMyOrders();
        setApiTransactions(response.data.map(mapOrderSummaryToTransaction));
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Gagal mengambil riwayat transaksi."
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadOrders();
  }, []);

  useEffect(() => {
    if (!showClearConfirmDialog) {
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
  }, [showClearConfirmDialog]);

  const transactions = [
    ...apiTransactions,
  ];
  const hasLocalLegacyTransactions = localTransactions.length > 0;

  const handleViewDetails = (transactionId: string) => {
    router.push(`/transaction/${transactionId}`);
  };

  const handleTrackOrder = (transactionId: string) => {
    router.push(`/track-order?transactionId=${transactionId}`);
  };

  const handleClearSimulatedTransactions = () => {
    if (!hasLocalLegacyTransactions) {
      toast("Tidak ada data lokal lama untuk dibersihkan");
      return;
    }

    setShowClearConfirmDialog(true);
  };

  const confirmClearSimulatedTransactions = () => {
    clearTransactions();
    setShowClearConfirmDialog(false);
    toast.success("Data transaksi lokal lama berhasil dibersihkan");
  };

  return (
    <LoginProtection useModal={true} feature="transaction">
      <div className="min-h-screen bg-white">
        <UnifiedHeader
          type="main"
          showSearch={false}
          showCart={true}
          showNotifications={true}
        />

        <div className="px-6 py-4">
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <h1 className="text-[#0D0E09] text-lg font-semibold">
                Riwayat Transaksi
              </h1>
              {hasLocalLegacyTransactions && (
                <button
                  onClick={handleClearSimulatedTransactions}
                  className="text-primary text-sm font-medium hover:text-primary/80 transition-colors"
                >
                  Bersihkan Lokal
                </button>
              )}
            </div>
            {!isLoading && !errorMessage && transactions.length > 0 && (
              <div className="mt-2 rounded-xl bg-primary/5 px-3 py-2">
                <p className="text-sm font-medium text-primary">
                  {transactions.length} transaksi backend ditemukan
                </p>
                <p className="mt-1 text-xs text-gray-600">
                  Riwayat ini mengambil data pesanan dari server toko agar status, pembayaran, dan tracking tetap akurat.
                </p>
              </div>
            )}
            {!isLoading && !errorMessage && hasLocalLegacyTransactions && (
              <p className="mt-2 rounded-lg bg-yellow-50 px-3 py-2 text-xs text-yellow-800">
                Data transaksi lokal lama disembunyikan dari daftar customer agar tidak tertukar dengan pesanan backend.
              </p>
            )}
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
              <p className="text-gray-500 text-sm">
                Memuat riwayat transaksi...
              </p>
            </div>
          ) : errorMessage ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M4.93 19h14.14c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.69-1.33-3.46 0L3.2 16c-.77 1.33.19 3 1.73 3z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Gagal Memuat Transaksi
              </h3>
              <p className="text-gray-500 text-sm">{errorMessage}</p>
            </div>
          ) : (
            <div className="space-y-4">
              <TransactionList
                transactions={transactions}
                onViewDetails={handleViewDetails}
                onTrackOrder={handleTrackOrder}
              />
            </div>
          )}
        </div>

        {showClearConfirmDialog && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
            <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl">
              <h2 className="text-lg font-semibold text-gray-900">
                Bersihkan Data Lokal Lama?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                Data transaksi lokal lama akan dihapus dari perangkat ini. Pesanan backend/server tidak ikut terhapus.
              </p>
              <div className="mt-5 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowClearConfirmDialog(false)}
                  className="flex-1 rounded-2xl border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={confirmClearSimulatedTransactions}
                  className="flex-1 rounded-2xl bg-primary px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-primary/90"
                >
                  Bersihkan
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </LoginProtection>
  );
};

export default TransactionPage;
