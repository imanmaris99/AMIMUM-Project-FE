"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import TransactionList from "@/components/transaction/molecules/TransactionList";
import { Transaction } from "@/types/transaction";
import { useTransaction } from "@/contexts/TransactionContext";
import { toast } from "react-hot-toast";
import LoginProtection from "@/components/common/LoginProtection";
import UnifiedHeader from "@/components/common/UnifiedHeader";

const TransactionPage = () => {
  const { transactions, clearTransactions } = useTransaction();
  const totalTransactions = transactions.length;

  // Transactions are now managed by TransactionContext

  const handleViewDetails = (transactionId: string) => {
    // Navigate to transaction details page
    window.location.href = `/transaction/${transactionId}`;
  };

  const handleClearTransactions = () => {
    if (transactions.length === 0) {
      toast.info('Tidak ada transaksi untuk dihapus');
      return;
    }

    if (window.confirm('Apakah Anda yakin ingin menghapus semua transaksi? Tindakan ini tidak dapat dibatalkan.')) {
      clearTransactions();
      toast.success('Semua transaksi berhasil dihapus');
    }
  };

  return (
    <LoginProtection useModal={true} feature="transaction">
      <div className="min-h-screen bg-white">
        {/* Unified Header */}
        <UnifiedHeader 
          type="main"
          showSearch={false}
          showCart={true}
          showNotifications={true}
        />

        {/* Transaction Content */}
        <div className="px-6 py-4">
          {/* Riwayat Transaksi Header */}
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <h1 className="text-[#0D0E09] text-lg font-semibold">
                Riwayat Transaksi
              </h1>
              {transactions.length > 0 && (
                <button
                  onClick={handleClearTransactions}
                  className="text-red-500 text-sm font-medium hover:text-red-700 transition-colors"
                >
                  Hapus Semua
                </button>
              )}
            </div>
            {transactions.length > 0 && (
              <p className="text-gray-500 text-sm mt-1">
                {totalTransactions} transaksi ditemukan
              </p>
            )}
          </div>

          {/* Transaction List */}
          <div className="space-y-4">
            <TransactionList 
              transactions={transactions} 
              onViewDetails={handleViewDetails}
            />
          </div>
        </div>
      </div>
    </LoginProtection>
  );
};

export default TransactionPage;
