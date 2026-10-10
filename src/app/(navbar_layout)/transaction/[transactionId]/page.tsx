"use client";

import React, { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "react-hot-toast";
import UnifiedHeader from "@/components/common/UnifiedHeader";
import LoginProtection from "@/components/common/LoginProtection";
import rupiahFormater from "@/utils/rupiahFormater";
import {
  getPaymentMethodLabel,
  isManualBankTransferPaymentMethod,
  isManualQrisPaymentMethod,
  isMidtransOnlinePaymentMethod,
  QRIS_MANUAL_IMAGE_PATH,
  STORE_BANK_ACCOUNT,
  STORE_BANK_ACCOUNT_TEXT,
} from "@/lib/paymentMethods";
import { Transaction } from "@/types/transaction";
import { SessionManager } from "@/lib/auth";
import {
  getOrderDetail,
  mapOrderDetailToTransaction,
  submitQrisPaymentConfirmation,
} from "@/services/api/orders";
import { createPayment, syncPaymentStatus } from "@/services/api/payments";
import { useTransaction } from "@/contexts/TransactionContext";
import {
  getCustomerOrderAlert,
  getCustomerStatusConfig,
  isFailedPaymentStatus,
  isOfflinePaymentMethod,
  isPendingPaymentStatus,
} from "@/lib/transactionStatus";

const BACKEND_ORDER_ID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const getCustomerSafeNote = (notes?: string) => {
  const sanitized = notes
    ?.replace(/\[(?:PAYMENT|SHIPPING_FEE_PAYMENT|SHIPPING_DUE_ON_DELIVERY|POS_SUBTOTAL|POS_DISCOUNT|POS_TOTAL):[^\]]*\]/gi, "")
    .replace(/\[(?:PAYMENT|SHIPPING_FEE_PAYMENT|SHIPPING_DUE_ON_DELIVERY|POS_[A-Z_]*)[^\]|]*/gi, "")
    .split("|")
    .map((part) => part.trim())
    .filter(Boolean)
    .join(" | ");

  return sanitized || undefined;
};

const getTrackingDisplay = (trackingNumber?: string) =>
  trackingNumber?.trim() || "Belum tersedia";

const TransactionDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const transactionId = params?.transactionId as string;
  const { getTransactionById } = useTransaction();

  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaymentActionLoading, setIsPaymentActionLoading] = useState(false);
  const [isAutoSyncingPaymentStatus, setIsAutoSyncingPaymentStatus] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const autoSyncedOrderIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const loadOrderDetail = async () => {
      if (!transactionId) {
        setIsLoading(false);
        return;
      }

      if (!SessionManager.isAuthenticated()) {
        setTransaction(null);
        setErrorMessage(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setErrorMessage(null);

      try {
        if (BACKEND_ORDER_ID_PATTERN.test(transactionId)) {
          const response = await getOrderDetail(transactionId);
          setTransaction(mapOrderDetailToTransaction(response.data));
          return;
        }

        const localTransaction = getTransactionById(transactionId);
        if (localTransaction) {
          setTransaction(localTransaction);
          return;
        }

        throw new Error("Transaksi belum tersimpan di server. Silakan cek halaman transaksi terbaru atau ulangi checkout dari keranjang.");
      } catch {
        setErrorMessage("Detail transaksi belum bisa dimuat. Silakan cek riwayat transaksi terbaru atau coba lagi beberapa saat lagi.");
      } finally {
        setIsLoading(false);
      }
    };

    void loadOrderDetail();
  }, [transactionId, getTransactionById]);

  const handleBack = () => {
    router.back();
  };

  const handleTrackShipment = () => {
    if (!transaction) {
      return;
    }

    router.push(`/track-order?transactionId=${transaction.id}`);
  };

  const handleDownloadInvoice = () => {
    if (!transaction) {
      toast.error("Data transaksi tidak ditemukan.");
      return;
    }

    const customerStatus = getCustomerStatusConfig(
      transaction.status,
      transaction.paymentMethod
    ).text;

    const deliveryLabel =
      transaction.deliveryType === "delivery" ? "Kirim ke tujuan" : "Ambil di toko";
    const shipment = transaction.shipmentAddress;
    const customerSafeNote = getCustomerSafeNote(transaction.notes);
    const shippingFeeModeLabel = transaction.shippingDueOnDelivery && transaction.shippingDueOnDelivery > 0
      ? "Bayar ongkir saat paket tiba"
      : transaction.deliveryType === "delivery"
        ? "Ongkir digabung ke total produk"
        : "-";
    const invoiceFulfillmentLines = transaction.deliveryType === "delivery"
      ? [
          "Detail Pengiriman",
          "----------------------------------------",
          `Penerima       : ${shipment?.recipientName || "-"}`,
          `Telepon        : ${shipment?.phone || "-"}`,
          `Alamat         : ${shipment?.address || "-"}`,
          `Kota/Kode Pos  : ${[shipment?.city, shipment?.postalCode].filter(Boolean).join(" ") || "-"}`,
          `Kurir          : ${[shipment?.courier, shipment?.service].filter(Boolean).join(" - ") || "-"}`,
          `Estimasi       : ${shipment?.estimatedDelivery || "-"}`,
          `No. Resi       : ${shipment?.trackingNumber || "Belum tersedia"}`,
        ]
      : [
          "Detail Pengambilan",
          "----------------------------------------",
          "Metode         : Ambil langsung di toko",
          "Status         : Tidak memakai kurir atau nomor resi",
          "Catatan        : Datang ke toko setelah status pesanan siap diambil.",
        ];

    const invoiceLines = [
      "TOKO HERBAL AMIMUM",
      "Bukti Transaksi Customer",
      "Shopee         : https://shopee.co.id/tokoherbalamimum",
      "Tokopedia      : https://www.tokopedia.com/herbalamimum",
      "========================================",
      `Invoice ID     : ${transaction.transactionId}`,
      `Tanggal        : ${transaction.date}`,
      `Status         : ${customerStatus}`,
      `Metode Bayar   : ${getPaymentMethodLabel(transaction.paymentMethod)}`,
      ...(isManualBankTransferPaymentMethod(transaction.paymentMethod)
        ? [
            `Rekening       : ${STORE_BANK_ACCOUNT.bank} ${STORE_BANK_ACCOUNT.number}`,
            `Atas Nama      : ${STORE_BANK_ACCOUNT.accountName}`,
          ]
        : []),
      `Pengiriman     : ${deliveryLabel}`,
      "",
      "Rincian Item",
      "----------------------------------------",
      ...transaction.items.map((item, index) => {
        const itemSubtotal = item.price * item.quantity;
        return `${index + 1}. ${item.name}${item.variantName ? ` (${item.variantName})` : ""}\n   Qty ${item.quantity} x ${rupiahFormater(item.price)} = ${rupiahFormater(itemSubtotal)}`;
      }),
      "",
      "Ringkasan Pembayaran",
      "----------------------------------------",
      `Subtotal       : ${rupiahFormater(transaction.subtotal)}`,
      `Ongkir         : ${rupiahFormater(transaction.shippingCost)}`,
      `Cara Bayar Ongkir: ${shippingFeeModeLabel}`,
      ...(transaction.shippingDueOnDelivery && transaction.shippingDueOnDelivery > 0
        ? [`Ongkir Bayar Tiba: ${rupiahFormater(transaction.shippingDueOnDelivery)}`]
        : []),
      `Total          : ${rupiahFormater(transaction.total)}`,
      "",
      ...invoiceFulfillmentLines,
      "",
      "Catatan",
      "----------------------------------------",
      customerSafeNote || "Simpan bukti transaksi ini untuk arsip atau kebutuhan komplain/retur sesuai kebijakan toko.",
      "",
      "Terima kasih sudah berbelanja di Toko Herbal Amimum.",
    ].join("\n");

    const blob = new Blob([invoiceLines], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${transaction.transactionId}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Invoice berhasil didownload!");
  };

  const isLocalSimulatedTransaction = Boolean(
    transaction?.id.startsWith("trans-") || transaction?.id.startsWith("ORD-")
  );

  const refreshOrderDetail = async () => {
    if (!transaction || isLocalSimulatedTransaction) {
      return;
    }

    const response = await getOrderDetail(transaction.id);
    setTransaction(mapOrderDetailToTransaction(response.data));
  };

  useEffect(() => {
    const autoSyncMidtransPayment = async () => {
      if (
        !transaction ||
        isLocalSimulatedTransaction ||
        !BACKEND_ORDER_ID_PATTERN.test(transaction.id) ||
        transaction.status !== "pending" ||
        !isMidtransOnlinePaymentMethod(transaction.paymentMethod) ||
        autoSyncedOrderIdsRef.current.has(transaction.id)
      ) {
        return;
      }

      autoSyncedOrderIdsRef.current.add(transaction.id);
      setIsAutoSyncingPaymentStatus(true);

      try {
        await syncPaymentStatus({ order_id: transaction.id });
        const response = await getOrderDetail(transaction.id);
        const updatedTransaction = mapOrderDetailToTransaction(response.data);
        setTransaction(updatedTransaction);

        if (updatedTransaction.status !== "pending") {
          toast.success("Status pembayaran diperbarui.");
        }
      } catch {
        // Fail quietly so customer can still use the manual refresh/payment action.
      } finally {
        setIsAutoSyncingPaymentStatus(false);
      }
    };

    void autoSyncMidtransPayment();
  }, [transaction, isLocalSimulatedTransaction]);

  const handlePayNow = async () => {
    if (!transaction) {
      return;
    }

    if (isLocalSimulatedTransaction) {
      toast.error("Data transaksi lokal lama tidak bisa dibayar ulang. Gunakan transaksi backend baru untuk melanjutkan pembayaran resmi Midtrans.");
      return;
    }

    setIsPaymentActionLoading(true);
    try {
      const paymentResponse = await createPayment({ order_id: transaction.id });
      if (paymentResponse.data.redirect_url) {
        window.location.href = paymentResponse.data.redirect_url;
        return;
      }
      toast.success("Pembayaran dibuat. Silakan cek status pesanan.");
      await refreshOrderDetail();
    } catch {
      toast.error("Pembayaran belum bisa dibuka. Silakan coba lagi atau hubungi admin bila tetap gagal.");
    } finally {
      setIsPaymentActionLoading(false);
    }
  };

  const handleSyncPaymentStatus = async () => {
    if (!transaction || isLocalSimulatedTransaction) {
      return;
    }

    setIsPaymentActionLoading(true);
    try {
      await syncPaymentStatus({ order_id: transaction.id });
      await refreshOrderDetail();
      toast.success("Status pembayaran diperbarui.");
    } catch {
      toast.error("Status pembayaran belum bisa diperbarui. Silakan coba lagi beberapa saat lagi.");
    } finally {
      setIsPaymentActionLoading(false);
    }
  };

  const handleConfirmManualQrisPayment = async () => {
    if (!transaction || isLocalSimulatedTransaction) {
      toast.error("Konfirmasi QRIS hanya tersedia untuk transaksi server.");
      return;
    }

    setIsPaymentActionLoading(true);
    try {
      const response = await submitQrisPaymentConfirmation(transaction.id);
      if (response.data.admin_notified) {
        toast.success("Konfirmasi QRIS terkirim ke admin. Pesanan akan diverifikasi dari mutasi QRIS toko.");
      } else {
        toast.success("Konfirmasi QRIS tercatat. Jika belum ada notifikasi admin, simpan bukti pembayaran dan hubungi admin.");
      }
      await refreshOrderDetail();
    } catch {
      toast.error("Konfirmasi QRIS belum bisa dikirim. Simpan bukti pembayaran dan coba lagi beberapa saat lagi.");
    } finally {
      setIsPaymentActionLoading(false);
    }
  };


  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <span className="loader mb-4" aria-label="Memuat..." />
        <p className="text-[#6B7C73] text-lg font-medium">
          Memuat halaman, mohon tunggu sebentar...
        </p>
      </div>
    );
  }

  if (!transaction || errorMessage) {
    return (
      <LoginProtection useModal={true} feature="transaction">
        <div className="min-h-screen bg-transparent">
          <UnifiedHeader
            type="secondary"
            title="Detail Transaksi"
            showBackButton={true}
            onBack={handleBack}
          />
          <div className="flex flex-col items-center justify-center min-h-[420px] px-4">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-emerald-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-[#0D0E09] mb-2">
              Transaksi Tidak Ditemukan
            </h3>
            <p className="max-w-xs break-words text-center text-sm leading-relaxed text-[#6B7C73]">
              {errorMessage || "Transaksi tidak ditemukan. Silakan cek riwayat transaksi terbaru."}
            </p>
            <div className="mt-5 grid w-full max-w-xs gap-3">
              <button
                onClick={() => router.push("/transaction")}
                className="w-full rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
              >
                Cek Transaksi Terbaru
              </button>
              <button
                onClick={() => router.push("/cart")}
                className="w-full rounded-2xl border border-emerald-100 px-4 py-3 text-sm font-semibold text-[#0D0E09] transition-colors hover:bg-emerald-50"
              >
                Kembali ke Keranjang
              </button>
            </div>
          </div>
        </div>
      </LoginProtection>
    );
  }

  const statusConfig = getCustomerStatusConfig(
    transaction.status,
    transaction.paymentMethod
  );
  const isPendingPayment = isPendingPaymentStatus(transaction.status);
  const canRetryPayment = isFailedPaymentStatus(transaction.status);
  const isOfflinePayment = isOfflinePaymentMethod(transaction.paymentMethod);
  const isManualQrisPayment = isManualQrisPaymentMethod(transaction.paymentMethod);
  const isManualBankTransferPayment = isManualBankTransferPaymentMethod(transaction.paymentMethod);
  const shouldShowPaymentActions =
    !isLocalSimulatedTransaction && !isOfflinePayment && !isManualQrisPayment && !isManualBankTransferPayment && (isPendingPayment || canRetryPayment);
  const normalizedStatus = String(transaction.status || '').toLowerCase();
  const transactionGuidance = isManualQrisPayment && isPendingPayment
    ? "Pesanan QRIS sudah tercatat. Scan QRIS resmi toko, bayar sesuai nominal total, lalu tunggu admin mengonfirmasi pembayaran."
    : isManualBankTransferPayment && isPendingPayment
      ? `Pesanan transfer sudah tercatat. Transfer sesuai nominal total ke ${STORE_BANK_ACCOUNT_TEXT}, lalu kirim bukti pembayaran ke admin WhatsApp untuk diverifikasi.`
      : isPendingPayment
    ? "Pesanan sudah tercatat. Selesaikan pembayaran agar pesanan bisa diproses toko."
    : canRetryPayment
      ? "Pembayaran belum berhasil. Coba bayar lagi atau hubungi admin jika butuh bantuan."
      : ['paid', 'capture', 'settlement'].includes(normalizedStatus)
      ? transaction.deliveryType === "pickup"
        ? "Pembayaran sudah diterima. Pesanan ambil di toko menunggu admin menyiapkan barang. Datang ke toko setelah status siap diambil."
        : "Pembayaran sudah diterima. Pesanan menunggu admin memproses dan menyiapkan pengiriman."
        : transaction.deliveryType === "delivery"
        ? transaction.status === "shipped"
          ? "Pesanan sedang dikirim. Gunakan nomor resi di halaman tracking untuk memantau pengiriman."
          : transaction.status === "completed" || transaction.status === "delivered"
            ? "Pesanan selesai. Terima kasih sudah berbelanja di Toko Herbal Amimum."
            : "Pesanan sedang diproses toko. Resi akan tersedia setelah admin mengirim pesanan."
        : "Pesanan pickup sedang disiapkan toko. Ambil pesanan setelah status siap diambil.";
  const orderAlert = getCustomerOrderAlert(
    transaction.status,
    transaction.shipmentAddress?.trackingNumber,
    transaction.deliveryType || "delivery"
  );
  const deliveryLabel =
    transaction.deliveryType === "delivery" ? "Kirim ke tujuan" : "Ambil di toko";
  const trackingDisplay = getTrackingDisplay(transaction.shipmentAddress?.trackingNumber);
  const customerSafeNote = getCustomerSafeNote(transaction.notes);

  return (
    <LoginProtection useModal={true} feature="transaction">
    <div className="min-h-screen bg-transparent">
      <UnifiedHeader
        type="secondary"
        title="Detail Transaksi"
        subtitle="Informasi lengkap transaksi"
        showBackButton={true}
        onBack={handleBack}
      />

      <div className="px-4 py-5 pb-[calc(6.5rem+env(safe-area-inset-bottom))]">
        <div className="mx-auto max-w-md space-y-4">
          <div
            className={`rounded-3xl border ${orderAlert.borderColor} ${orderAlert.bgColor} p-4 shadow-[0_8px_22px_rgba(15,23,42,0.06)]`}
          >
            <div className="flex items-start gap-3">
              <span className="text-xl" aria-hidden="true">
                {orderAlert.icon}
              </span>
              <div className="min-w-0">
                <h2 className={`break-words text-sm font-semibold ${orderAlert.textColor}`}>
                  {orderAlert.title}
                </h2>
                <p className={`mt-1 text-xs leading-relaxed ${orderAlert.textColor}`}>
                  {orderAlert.message}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white/95 p-4 shadow-[0_8px_22px_rgba(15,23,42,0.08)] ring-1 ring-emerald-50">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">Status order</p>
                <h2 className="mt-1 text-lg font-bold text-[#0D0E09]">
                  Detail Transaksi
                </h2>
              </div>
              <div
                className={`px-3 py-1 rounded-full ${statusConfig.bgColor} ${statusConfig.borderColor} border`}
              >
                <span className={`text-sm font-medium ${statusConfig.textColor}`}>
                  {statusConfig.text}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="rounded-2xl bg-emerald-50/50 px-3 py-2">
                <p className="text-xs text-[#6B7C73]">ID Transaksi</p>
                <p className="mt-1 break-all text-sm font-semibold text-[#0D0E09]">
                  {transaction.transactionId}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-2xl bg-emerald-50/50 px-3 py-2">
                  <p className="text-xs text-[#6B7C73]">Tanggal</p>
                  <p className="mt-1 break-words text-sm font-semibold text-[#0D0E09]">
                    {transaction.date}
                  </p>
                </div>
                <div className="rounded-2xl bg-emerald-50/50 px-3 py-2">
                  <p className="text-xs text-[#6B7C73]">Metode bayar</p>
                  <p className="mt-1 break-words text-sm font-semibold text-[#0D0E09]">
                    {getPaymentMethodLabel(transaction.paymentMethod)}
                  </p>
                </div>
                <div className="rounded-2xl bg-emerald-50/50 px-3 py-2">
                  <p className="text-xs text-[#6B7C73]">Subtotal</p>
                  <p className="mt-1 text-sm font-semibold text-[#0D0E09]">
                    {rupiahFormater(transaction.subtotal)}
                  </p>
                </div>
                <div className="rounded-2xl bg-emerald-50/50 px-3 py-2">
                  <p className="text-xs text-[#6B7C73]">Ongkir</p>
                  <p className="mt-1 text-sm font-semibold text-[#0D0E09]">
                    {rupiahFormater(transaction.shippingCost)}
                  </p>
                </div>
              </div>
              {transaction.deliveryType === "delivery" && (
                <div className="rounded-2xl bg-orange-50 px-3 py-2 text-xs font-medium text-orange-800">
                  {transaction.shippingDueOnDelivery && transaction.shippingDueOnDelivery > 0
                    ? `Ongkir ${rupiahFormater(transaction.shippingDueOnDelivery)} dibayar saat paket tiba. Total di bawah hanya pembayaran produk/metode toko.`
                    : "Ongkir digabung ke total pembayaran produk."}
                </div>
              )}
              <div className="rounded-2xl bg-primary/10 px-3 py-2">
                <p className="text-xs text-primary/80">Total pembayaran toko</p>
                <p className="mt-1 text-base font-bold text-primary">
                  {rupiahFormater(transaction.total)}
                </p>
              </div>
            </div>
            <div className="mt-4 rounded-2xl bg-primary/5 px-3 py-2 text-xs font-medium text-primary">
              {transactionGuidance}
            </div>
            {isAutoSyncingPaymentStatus && (
              <div className="mt-2 rounded-2xl bg-blue-50 px-3 py-2 text-xs font-medium text-blue-700">
                Sedang mengecek status pembayaran terbaru dari Midtrans...
              </div>
            )}
          </div>

          <div className="rounded-3xl bg-white/95 p-4 shadow-[0_8px_22px_rgba(15,23,42,0.08)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                  TOKO HERBAL AMIMUM
                </p>
                <h3 className="mt-1 text-lg font-semibold text-[#0D0E09]">
                  Bukti Transaksi Customer
                </h3>
                <p className="mt-1 text-xs text-[#6B7C73]">
                  Simpan bukti ini untuk arsip pembelian, komplain, atau retur sesuai kebijakan toko.
                </p>
              </div>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                Invoice
              </span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-2xl bg-emerald-50/50 p-3">
                <p className="text-[#6B7C73]">Invoice ID</p>
                <p className="mt-1 break-words font-semibold text-[#0D0E09]">
                  {transaction.transactionId}
                </p>
              </div>
              <div className="rounded-2xl bg-emerald-50/50 p-3">
                <p className="text-[#6B7C73]">Status</p>
                <p className="mt-1 font-semibold text-[#0D0E09]">{statusConfig.text}</p>
              </div>
              <div className="rounded-2xl bg-emerald-50/50 p-3">
                <p className="text-[#6B7C73]">Metode bayar</p>
                <p className="mt-1 font-semibold text-[#0D0E09]">
                  {getPaymentMethodLabel(transaction.paymentMethod)}
                </p>
              </div>
              <div className="rounded-2xl bg-emerald-50/50 p-3">
                <p className="text-[#6B7C73]">Pengiriman</p>
                <p className="mt-1 font-semibold text-[#0D0E09]">{deliveryLabel}</p>
              </div>
            </div>
          </div>


          {isManualQrisPayment && isPendingPayment && (
            <div className="rounded-3xl bg-white/95 p-4 shadow-[0_8px_22px_rgba(15,23,42,0.08)]">
              <div className="mb-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                  QRIS Resmi Toko Herbal Amimum
                </p>
                <h3 className="mt-1 text-lg font-semibold text-[#0D0E09]">
                  Scan QRIS untuk Membayar
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-[#6B7C73]">
                  Bayar sesuai nominal total pesanan. QRIS bisa digunakan melalui OVO, GoPay, DANA, ShopeePay, LinkAja, mobile banking, dan aplikasi QRIS lain.
                </p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-3">
                <Image
                  src={QRIS_MANUAL_IMAGE_PATH}
                  alt="QRIS resmi Toko Herbal Amimum"
                  width={360}
                  height={360}
                  className="mx-auto h-auto w-full max-w-[260px] rounded-2xl"
                  priority={false}
                />
              </div>
              <div className="mt-3 rounded-2xl bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
                <p className="font-semibold">Total yang dibayar: {rupiahFormater(transaction.total)}</p>
                <p className="mt-1 text-xs leading-relaxed">
                  Setelah transfer/scan berhasil, simpan bukti pembayaran. Admin akan memverifikasi pembayaran dan mengubah status pesanan sebelum diproses.
                </p>
              </div>
              <button
                type="button"
                onClick={handleConfirmManualQrisPayment}
                disabled={isPaymentActionLoading || isLocalSimulatedTransaction}
                className="mt-3 w-full rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPaymentActionLoading ? "Mengirim Konfirmasi..." : "Saya Sudah Bayar QRIS"}
              </button>
              <p className="mt-2 text-center text-[11px] leading-relaxed text-[#6B7C73]">
                Tombol ini mengirim notifikasi ke admin. Status order berubah setelah admin memverifikasi dana masuk.
              </p>
            </div>
          )}

          {isManualBankTransferPayment && isPendingPayment && (
            <div className="rounded-3xl bg-white/95 p-4 shadow-[0_8px_22px_rgba(15,23,42,0.08)]">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                Transfer Bank Manual
              </p>
              <h3 className="mt-1 text-lg font-semibold text-[#0D0E09]">
                Transfer ke Rekening Resmi Toko
              </h3>
              <div className="mt-3 rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-900">
                <div className="flex items-start justify-between gap-3">
                  <span className="shrink-0">Bank</span>
                  <strong className="break-words text-right">{STORE_BANK_ACCOUNT.bank}</strong>
                </div>
                <div className="mt-2 flex items-start justify-between gap-3">
                  <span className="shrink-0">No. Rekening</span>
                  <strong className="break-all text-right">{STORE_BANK_ACCOUNT.number}</strong>
                </div>
                <div className="mt-2 flex items-start justify-between gap-3">
                  <span className="shrink-0">Atas Nama</span>
                  <strong className="break-words text-right">{STORE_BANK_ACCOUNT.accountName}</strong>
                </div>
                <div className="mt-3 border-t border-gray-100 pt-3">
                  <p className="font-semibold">Total yang dibayar: {rupiahFormater(transaction.total)}</p>
                  <p className="mt-1 text-xs leading-relaxed">
                    Transfer sesuai nominal total, simpan bukti pembayaran, lalu kirim bukti ke admin melalui WhatsApp agar pesanan segera diverifikasi.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="rounded-3xl bg-white/95 p-4 shadow-[0_8px_22px_rgba(15,23,42,0.08)]">
            <h3 className="text-lg font-semibold text-[#0D0E09] mb-3">
              Ringkasan Pesanan
            </h3>
            <div className="space-y-3">
              {transaction.items.map((item) => {
                const itemSubtotal = item.price * item.quantity;

                return (
                <div
                  key={item.id}
                  className="flex items-start gap-3 rounded-2xl bg-emerald-50/50 p-3"
                >
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-2xl bg-emerald-100">
                    <Image
                      src={item.image || "/default-image.jpg"}
                      alt={item.name}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                      unoptimized={false}
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        if (!target.src.endsWith('/default-image.jpg')) target.src = '/default-image.jpg';
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="break-words text-sm font-semibold leading-snug text-[#0D0E09]">
                      {item.name}
                    </h4>
                    <p className="text-xs text-[#6B7C73]">
                      {item.variantName ? `${item.variantName} • ` : ""}Qty:{" "}
                      {item.quantity}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#0D0E09]">
                      {rupiahFormater(item.price)} / item
                    </p>
                    <p className="text-xs font-semibold text-primary">
                      Subtotal item: {rupiahFormater(itemSubtotal)}
                    </p>
                  </div>
                </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-3xl bg-white/95 p-4 shadow-[0_8px_22px_rgba(15,23,42,0.08)]">
            <h3 className="text-lg font-semibold text-[#0D0E09] mb-3">
              Informasi Pengiriman
            </h3>
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-4">
                <span className="text-sm text-[#6B7C73]">Metode:</span>
                <span className="break-words text-right text-sm font-semibold text-[#0D0E09]">
                  {transaction.deliveryType === "delivery"
                    ? "Dikirim"
                    : "Ambil di Toko"}
                </span>
              </div>
              {transaction.deliveryType === "delivery" && (
                <>
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-sm text-[#6B7C73]">Alamat:</span>
                    <span className="break-words text-right text-sm font-semibold text-[#0D0E09]">
                      {transaction.shipmentAddress?.address || "Alamat tidak tersedia"}
                    </span>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-sm text-[#6B7C73]">Penerima:</span>
                    <span className="break-words text-right text-sm font-semibold text-[#0D0E09]">
                      {transaction.shipmentAddress?.recipientName || "-"}
                    </span>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-sm text-[#6B7C73]">Telepon:</span>
                    <span className="break-words text-right text-sm font-semibold text-[#0D0E09]">
                      {transaction.shipmentAddress?.phone || "-"}
                    </span>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-sm text-[#6B7C73]">Kurir:</span>
                    <span className="break-words text-right text-sm font-semibold text-[#0D0E09]">
                      {transaction.shipmentAddress?.courier || "-"}
                    </span>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-sm text-[#6B7C73]">Layanan:</span>
                    <span className="break-words text-right text-sm font-semibold text-[#0D0E09]">
                      {transaction.shipmentAddress?.service || "-"}
                    </span>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-sm text-[#6B7C73]">Estimasi:</span>
                    <span className="break-words text-right text-sm font-semibold text-[#0D0E09]">
                      {transaction.shipmentAddress?.estimatedDelivery || "-"}
                    </span>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-sm text-[#6B7C73]">No. Resi:</span>
                    <span className="break-words text-right text-sm font-semibold text-[#0D0E09]">
                      {trackingDisplay}
                    </span>
                  </div>
                  <p className="rounded-2xl bg-emerald-50/70 px-3 py-2 text-xs text-[#6B7C73]">
                    Resi tampil setelah admin mengirim paket dan memasukkan nomor resi dari kurir.
                  </p>
                </>
              )}
            </div>
          </div>

          {customerSafeNote && (
            <div className="rounded-3xl bg-white/95 p-4 shadow-[0_8px_22px_rgba(15,23,42,0.08)]">
              <h3 className="text-lg font-semibold text-[#0D0E09] mb-3">
                Catatan Tambahan
              </h3>
              <p className="break-words rounded-2xl bg-emerald-50/70 p-3 text-sm leading-relaxed text-[#0D0E09]">
                &ldquo;{customerSafeNote}&rdquo;
              </p>
            </div>
          )}

          <div className="rounded-3xl bg-white/95 p-4 shadow-[0_8px_22px_rgba(15,23,42,0.08)]">
            <div className="space-y-3">
              {isLocalSimulatedTransaction && isPendingPayment && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-800">
                  Data transaksi lokal lama tidak bisa dipakai sebagai pembayaran resmi. Gunakan transaksi backend baru untuk melanjutkan pembayaran Midtrans.
                </div>
              )}
              {shouldShowPaymentActions && (
                <>
                  <button
                    onClick={handlePayNow}
                    disabled={isPaymentActionLoading}
                    className="w-full rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {canRetryPayment ? "Coba Bayar Lagi" : "Lanjutkan Pembayaran"}
                  </button>
                  <button
                    onClick={handleSyncPaymentStatus}
                    disabled={isPaymentActionLoading}
                    className="w-full rounded-2xl border border-primary px-4 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Saya Sudah Bayar, Perbarui Status
                  </button>
                </>
              )}
              {transaction.deliveryType === "delivery" && (
                <button
                  onClick={handleTrackShipment}
                  className="w-full rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
                >
                  Lacak Pengiriman
                </button>
              )}
              <button
                onClick={handleDownloadInvoice}
                className="w-full rounded-2xl border border-emerald-100 px-4 py-3 text-sm font-semibold text-[#0D0E09] transition-colors hover:bg-emerald-50"
              >
                Download Invoice
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </LoginProtection>
  );
};

export default TransactionDetailPage;
