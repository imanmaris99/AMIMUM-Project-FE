"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  TrackOrderList,
  DeliveryAddress,
  StatusOrder,
} from "@/components/track-order";
import { Transaction } from "@/types/transaction";
import UnifiedHeader from "@/components/common/UnifiedHeader";
import LoginProtection from "@/components/common/LoginProtection";
import { SessionManager } from "@/lib/auth";
import {
  getCustomerOrderAlert,
  getCustomerStatusConfig,
} from "@/lib/transactionStatus";
import { getPaymentMethodLabel } from "@/lib/paymentMethods";
import {
  getMyOrders,
  getOrderDetail,
  mapOrderDetailToTransaction,
  mapOrderSummaryToTransaction,
} from "@/services/api/orders";
import { useTransaction } from "@/contexts/TransactionContext";

const BACKEND_ORDER_ID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const getTrackingDisplay = (trackingNumber?: string) => {
  const normalized = trackingNumber?.trim();

  if (!normalized) return "Belum tersedia";

  const placeholderValues = new Set([
    "in process",
    "process",
    "processing",
    "pending",
    "belum tersedia",
    "-",
  ]);

  return placeholderValues.has(normalized.toLowerCase())
    ? "Belum tersedia"
    : normalized;
};

const TrackOrderPage: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const transactionId = searchParams?.get("transactionId");
  const { transactions: localTransactions, clearTransactions } = useTransaction();

  const [apiOrders, setApiOrders] = useState<Transaction[]>([]);
  const [currentTransaction, setCurrentTransaction] = useState<Transaction | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadOrders = async () => {
      if (!SessionManager.isAuthenticated()) {
        setApiOrders([]);
        setCurrentTransaction(null);
        setIsLoading(false);
        setErrorMessage(null);
        return;
      }

      setIsLoading(true);
      setErrorMessage(null);

      try {
        if (transactionId) {
          if (BACKEND_ORDER_ID_PATTERN.test(transactionId)) {
            const detailResponse = await getOrderDetail(transactionId);
            const mappedTransaction = mapOrderDetailToTransaction(
              detailResponse.data
            );
            setApiOrders([mappedTransaction]);
            setCurrentTransaction(mappedTransaction);
            return;
          }

          throw new Error("Data tracking ini tidak ditemukan di server. Jika ini pesanan lama sebelum reset, silakan bersihkan data lokal lalu cek transaksi terbaru.");
        }

        const listResponse = await getMyOrders();
        const mappedOrders = listResponse.data.map(mapOrderSummaryToTransaction);
        setApiOrders(mappedOrders);

        if (mappedOrders.length > 0) {
          const latestOrderDetail = await getOrderDetail(mappedOrders[0].id);
          setCurrentTransaction(mapOrderDetailToTransaction(latestOrderDetail.data));
        } else {
          setCurrentTransaction(null);
        }
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Gagal mengambil data pelacakan."
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadOrders();
  }, [transactionId, localTransactions]);

  const orders = useMemo(
    () => [...apiOrders],
    [apiOrders]
  );
  const hasLocalLegacyTransactions = localTransactions.length > 0;

  const handleBack = () => {
    router.back();
  };

  const getStatusConfig = (transaction: Transaction) => {
    const config = getCustomerStatusConfig(
      transaction.status,
      transaction.paymentMethod,
      transaction.deliveryType || "delivery"
    );

    return {
      text: config.text,
      color: config.textColor,
      bgColor: config.bgColor,
      borderColor: config.borderColor,
    };
  };

  const getTrackOrderItems = (transaction: Transaction) => {
    const statusConfig = getStatusConfig(transaction);

    return transaction.items.map((item) => ({
      id: `${transaction.id}-${item.id}`,
      name: item.name,
      variant: item.variantName || "Varian tidak tersedia",
      size: transaction.deliveryType === "delivery" ? "Dikirim" : "Pickup",
      quantity: item.quantity,
      price: item.price,
      image: item.image,
      status: statusConfig.text,
    }));
  };

  const getCurrentStatusIndex = (status: string, deliveryType: string) => {
    switch (status) {
      case "pending":
        return -1;
      case "paid":
      case "capture":
      case "settlement":
        return 0;
      case "processing":
        return deliveryType === "pickup" ? 0 : 1;
      case "shipped":
        return deliveryType === "pickup" ? 1 : 2;
      case "delivered":
      case "completed":
        return deliveryType === "pickup" ? 2 : 3;
      case "cancelled":
      case "failed":
      case "expire":
      case "cancel":
      case "deny":
      case "refund":
        return -1;
      default:
        return -1;
    }
  };

  const currentOrderAlert = currentTransaction
    ? getCustomerOrderAlert(
        currentTransaction.status,
        currentTransaction.shipmentAddress?.trackingNumber,
        currentTransaction.deliveryType || "delivery"
      )
    : null;
  const displayedTransactions = transactionId && currentTransaction ? [currentTransaction] : orders;
  const showGlobalAlert = Boolean(transactionId && currentOrderAlert);

  return (
    <LoginProtection useModal={true} feature="tracking">
      <div className="min-h-screen bg-transparent">
        <UnifiedHeader
          type="secondary"
          title="Lacak Pesanan"
          subtitle="Pantau status pembayaran, pickup, pengiriman, dan resi resmi"
          showBackButton={true}
          onBack={handleBack}
        />

        <div className="flex flex-col items-center gap-4 px-4 py-5 pb-[calc(6.5rem+env(safe-area-inset-bottom))]">
          {hasLocalLegacyTransactions && (
            <div className="w-full max-w-sm rounded-3xl border border-amber-200 bg-amber-50/95 p-4 text-sm text-amber-900 shadow-[0_8px_22px_rgba(15,23,42,0.06)]">
              <p className="font-semibold">Data lokal lama terdeteksi</p>
              <p className="mt-1 text-xs leading-relaxed">
                Data ini tersimpan di perangkat sebelum reset database. Bersihkan agar halaman tracking hanya membaca pesanan dari server toko.
              </p>
              <button
                type="button"
                onClick={clearTransactions}
                className="mt-3 rounded-2xl bg-amber-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-amber-700"
              >
                Bersihkan Data Lokal Lama
              </button>
            </div>
          )}
          {isLoading ? (
            <div className="w-full max-w-sm rounded-3xl bg-white/95 p-6 text-center shadow-[0_8px_22px_rgba(15,23,42,0.08)]">
              <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
              <p className="text-sm text-[#6B7C73]">
                Memuat data pelacakan...
              </p>
            </div>
          ) : errorMessage ? (
            <div className="w-full max-w-sm rounded-3xl bg-white/95 p-6 text-center shadow-[0_8px_22px_rgba(15,23,42,0.08)]">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 ring-8 ring-red-50/60">
                <svg
                  className="h-8 w-8 text-red-500"
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
              <h3 className="mb-2 text-lg font-bold text-[#0D0E09]">
                Gagal Memuat Pelacakan
              </h3>
              <p className="text-sm text-[#6B7C73]">{errorMessage}</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="w-full max-w-sm rounded-3xl bg-white/95 p-6 text-center shadow-[0_8px_22px_rgba(15,23,42,0.08)]">
              <div className="flex flex-col items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
                  <svg
                    className="h-8 w-8 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-bold text-[#0D0E09]">
                    Belum Ada Pesanan
                  </h3>
                  <p className="mb-4 text-sm leading-6 text-[#6B7C73]">
                    Data pelacakan akan muncul setelah bro memiliki pesanan yang tercatat di server toko.
                  </p>
                  <button
                    onClick={() => router.push("/")}
                    className="rounded-2xl bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
                  >
                    Mulai Belanja
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {showGlobalAlert && currentOrderAlert && (
                <div
                  className={`w-full max-w-sm rounded-3xl border ${currentOrderAlert.borderColor} ${currentOrderAlert.bgColor} p-4 shadow-[0_8px_22px_rgba(15,23,42,0.06)]`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl" aria-hidden="true">
                      {currentOrderAlert.icon}
                    </span>
                    <div>
                      <h2 className={`text-sm font-semibold ${currentOrderAlert.textColor}`}>
                        {currentOrderAlert.title}
                      </h2>
                      <p className={`mt-1 text-xs leading-relaxed ${currentOrderAlert.textColor}`}>
                        {currentOrderAlert.message}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {!transactionId && displayedTransactions.length > 1 && (
                <div className="w-full max-w-sm rounded-3xl border border-emerald-100 bg-white/95 p-4 shadow-[0_8px_22px_rgba(15,23,42,0.08)]">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
                    Daftar Pesanan
                  </p>
                  <h2 className="mt-1 text-lg font-bold text-[#0D0E09]">
                    Status ditampilkan per pesanan
                  </h2>
                  <p className="mt-2 text-xs leading-relaxed text-[#6B7C73]">
                    Setiap kartu di bawah punya status sendiri, jadi bro bisa lihat pesanan mana yang belum dibayar, diproses toko, siap diambil, dikirim, atau selesai.
                  </p>
                </div>
              )}

              <div className="w-full max-w-sm space-y-4">
                {displayedTransactions.map((transaction, index) => {
                  const statusConfig = getStatusConfig(transaction);
                  const isPickup = transaction.deliveryType === "pickup";
                  const orderTrackingDisplay = getTrackingDisplay(transaction.shipmentAddress?.trackingNumber);
                  const statusAlert = getCustomerOrderAlert(
                    transaction.status,
                    transaction.shipmentAddress?.trackingNumber,
                    transaction.deliveryType || "delivery"
                  );

                  return (
                    <article
                      key={transaction.id}
                      className="overflow-hidden rounded-3xl bg-white/95 shadow-[0_8px_22px_rgba(15,23,42,0.08)] ring-1 ring-emerald-50"
                    >
                      <div className="border-b border-emerald-50 bg-gradient-to-br from-white to-emerald-50/70 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
                              Pesanan {index + 1}
                            </p>
                            <h3 className="mt-1 break-all text-base font-bold text-[#0D0E09]">
                              {transaction.transactionId}
                            </h3>
                            <p className="mt-1 text-xs text-[#6B7C73]">
                              {transaction.date} • {isPickup ? "Pickup toko" : "Dikirim ke alamat"} • {getPaymentMethodLabel(transaction.paymentMethod)}
                            </p>
                          </div>
                          <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${statusConfig.bgColor} ${statusConfig.color}`}>
                            {statusConfig.text}
                          </span>
                        </div>
                        <div className={`mt-3 rounded-2xl border ${statusAlert.borderColor} ${statusAlert.bgColor} px-3 py-2`}>
                          <p className={`text-xs font-semibold ${statusAlert.textColor}`}>
                            {statusAlert.title}
                          </p>
                          <p className={`mt-1 text-xs leading-relaxed ${statusAlert.textColor}`}>
                            {statusAlert.message}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3 p-4">
                        <div className="space-y-2 rounded-2xl bg-emerald-50/50 p-3 text-sm">
                          {isPickup ? (
                            <>
                              <div className="flex items-start justify-between gap-4">
                                <span className="text-[#6B7C73]">Metode</span>
                                <span className="text-right font-semibold text-[#0D0E09]">Ambil langsung di toko</span>
                              </div>
                              <div className="rounded-2xl bg-white/80 px-3 py-2 text-xs font-medium leading-relaxed text-emerald-800">
                                Pesanan pickup tidak memakai nomor resi kurir. Datang ke toko setelah status pesanan ini siap diambil.
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="flex items-start justify-between gap-4">
                                <span className="text-[#6B7C73]">No. Resi</span>
                                <span className="text-right font-semibold text-[#0D0E09]">{orderTrackingDisplay}</span>
                              </div>
                              <div className="flex items-start justify-between gap-4">
                                <span className="text-[#6B7C73]">Kurir</span>
                                <span className="text-right font-semibold text-[#0D0E09]">
                                  {[transaction.shipmentAddress?.courier, transaction.shipmentAddress?.service]
                                    .filter(Boolean)
                                    .join(" - ") || "Belum tersedia"}
                                </span>
                              </div>
                              <p className="rounded-2xl bg-yellow-50 px-3 py-2 text-xs font-medium leading-relaxed text-yellow-800">
                                Resi muncul setelah admin memasukkan kode tracking resmi kurir untuk pesanan ini.
                              </p>
                            </>
                          )}
                        </div>

                        <TrackOrderList items={getTrackOrderItems(transaction)} />

                        {transactionId && (
                          <>
                            <DeliveryAddress
                              orderDate={transaction.date}
                              paymentStatus={statusConfig.text}
                              trackingNumber={transaction.shipmentAddress?.trackingNumber}
                              recipientName={transaction.shipmentAddress?.recipientName}
                              phone={transaction.shipmentAddress?.phone}
                              address={transaction.shipmentAddress?.address}
                              city={
                                transaction.shipmentAddress
                                  ? [transaction.shipmentAddress.city, transaction.shipmentAddress.postalCode]
                                      .filter(Boolean)
                                      .join(" ")
                                  : undefined
                              }
                              courier={transaction.shipmentAddress?.courier}
                              service={transaction.shipmentAddress?.service}
                              estimatedDelivery={transaction.shipmentAddress?.estimatedDelivery}
                              deliveryType={transaction.deliveryType}
                            />
                            <StatusOrder
                              currentStatus={getCurrentStatusIndex(
                                transaction.status,
                                transaction.deliveryType || "delivery"
                              )}
                              deliveryType={transaction.deliveryType}
                            />
                          </>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </LoginProtection>
  );
};

export default TrackOrderPage;
