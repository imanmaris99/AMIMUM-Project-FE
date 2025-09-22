'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GoCheckCircle, GoHome, GoPackage, GoCreditCard, GoLocation } from 'react-icons/go';
import { IoCheckmarkCircle } from 'react-icons/io5';
import { useTransaction } from '@/contexts/TransactionContext';

interface OrderConfirmationProps {
  orderId?: string;
  additionalNotes?: string;
  onBack?: () => void;
}

const OrderConfirmation: React.FC<OrderConfirmationProps> = ({ 
  orderId, 
  additionalNotes,
  onBack 
}) => {
  const router = useRouter();
  const { transactions } = useTransaction();
  const [latestTransaction, setLatestTransaction] = useState<Transaction | null>(null);

  // Get the latest transaction
  useEffect(() => {
    if (transactions.length > 0) {
      setLatestTransaction(transactions[0]); // First transaction is the latest
    }
  }, [transactions]);

  const handleBackToHome = () => {
    if (onBack) {
      onBack();
    } else {
      router.push('/');
    }
  };

  const handleViewOrders = () => {
    router.push('/transaction');
  };

  const handleTrackOrder = () => {
    if (latestTransaction?.id) {
      router.push(`/track-order?transactionId=${latestTransaction.id}`);
    } else {
      router.push('/track-order');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <button
            onClick={handleBackToHome}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <GoHome className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Konfirmasi Pesanan</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="max-w-sm mx-auto bg-white min-h-screen">
        {/* Success Animation */}
        <div className="px-4 py-8 text-center">
          <div className="relative mb-6">
            <div className="w-24 h-24 bg-green-100 rounded-full mx-auto flex items-center justify-center">
              <IoCheckmarkCircle className="w-16 h-16 text-green-500" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <GoCheckCircle className="w-5 h-5 text-white" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Pesanan Berhasil!
          </h2>
          <p className="text-gray-600 mb-4">
            Terima kasih telah berbelanja di Amimum Herbal Store
          </p>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-green-800 font-medium">
              ID Pesanan: {latestTransaction?.transactionId || orderId || "ORD-2024-001"}
            </p>
            <p className="text-xs text-green-600 mt-1">
              Simpan ID ini untuk melacak pesanan Anda
            </p>
          </div>
        </div>

        {/* Order Details */}
        <div className="px-4 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Detail Pesanan</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Status</span>
              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                Menunggu Pembayaran
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Metode Pengiriman</span>
              <span className="text-gray-900">
                {latestTransaction?.deliveryType === 'delivery' ? 'Kirim ke tujuan' : 'Ambil di toko'}
              </span>
            </div>
            {latestTransaction?.deliveryType === 'delivery' && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Estimasi Pengiriman</span>
                <span className="text-gray-900">2-3 hari kerja</span>
              </div>
            )}
            {latestTransaction?.deliveryType === 'pickup' && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Pengambilan</span>
                <span className="text-gray-900">Siap diambil</span>
              </div>
            )}
            {(latestTransaction?.notes || additionalNotes) && (
              <div className="pt-3 border-t border-gray-200">
                <div className="flex items-start space-x-2">
                  <span className="text-gray-600 text-sm">Catatan:</span>
                  <p className="text-gray-900 text-sm flex-1">
                    &ldquo;{latestTransaction?.notes || additionalNotes}&rdquo;
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Next Steps */}
        <div className="px-4 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Langkah Selanjutnya</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <GoCreditCard className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Lakukan Pembayaran</p>
                <p className="text-sm text-gray-600">
                  Selesaikan pembayaran untuk memproses pesanan Anda
                </p>
              </div>
            </div>
            
            {latestTransaction?.deliveryType === 'delivery' ? (
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <GoPackage className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Pesanan Diproses</p>
                  <p className="text-sm text-gray-600">
                    Kami akan memproses dan mengirim pesanan Anda
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <GoLocation className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Siap Diambil</p>
                  <p className="text-sm text-gray-600">
                    Pesanan siap diambil di toko setelah pembayaran
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-4 py-6 space-y-3">
          <button
            onClick={handleViewOrders}
            className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-[#005A3C] transition-colors"
          >
            Lihat Pesanan Saya
          </button>
          
          {/* Only show "Lacak Pesanan" for delivery orders */}
          {latestTransaction?.deliveryType === 'delivery' && (
            <button
              onClick={handleTrackOrder}
              className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Lacak Pesanan
            </button>
          )}
          
          <button
            onClick={handleBackToHome}
            className="w-full text-primary py-3 px-4 rounded-lg font-medium hover:bg-primary/5 transition-colors"
          >
            Kembali ke Beranda
          </button>
        </div>

        {/* Help Section */}
        <div className="px-4 py-4 bg-gray-50">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              Butuh bantuan?
            </p>
            <div className="flex justify-center space-x-4">
              <button className="text-primary text-sm font-medium hover:underline">
                Hubungi Kami
              </button>
              <span className="text-gray-300">|</span>
              <button className="text-primary text-sm font-medium hover:underline">
                FAQ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
