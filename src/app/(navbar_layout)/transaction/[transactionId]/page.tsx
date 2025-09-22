"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useTransaction } from "@/contexts/TransactionContext";
import { Transaction } from "@/types/transaction";
import rupiahFormater from "@/utils/rupiahFormater";
import UnifiedHeader from "@/components/common/UnifiedHeader";

const TransactionDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const { transactions } = useTransaction();
  const transactionId = params?.transactionId as string;
  
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (transactionId) {
      const foundTransaction = transactions.find(t => t.id === transactionId);
      if (foundTransaction) {
        setTransaction(foundTransaction);
      }
      setIsLoading(false);
    }
  }, [transactionId, transactions]);

  const handleBack = () => {
    router.back();
  };

  const handleTrackShipment = () => {
    // Navigate to track order page with transaction ID
    toast.success('Mengarahkan ke halaman pelacakan...');
    router.push(`/track-order?transactionId=${transaction.id}`);
  };

  const handleDownloadInvoice = () => {
    // TODO: Implement invoice download functionality
    toast.loading('Mempersiapkan invoice...', { duration: 2000 });
    setTimeout(() => {
      toast.success('Invoice berhasil didownload!');
    }, 2000);
  };

  const handleBuyAgain = () => {
    // TODO: Implement buy again functionality
    toast.loading('Memproses pembelian ulang...', { duration: 2000 });
    setTimeout(() => {
      toast.success('Item berhasil ditambahkan ke keranjang!');
    }, 2000);
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          text: 'Lunas',
          bgColor: 'bg-green-100',
          textColor: 'text-green-600',
          borderColor: 'border-green-200'
        };
      case 'cancelled':
        return {
          text: 'Batal',
          bgColor: 'bg-red-100',
          textColor: 'text-red-600',
          borderColor: 'border-red-200'
        };
      case 'pending':
        return {
          text: 'Pending',
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-600',
          borderColor: 'border-yellow-200'
        };
      case 'refund':
        return {
          text: 'Refund',
          bgColor: 'bg-purple-100',
          textColor: 'text-purple-600',
          borderColor: 'border-purple-200'
        };
      default:
        return {
          text: 'Unknown',
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-600',
          borderColor: 'border-gray-200'
        };
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <UnifiedHeader 
          type="secondary"
          title="Detail Transaksi"
          showBackButton={true}
          onBack={handleBack}
        />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="min-h-screen bg-white">
        <UnifiedHeader 
          type="secondary"
          title="Detail Transaksi"
          showBackButton={true}
          onBack={handleBack}
        />
        <div className="flex flex-col items-center justify-center h-64 px-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Transaksi Tidak Ditemukan
          </h3>
          <p className="text-gray-500 text-sm text-center">
            Transaksi dengan ID {transactionId} tidak ditemukan
          </p>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(transaction.status);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Unified Header */}
      <UnifiedHeader 
        type="secondary"
        title="Detail Transaksi"
        subtitle="Informasi lengkap transaksi"
        showBackButton={true}
        onBack={handleBack}
      />

      {/* Content */}
      <div className="px-4 py-6">
        <div className="max-w-sm mx-auto space-y-4">
          {/* Transaction Status Card */}
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-gray-900">Status Transaksi</h2>
              <div className={`px-3 py-1 rounded-full ${statusConfig.bgColor} ${statusConfig.borderColor} border`}>
                <span className={`text-sm font-medium ${statusConfig.textColor}`}>
                  {statusConfig.text}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">ID Transaksi:</span>
                <span className="text-sm font-medium text-gray-900">{transaction.transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Tanggal:</span>
                <span className="text-sm font-medium text-gray-900">{transaction.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total:</span>
                <span className="text-sm font-medium text-gray-900">{rupiahFormater(transaction.total)}</span>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Item Pesanan</h3>
            <div className="space-y-3">
              {transaction.items.map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">{item.name}</h4>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    <p className="text-sm font-medium text-gray-900">{rupiahFormater(item.price)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Information */}
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Informasi Pengiriman</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Metode:</span>
                <span className="text-sm font-medium text-gray-900">
                  {transaction.deliveryType === 'delivery' ? 'Dikirim' : 'Ambil di Toko'}
                </span>
              </div>
              {transaction.deliveryType === 'delivery' && (
                <>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Alamat:</span>
                    <span className="text-sm font-medium text-gray-900 text-right">
                      {transaction.shipmentAddress?.address || 'Alamat tidak tersedia'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Kurir:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {transaction.shipmentAddress?.courier || 'Kurir tidak tersedia'}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Additional Notes */}
          {transaction.notes && (
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Catatan Tambahan</h3>
              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                &ldquo;{transaction.notes}&rdquo;
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="space-y-3">
              {/* Only show "Lacak Pengiriman" for delivery orders */}
              {transaction.deliveryType === 'delivery' && (
                <button 
                  onClick={handleTrackShipment}
                  className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  Lacak Pengiriman
                </button>
              )}
              <button 
                onClick={handleDownloadInvoice}
                className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Download Invoice
              </button>
              {transaction.status === 'completed' && (
                <button 
                  onClick={handleBuyAgain}
                  className="w-full border border-primary text-primary py-3 px-4 rounded-lg font-medium hover:bg-primary/5 transition-colors"
                >
                  Beli Lagi
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailPage;
