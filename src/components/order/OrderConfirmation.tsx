'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { GoCheckCircle, GoPackage, GoCreditCard, GoLocation } from 'react-icons/go';
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

const getCustomerSafeNote = (notes?: string) => {
  const sanitized = notes
    ?.replace(/\[(?:PAYMENT|SHIPPING_FEE_PAYMENT|SHIPPING_DUE_ON_DELIVERY|POS_SUBTOTAL|POS_DISCOUNT|POS_TOTAL):[^\]]*\]/gi, '')
    .split('|')
    .map((part) => part.trim())
    .filter(Boolean)
    .join(' | ');

  return sanitized || undefined;
};

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
    latestTransaction?.paymentMethod,
    latestTransaction?.deliveryType || 'delivery'
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
  const customerSafeNote = getCustomerSafeNote(
    latestTransaction?.notes || additionalNotes
  );
  const isPickupOrder = latestTransaction?.deliveryType === 'pickup';
  const isDeliveryOrder = latestTransaction?.deliveryType === 'delivery';
  const paymentMethodLabel = getPaymentMethodLabel(latestTransaction?.paymentMethod);

  if (isResolvingTransaction) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-transparent px-4">
        <div className="rounded-3xl bg-white/95 p-8 text-center shadow-[0_8px_22px_rgba(15,23,42,0.08)] ring-1 ring-emerald-100">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
          <p className="text-sm text-[#6B7C73]">Memuat detail pesanan...</p>
        </div>
      </div>
    );
  }

  if (!latestTransaction) {
    return (
      <div className="min-h-screen bg-transparent px-4 py-5 pb-[calc(6.5rem+env(safe-area-inset-bottom))]">
        <div className="mx-auto max-w-sm">
          <section className="rounded-3xl bg-white/95 p-5 text-center shadow-[0_8px_22px_rgba(15,23,42,0.08)] ring-1 ring-emerald-100">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-yellow-50 ring-8 ring-yellow-50/60">
              <GoPackage className="h-10 w-10 text-yellow-600" />
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">Checkout</p>
            <h1 className="mt-2 text-xl font-black text-[#0D0E09]">Belum Ada Pesanan Baru</h1>
            <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-[#6B7C73]">
              Halaman konfirmasi hanya tampil setelah checkout berhasil dan ID pesanan valid tersedia dari server toko.
            </p>
            <div className="mt-5 grid gap-3">
              <button
                onClick={() => router.push('/cart')}
                className="w-full rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#005A3C]"
              >
                Lihat Keranjang
              </button>
              <button
                onClick={handleViewOrders}
                className="w-full rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-primary transition-colors hover:bg-emerald-100"
              >
                Cek Riwayat Transaksi
              </button>
              <button
                onClick={handleBackToHome}
                className="w-full rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-sm font-semibold text-[#0D0E09] transition-colors hover:bg-emerald-50"
              >
                Kembali ke Beranda
              </button>
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent px-4 py-5 pb-[calc(6.5rem+env(safe-area-inset-bottom))]">
      <div className="mx-auto max-w-sm space-y-4">
        <section className="rounded-3xl bg-white/95 p-5 text-center shadow-[0_8px_22px_rgba(15,23,42,0.08)] ring-1 ring-emerald-100">
          <div className="relative mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-green-50 ring-8 ring-green-50/70">
            <IoCheckmarkCircle className="h-16 w-16 text-green-500" />
            <div className="absolute -right-1 -top-1 flex h-8 w-8 items-center justify-center rounded-full bg-green-500">
              <GoCheckCircle className="h-5 w-5 text-white" />
            </div>
          </div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">Checkout berhasil</p>
          <h1 className="mt-2 text-2xl font-black leading-tight text-[#0D0E09]">
            {isPendingPayment ? 'Pesanan Dibuat, Menunggu Bayar' : 'Pesanan Tercatat di Sistem'}
          </h1>
          <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-[#6B7C73]">
            Terima kasih telah berbelanja di Toko Herbal Amimum. Detail pesanan tersimpan di server toko.
          </p>
          <div className="mt-5 rounded-3xl border border-green-100 bg-green-50/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-green-700">ID Pesanan</p>
            <p className="mt-1 break-all text-sm font-bold text-green-900">
              {latestTransaction?.transactionId || orderId}
            </p>
            <p className="mt-1 text-xs leading-5 text-green-700">
              Simpan ID ini untuk cek transaksi, tracking, atau bantuan admin.
            </p>
          </div>
        </section>

        {orderAlert && (
          <div>
            <div className={`${orderAlert.bgColor} ${orderAlert.borderColor} rounded-3xl border p-4 shadow-[0_8px_22px_rgba(15,23,42,0.06)]`}>
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

        <section className="rounded-3xl bg-white/95 p-4 shadow-[0_8px_22px_rgba(15,23,42,0.08)] ring-1 ring-emerald-50">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">Ringkasan</p>
          <h2 className="mt-1 text-lg font-bold text-[#0D0E09]">Detail Pesanan</h2>
          <div className="mt-4 space-y-3">
            <div className="flex items-start justify-between gap-4 rounded-2xl bg-emerald-50/50 px-3 py-2">
              <span className="text-sm text-[#6B7C73]">Status</span>
              <span className={`${statusConfig.bgColor} ${statusConfig.textColor} px-2 py-1 rounded-full text-xs font-medium text-right`}>
                {statusConfig.text}
              </span>
            </div>
            <div className="flex items-start justify-between gap-4 rounded-2xl bg-emerald-50/50 px-3 py-2">
              <span className="text-sm text-[#6B7C73]">Metode Pengiriman</span>
              <span className="text-right text-sm font-semibold text-[#0D0E09]">
                {isDeliveryOrder ? 'Kirim ke tujuan' : 'Ambil di toko'}
              </span>
            </div>
            <div className="flex items-start justify-between gap-4 rounded-2xl bg-emerald-50/50 px-3 py-2">
              <span className="text-sm text-[#6B7C73]">Metode Pembayaran</span>
              <span className="text-right text-sm font-semibold text-[#0D0E09]">
                {paymentMethodLabel}
              </span>
            </div>
            {isDeliveryOrder && (
              <div className="flex items-start justify-between gap-4 rounded-2xl bg-emerald-50/50 px-3 py-2">
                <span className="text-sm text-[#6B7C73]">Estimasi Pengiriman</span>
                <span className="text-right text-sm font-semibold text-[#0D0E09]">
                  {latestTransaction.shipmentAddress?.estimatedDelivery || 'Belum tersedia'}
                </span>
              </div>
            )}
            {isPickupOrder && (
              <div className="flex items-start justify-between gap-4 rounded-2xl bg-emerald-50/50 px-3 py-2">
                <span className="text-sm text-[#6B7C73]">Pengambilan</span>
                <span className="text-right text-sm font-semibold text-[#0D0E09]">Siap diambil</span>
              </div>
            )}
            {customerSafeNote && (
              <div className="rounded-2xl bg-emerald-50/70 px-3 py-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Catatan customer</p>
                <p className="mt-1 text-sm leading-6 text-[#0D0E09]">&ldquo;{customerSafeNote}&rdquo;</p>
              </div>
            )}
          </div>
        </section>

        <section className="rounded-3xl bg-white/95 p-4 shadow-[0_8px_22px_rgba(15,23,42,0.08)] ring-1 ring-emerald-50">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">Panduan</p>
          <h2 className="mt-1 text-lg font-bold text-[#0D0E09]">Langkah Selanjutnya</h2>
          <div className="mt-4 space-y-4">
            <div className="flex items-start gap-3 rounded-3xl bg-emerald-50/60 p-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                <GoCreditCard className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-[#0D0E09]">
                  {isPendingPayment
                    ? 'Menunggu Pembayaran'
                    : isFailedPayment
                      ? 'Pembayaran Perlu Diulang'
                      : 'Pesanan Sudah Masuk Sistem'}
                </p>
                <p className="text-sm leading-6 text-[#6B7C73]">
                  {isPendingPayment
                    ? isManualQrisPayment
                      ? 'Buka detail transaksi untuk melihat QRIS resmi Toko Herbal Amimum, bayar sesuai nominal, lalu tunggu konfirmasi admin.'
                      : `Silakan selesaikan pembayaran ${paymentMethodLabel.toLowerCase()} dari detail transaksi agar pesanan bisa diproses toko.`
                    : isFailedPayment
                      ? 'Silakan cek riwayat transaksi untuk mencoba pembayaran ulang jika tersedia.'
                      : 'Pesanan sudah tercatat dan bisa dipantau dari halaman transaksi.'}
                </p>
              </div>
            </div>
            
            {isPendingPayment && (
              <div className="flex items-start gap-3 rounded-3xl bg-emerald-50/60 p-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-orange-100">
                  <GoPackage className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <p className="font-semibold text-[#0D0E09]">Setelah Pembayaran Berhasil</p>
                  <p className="text-sm leading-6 text-[#6B7C73]">
                    Setelah pembayaran berhasil, status pesanan akan diperbarui oleh sistem/admin dan bisa dipantau dari halaman transaksi.
                  </p>
                </div>
              </div>
            )}

            {!isPendingPayment && !isFailedPayment && latestTransaction?.deliveryType === 'delivery' && (
              <div className="flex items-start gap-3 rounded-3xl bg-emerald-50/60 p-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-orange-100">
                  <GoPackage className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <p className="font-semibold text-[#0D0E09]">Pesanan Diproses</p>
                  <p className="text-sm leading-6 text-[#6B7C73]">
                    {latestTransaction?.shipmentAddress
                      ? `${latestTransaction.shipmentAddress.courier} ${latestTransaction.shipmentAddress.service} akan digunakan untuk pengiriman setelah admin memproses pesanan.`
                      : 'Admin akan memproses pesanan dan memasukkan resi resmi setelah paket diserahkan ke kurir.'}
                  </p>
                </div>
              </div>
            )}

            {!isPendingPayment && !isFailedPayment && latestTransaction?.deliveryType === 'pickup' && (
              <div className="flex items-start gap-3 rounded-3xl bg-emerald-50/60 p-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-green-100">
                  <GoLocation className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-[#0D0E09]">Siap Diambil</p>
                  <p className="text-sm leading-6 text-[#6B7C73]">
                    Pesanan pickup akan disiapkan toko. Datang ke toko setelah status transaksi menyatakan siap diambil.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="space-y-3 rounded-3xl bg-white/95 p-4 shadow-[0_8px_22px_rgba(15,23,42,0.08)] ring-1 ring-emerald-50">
          {isPendingPayment && !isFailedPayment && (
            <button
              onClick={handleContinuePayment}
              className="w-full rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#005A3C]"
            >
              {isManualQrisPayment ? 'Lihat QRIS Pembayaran' : 'Lanjutkan Pembayaran'}
            </button>
          )}
          <button
            onClick={handleViewOrders}
            className={`${isPendingPayment ? 'w-full bg-emerald-50 text-primary hover:bg-emerald-100' : 'w-full bg-primary text-white hover:bg-[#005A3C]'} rounded-2xl px-4 py-3 text-sm font-semibold transition-colors`}
          >
            Lihat Pesanan Saya
          </button>
          
          {/* Only show "Lacak Pesanan" for delivery orders */}
          {isDeliveryOrder && (
            <button
              onClick={handleTrackOrder}
              className="w-full rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-primary transition-colors hover:bg-emerald-100"
            >
              Lacak Pesanan
            </button>
          )}
          
          <button
            onClick={handleBackToHome}
            className="w-full rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-sm font-semibold text-primary transition-colors hover:bg-emerald-50"
          >
            Kembali ke Beranda
          </button>
        </section>

        <section className="rounded-3xl bg-emerald-50/80 p-4 text-center ring-1 ring-emerald-100">
          <p className="text-sm font-bold text-[#0D0E09]">Butuh bantuan?</p>
          <p className="mt-1 text-xs leading-5 text-[#6B7C73]">
            Simpan ID pesanan ini. Jika membutuhkan bantuan, sampaikan ID pesanan ke admin melalui kanal resmi toko.
          </p>
        </section>
      </div>
    </div>
  );
};

export default OrderConfirmation;
