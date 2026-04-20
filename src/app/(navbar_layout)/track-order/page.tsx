"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  TrackOrderList,
  DeliveryAddress,
  StatusOrder,
} from "@/components/track-order";
import { TrackOrderItem } from "@/types/trackOrder";
import { Transaction } from "@/types/transaction";
import UnifiedHeader from "@/components/common/UnifiedHeader";
import LoginProtection from "@/components/common/LoginProtection";
import { SessionManager } from "@/lib/auth";
import {
  getMyOrders,
  getOrderDetail,
  mapOrderDetailToTransaction,
  mapOrderSummaryToTransaction,
} from "@/services/api/orders";
import { useTransaction } from "@/contexts/TransactionContext";

const TrackOrderPage: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const transactionId = searchParams?.get("transactionId");
  const { transactions: localTransactions } = useTransaction();

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
          const localTransaction = localTransactions.find(
            (transaction) => transaction.id === transactionId
          );

          if (localTransaction) {
            setCurrentTransaction(localTransaction);
            setApiOrders([]);
            return;
          }

          const detailResponse = await getOrderDetail(transactionId);
          const mappedTransaction = mapOrderDetailToTransaction(
            detailResponse.data
          );
          setApiOrders([mappedTransaction]);
          setCurrentTransaction(mappedTransaction);
          return;
        }

        const listResponse = await getMyOrders();
        const mappedOrders = listResponse.data.map(mapOrderSummaryToTransaction);
        setApiOrders(mappedOrders);

        if (localTransactions.length > 0) {
          setCurrentTransaction(localTransactions[0]);
        } else if (mappedOrders.length > 0) {
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
    () => [...localTransactions, ...apiOrders],
    [localTransactions, apiOrders]
  );

  const handleBack = () => {
    router.back();
  };

  const trackOrderItems = useMemo<TrackOrderItem[]>(() => {
    if (transactionId && currentTransaction) {
      return currentTransaction.items.map((item) => ({
        id: `${currentTransaction.id}-${item.id}`,
        name: item.name,
        variant: item.variantName || "Varian tidak tersedia",
        size:
          currentTransaction.deliveryType === "delivery" ? "Dikirim" : "Pickup",
        quantity: item.quantity,
        price: item.price,
        image: item.image,
      }));
    }

    return orders.flatMap((transaction) =>
      transaction.items.map((item) => ({
        id: `${transaction.id}-${item.id}`,
        name: item.name,
        variant: item.variantName || "Varian tidak tersedia",
        size: transaction.deliveryType === "delivery" ? "Dikirim" : "Pickup",
        quantity: item.quantity,
        price: item.price,
        image: item.image,
      }))
    );
  }, [currentTransaction, orders, transactionId]);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "pending":
        return {
          text: "Menunggu Pembayaran",
          color: "text-yellow-600",
          bgColor: "bg-yellow-100",
        };
      case "processing":
        return {
          text: "Diproses",
          color: "text-blue-600",
          bgColor: "bg-blue-100",
        };
      case "shipped":
        return {
          text: "Dikirim",
          color: "text-indigo-600",
          bgColor: "bg-indigo-100",
        };
      case "delivered":
      case "completed":
        return {
          text: status === "delivered" ? "Selesai" : "Lunas",
          color: "text-green-600",
          bgColor: "bg-green-100",
        };
      case "cancelled":
        return {
          text: "Batal",
          color: "text-red-600",
          bgColor: "bg-red-100",
        };
      case "refund":
        return {
          text: "Refund",
          color: "text-purple-600",
          bgColor: "bg-purple-100",
        };
      default:
        return {
          text: "Unknown",
          color: "text-gray-600",
          bgColor: "bg-gray-100",
        };
    }
  };

  const getCurrentStatusIndex = (status: string, deliveryType: string) => {
    switch (status) {
      case "pending":
        return -1;
      case "processing":
        return 0;
      case "shipped":
        return deliveryType === "pickup" ? 1 : 2;
      case "delivered":
      case "completed":
        return deliveryType === "pickup" ? 2 : 3;
      case "cancelled":
      case "refund":
        return -1;
      default:
        return 0;
    }
  };

  return (
    <LoginProtection useModal={true} feature="tracking">
      <div className="min-h-screen bg-gray-100">
        <UnifiedHeader
          type="secondary"
          title="Track Order"
          subtitle="Lacak status pesanan Anda"
          showBackButton={true}
          onBack={handleBack}
        />

        <div className="flex flex-col justify-center items-center gap-4 py-8 px-4">
          {isLoading ? (
            <div className="w-full max-w-sm bg-white rounded-lg shadow-sm border p-6 text-center">
              <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />
              <p className="text-sm text-gray-500">
                Memuat data pelacakan...
              </p>
            </div>
          ) : errorMessage ? (
            <div className="w-full max-w-sm bg-white rounded-lg shadow-sm border p-6 text-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
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
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Gagal Memuat Pelacakan
              </h3>
              <p className="text-sm text-gray-500">{errorMessage}</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="w-full max-w-sm bg-white rounded-lg shadow-sm border p-6 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-gray-400"
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
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Belum Ada Pesanan
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Data pelacakan akan muncul setelah Anda memiliki pesanan di
                    sistem.
                  </p>
                  <button
                    onClick={() => router.push("/")}
                    className="bg-primary text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                  >
                    Mulai Belanja
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {transactionId && currentTransaction && (
                <div className="w-full max-w-sm bg-white rounded-lg shadow-sm border p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Informasi Transaksi
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">ID Transaksi:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {currentTransaction.transactionId}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Status:</span>
                      <span
                        className={`text-sm font-medium px-2 py-1 rounded-full ${
                          getStatusConfig(currentTransaction.status).bgColor
                        } ${getStatusConfig(currentTransaction.status).color}`}
                      >
                        {getStatusConfig(currentTransaction.status).text}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Metode:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {currentTransaction.deliveryType === "delivery"
                          ? "Kirim ke tujuan"
                          : "Ambil di toko"}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="w-full max-w-sm">
                <TrackOrderList items={trackOrderItems} />
              </div>
            </>
          )}

          {orders.length > 0 && currentTransaction && !isLoading && !errorMessage && (
            <>
              <div className="w-full max-w-sm py-2 border-b-2 border-gray-300" />

              <div className="w-full max-w-sm">
                <DeliveryAddress
                  orderDate={currentTransaction.date}
                  paymentStatus={getStatusConfig(currentTransaction.status).text}
                  trackingNumber={currentTransaction.shipmentId || "Belum tersedia"}
                  recipientName={currentTransaction.shipmentAddress?.recipientName}
                  phone={currentTransaction.shipmentAddress?.phone}
                  address={currentTransaction.shipmentAddress?.address}
                  city={
                    currentTransaction.shipmentAddress
                      ? [
                          currentTransaction.shipmentAddress.city,
                          currentTransaction.shipmentAddress.postalCode,
                        ]
                          .filter(Boolean)
                          .join(" ")
                      : undefined
                  }
                  courier={currentTransaction.shipmentAddress?.courier}
                  service={currentTransaction.shipmentAddress?.service}
                  estimatedDelivery={
                    currentTransaction.shipmentAddress?.estimatedDelivery
                  }
                />
              </div>

              <div className="w-full max-w-sm py-2 border-b-2 border-gray-300" />

              <div className="w-full max-w-sm">
                <StatusOrder
                  currentStatus={getCurrentStatusIndex(
                    currentTransaction.status,
                    currentTransaction.deliveryType || "delivery"
                  )}
                  deliveryType={currentTransaction.deliveryType}
                />
              </div>
            </>
          )}
        </div>

        <div className="flex justify-center items-center mt-auto mb-10">
          <div className="flex justify-center items-center gap-1">
            <span className="text-xs font-bold text-black">©2025</span>
            <span className="text-xs text-gray-500">by</span>
            <span className="text-xs font-bold text-primary">Amimum Team.</span>
          </div>
        </div>
      </div>
    </LoginProtection>
  );
};

export default TrackOrderPage;
