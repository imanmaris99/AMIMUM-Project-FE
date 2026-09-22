'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { GoCheckCircle, GoHome, GoPackage, GoCreditCard, GoLocation } from 'react-icons/go';
import { IoCheckmarkCircle } from 'react-icons/io5';
import { useTransaction } from '@/contexts/TransactionContext';
import { Transaction } from '@/types/transaction';
import { getPaymentMethodLabel, isManualQrisPaymentMethod } from '@/lib/paymentMethods';
import {
  getCustomerOrderAlert,
  getCustomerStatusConfig,
  isFailedPaymentStatus,
  isPendingPaymentStatus,
} from '@/lib/transactionStatus';
import { SessionManager } from '@/lib/auth';
import {
  getOrderDetail,
  mapOrderDetailToTransaction,
} from '@/services/api/orders';

const BACKEND_ORDER_ID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

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
  const searchParams = useSearchParams();
  const { transactions } = useTransaction();
  const [latestTransaction, setLatestTransaction] = useState<Transaction | null>(null);
  const [isResolvingTransaction, setIsResolvingTransaction] = useState(true);
  const confirmationTransactionId = searchParams?.get('transactionId') || orderId;

  // Show only a confirmed checkout context; avoid displaying a success state for direct visits.
  useEffect(() => {
    const loadConfirmationTransaction = async () => {
      setIsResolvingTransaction(true);

      if (!confirmationTransactionId || !BACKEND_ORDER_ID_PATTERN.test(confirmationTransactionId)) {
        setLatestTransaction(null);
        setIsResolvingTransaction(false);
        return;
      }

      const matchedTransaction = transactions.find(
        (transaction) =>
          transaction.id === confirmationTransactionId ||
          transaction.transactionId === confirmationTransactionId
      );

      if (matchedTransaction) {
        setLatestTransaction(matchedTransaction);
        setIsResolvingTransaction(false);
        return;
      }

      if (!SessionManager.isAuthenticated()) {
        setLatestTransaction(null);
        setIsResolvingTransaction(false);
        return;
      }

      try {
        const response = await getOrderDetail(confirmationTransactionId);
        setLatestTransaction(mapOrderDetailToTransaction(response.data));
      } catch {
        setLatestTransaction(null);
      } finally {
        setIsResolvingTransaction(false);
      }
    };

    void loadConfirmationTransaction();
  }, [confirmationTransactionId, transactions]);


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

  const handleContinuePayment = () => {
    if (latestTransaction?.id) {
      router.push(`/transaction/${latestTransaction.id}`);
    } else {
      router.push('/transaction');
    }
  };

  const handleTrackOrder = () => {
    if (latestTransaction?.id) {
      router.push(`/track-order?transactionId=${latestTransaction.id}`);
    } else {
      router.push('/track-order');
    }
  };

  const statusConfig = getCustomerStatusConfig(
    latestTransaction?.status || '',
    latestTransaction?.paymentMethod
  );
  const isPendingPayment = isPendingPaymentStatus(latestTransaction?.status);
  const isFailedPayment = isFailedPaymentStatus(latestTransaction?.status);
  const isManualQrisPayment = isManualQrisPaymentMethod(latestTransaction?.paymentMethod);
  const orderAlert = latestTransaction
    ? getCustomerOrderAlert(
        latestTransaction.status,
        latestTransaction.shipmentAddress?.trackingNumber,
        latestTransaction.deliveryType
      )
    : null;

  if (isResolvingTransaction) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-gray-600">Memuat detail pesanan...</p>
        </div>
      </div>
    );
  }

  if (!latestTransaction) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBackToHome}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Kembali ke beranda"
            >
              <GoHome className="w-6 h-6 text-gray-600" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">Konfirmasi Pesanan</h1>
            <div className="w-10" />
          </div>
        </div>

        <div className="max-w-sm mx-auto bg-white min-h-screen px-4 py-10 text-center">
          <div className="w-20 h-20 bg-yellow-50 rounded-full mx-auto flex items-center justify-center mb-5">
            <GoPackage className="w-10 h-10 text-yellow-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Belum Ada Pesanan Baru
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Halaman konfirmasi hanya tampil setelah checkout berhasil dan ID pesanan valid tersedia dari server.
          </p>
          <button
            onClick={() => router.push('/cart')}
            className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-[#005A3C] transition-colors mb-3"
          >
            Lihat Keranjang
          </button>
          <button
            onClick={handleViewOrders}
            className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors mb-3"
          >
            Cek Riwayat Transaksi
          </button>
          <button
            onClick={handleBackToHome}
            className="w-full text-primary py-3 px-4 rounded-lg font-medium hover:bg-primary/5 transition-colors"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

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
            {isPendingPayment ? 'Pesanan Dibuat, Menunggu Bayar' : 'Pesanan Tercatat di Sistem'}
          </h2>
          <p className="text-gray-600 mb-4">
            Terima kasih telah berbelanja di Toko Herbal Amimum.
          </p>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-green-800 font-medium">
              ID Pesanan: {latestTransaction?.transactionId || orderId}
            </p>
            <p className="text-xs text-green-600 mt-1">
              ID ini berasal dari server dan bisa dipakai untuk cek transaksi/tracking.
            </p>
          </div>
        </div>

        {orderAlert && (
          <div className="px-4 pb-4">
            <div className={`${orderAlert.bgColor} ${orderAlert.borderColor} rounded-2xl border p-4`}>
              <div className="flex items-start gap-3">
                <span className="text-xl" aria-hidden="true">{orderAlert.icon}</span>
                <div>
                  <p className={`${orderAlert.textColor} font-semibold`}>{orderAlert.title}</p>
                  <p className={`${orderAlert.textColor} mt-1 text-sm leading-relaxed`}>
                    {orderAlert.message}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Order Details */}
        <div className="px-4 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Detail Pesanan</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Status</span>
              <span className={`${statusConfig.bgColor} ${statusConfig.textColor} px-2 py-1 rounded-full text-xs font-medium text-right`}>
                {statusConfig.text}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Metode Pengiriman</span>
              <span className="text-gray-900">
                {latestTransaction?.deliveryType === 'delivery' ? 'Kirim ke tujuan' : 'Ambil di toko'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Metode Pembayaran</span>
              <span className="text-gray-900">
                {getPaymentMethodLabel(latestTransaction?.paymentMethod)}
              </span>
            </div>
            {latestTransaction?.deliveryType === 'delivery' && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Estimasi Pengiriman</span>
                <span className="text-gray-900">
                  {latestTransaction.shipmentAddress?.estimatedDelivery || 'Belum tersedia'}
                </span>
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
                <p className="font-medium text-gray-900">
                  {isPendingPayment
                    ? 'Menunggu Pembayaran'
                    : isFailedPayment
                      ? 'Pembayaran Perlu Diulang'
                      : 'Pesanan Sudah Masuk Sistem'}
                </p>
                <p className="text-sm text-gray-600">
                  {isPendingPayment
                    ? isManualQrisPayment
                      ? 'Scan QRIS resmi Toko Herbal Amimum di detail transaksi, bayar sesuai nominal, lalu tunggu konfirmasi admin.'
                      : `Silakan selesaikan pembayaran ${getPaymentMethodLabel(latestTransaction?.paymentMethod).toLowerCase()} untuk melanjutkan pesanan.`
                    : isFailedPayment
                      ? 'Silakan cek riwayat transaksi untuk mencoba pembayaran ulang jika tersedia.'
                      : 'Pesanan sudah tercatat dan bisa dipantau dari halaman transaksi.'}
                </p>
              </div>
            </div>
            
            {isPendingPayment && (
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <GoPackage className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Setelah Pembayaran Berhasil</p>
                  <p className="text-sm text-gray-600">
                    Setelah pembayaran berhasil, status pesanan akan diperbarui oleh sistem/admin dan bisa dipantau dari halaman transaksi.
                  </p>
                </div>
              </div>
            )}

            {!isPendingPayment && !isFailedPayment && latestTransaction?.deliveryType === 'delivery' && (
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <GoPackage className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Pesanan Diproses</p>
                  <p className="text-sm text-gray-600">
                    {latestTransaction?.shipmentAddress
                      ? `${latestTransaction.shipmentAddress.courier} ${latestTransaction.shipmentAddress.service} akan digunakan untuk pengiriman setelah admin memproses pesanan.`
                      : 'Kami akan memproses dan mengirim pesanan Anda'}
                  </p>
                </div>
              </div>
            )}

            {!isPendingPayment && !isFailedPayment && latestTransaction?.deliveryType === 'pickup' && (
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <GoLocation className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Siap Diambil</p>
                  <p className="text-sm text-gray-600">
                    Pesanan pickup akan disiapkan toko sesuai status transaksi.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-4 py-6 space-y-3">
          {isPendingPayment && !isFailedPayment && (
            <button
              onClick={handleContinuePayment}
              className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-[#005A3C] transition-colors"
            >
              {isManualQrisPayment ? 'Lihat QRIS Pembayaran' : 'Lanjutkan Pembayaran'}
            </button>
          )}
          <button
            onClick={handleViewOrders}
            className={`${isPendingPayment ? 'w-full bg-gray-100 text-gray-700 hover:bg-gray-200' : 'w-full bg-primary text-white hover:bg-[#005A3C]'} py-3 px-4 rounded-lg font-medium transition-colors`}
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
            <p className="text-xs leading-relaxed text-gray-500">
              Simpan ID pesanan ini. Jika membutuhkan bantuan, sampaikan ID pesanan ke admin melalui kanal resmi toko.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
