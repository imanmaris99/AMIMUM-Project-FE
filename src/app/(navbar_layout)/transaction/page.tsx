"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import TransactionList from "@/components/transaction/molecules/TransactionList";
import LoginProtection from "@/components/common/LoginProtection";
import UnifiedHeader from "@/components/common/UnifiedHeader";
import { Transaction } from "@/types/transaction";
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

  useEffect(() => {
    const loadOrders = async () => {
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

  const transactions = [...localTransactions, ...apiTransactions];

  const handleViewDetails = (transactionId: string) => {
    router.push(`/transaction/${transactionId}`);
  };

  const handleClearSimulatedTransactions = () => {
    if (localTransactions.length === 0) {
      toast("Tidak ada transaksi simulasi untuk dihapus");
      return;
    }

    if (
      window.confirm(
        "Hapus semua transaksi simulasi hasil testing? Data order dari backend tidak akan ikut terhapus."
      )
    ) {
      clearTransactions();
      toast.success("Semua transaksi simulasi berhasil dihapus");
    }
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
              {localTransactions.length > 0 && (
                <button
                  onClick={handleClearSimulatedTransactions}
                  className="text-red-500 text-sm font-medium hover:text-red-700 transition-colors"
                >
                  Hapus Simulasi
                </button>
              )}
            </div>
            {!isLoading && !errorMessage && transactions.length > 0 && (
              <p className="text-gray-500 text-sm mt-1">
                {transactions.length} transaksi ditemukan
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
              />
            </div>
          )}
        </div>
      </div>
    </LoginProtection>
  );
};

export default TransactionPage;
