"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "react-hot-toast";
import UnifiedHeader from "@/components/common/UnifiedHeader";
import rupiahFormater from "@/utils/rupiahFormater";
import { getPaymentMethodLabel } from "@/lib/paymentMethods";
import { Transaction } from "@/types/transaction";
import {
  getOrderDetail,
  mapOrderDetailToTransaction,
} from "@/services/api/orders";
import { useTransaction } from "@/contexts/TransactionContext";

const TransactionDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const transactionId = params?.transactionId as string;
  const { getTransactionById, updateTransactionStatus } = useTransaction();

  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadOrderDetail = async () => {
      if (!transactionId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setErrorMessage(null);

      try {
        const localTransaction = getTransactionById(transactionId);
        if (localTransaction) {
          setTransaction(localTransaction);
          return;
        }

        const response = await getOrderDetail(transactionId);
        setTransaction(mapOrderDetailToTransaction(response.data));
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Gagal mengambil detail transaksi."
        );
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

    const invoiceLines = [
      `Invoice ${transaction.transactionId}`,
      `Tanggal: ${transaction.date}`,
      `Status: ${transaction.status}`,
      `Metode Pengiriman: ${
        transaction.deliveryType === "delivery" ? "Kirim ke tujuan" : "Ambil di toko"
      }`,
      `Subtotal: ${rupiahFormater(transaction.subtotal)}`,
      `Ongkir: ${rupiahFormater(transaction.shippingCost)}`,
      `Total: ${rupiahFormater(transaction.total)}`,
      "",
      "Item:",
      ...transaction.items.map(
        (item) =>
          `- ${item.name}${item.variantName ? ` (${item.variantName})` : ""} x${
            item.quantity
          } = ${rupiahFormater(item.price * item.quantity)}`
      ),
      "",
      `Alamat: ${transaction.shipmentAddress?.address || "-"}`,
      `Kurir: ${transaction.shipmentAddress?.courier || "-"}`,
      `Layanan: ${transaction.shipmentAddress?.service || "-"}`,
      `Estimasi: ${transaction.shipmentAddress?.estimatedDelivery || "-"}`,
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

  const handleSimulatePayment = () => {
    if (!transaction) {
      return;
    }

    updateTransactionStatus(transaction.transactionId, "processing");
    setTransaction((previous) =>
      previous
        ? {
            ...previous,
            status: "processing",
          }
        : previous
    );
    toast.success("Pembayaran berhasil disimulasikan.");
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "pending":
        return {
          text: "Menunggu Pembayaran",
          bgColor: "bg-yellow-100",
          textColor: "text-yellow-700",
          borderColor: "border-yellow-200",
        };
      case "processing":
        return {
          text: "Diproses",
          bgColor: "bg-blue-100",
          textColor: "text-blue-600",
          borderColor: "border-blue-200",
        };
      case "shipped":
        return {
          text: "Dikirim",
          bgColor: "bg-indigo-100",
          textColor: "text-indigo-600",
          borderColor: "border-indigo-200",
        };
      case "delivered":
      case "completed":
        return {
          text: status === "delivered" ? "Selesai" : "Lunas",
          bgColor: "bg-green-100",
          textColor: "text-green-600",
          borderColor: "border-green-200",
        };
      case "cancelled":
        return {
          text: "Batal",
          bgColor: "bg-red-100",
          textColor: "text-red-600",
          borderColor: "border-red-200",
        };
      case "refund":
        return {
          text: "Refund",
          bgColor: "bg-purple-100",
          textColor: "text-purple-600",
          borderColor: "border-purple-200",
        };
      default:
        return {
          text: "Unknown",
          bgColor: "bg-gray-100",
          textColor: "text-gray-600",
          borderColor: "border-gray-200",
        };
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <span className="loader mb-4" aria-label="Memuat..." />
        <p className="text-gray-600 text-lg font-medium">
          Memuat halaman, mohon tunggu sebentar...
        </p>
      </div>
    );
  }

  if (!transaction || errorMessage) {
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
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Transaksi Tidak Ditemukan
          </h3>
          <p className="text-gray-500 text-sm text-center">
            {errorMessage || `Transaksi dengan ID ${transactionId} tidak ditemukan`}
          </p>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(transaction.status);

  return (
    <div className="min-h-screen bg-gray-50">
      <UnifiedHeader
        type="secondary"
        title="Detail Transaksi"
        subtitle="Informasi lengkap transaksi"
        showBackButton={true}
        onBack={handleBack}
      />

      <div className="px-4 py-6">
        <div className="max-w-sm mx-auto space-y-4">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-gray-900">
                Status Transaksi
              </h2>
              <div
                className={`px-3 py-1 rounded-full ${statusConfig.bgColor} ${statusConfig.borderColor} border`}
              >
                <span className={`text-sm font-medium ${statusConfig.textColor}`}>
                  {statusConfig.text}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">ID Transaksi:</span>
                <span className="text-sm font-medium text-gray-900">
                  {transaction.transactionId}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Tanggal:</span>
                <span className="text-sm font-medium text-gray-900">
                  {transaction.date}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Metode Bayar:</span>
                <span className="text-sm font-medium text-gray-900">
                  {getPaymentMethodLabel(transaction.paymentMethod)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Subtotal:</span>
                <span className="text-sm font-medium text-gray-900">
                  {rupiahFormater(transaction.subtotal)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Ongkir:</span>
                <span className="text-sm font-medium text-gray-900">
                  {rupiahFormater(transaction.shippingCost)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total:</span>
                <span className="text-sm font-medium text-gray-900">
                  {rupiahFormater(transaction.total)}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Item Pesanan
            </h3>
            <div className="space-y-3">
              {transaction.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                    <Image
                      src={item.image || "/default-image.jpg"}
                      alt={item.name}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {item.name}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {item.variantName ? `${item.variantName} • ` : ""}Qty:{" "}
                      {item.quantity}
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {rupiahFormater(item.price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Informasi Pengiriman
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Metode:</span>
                <span className="text-sm font-medium text-gray-900">
                  {transaction.deliveryType === "delivery"
                    ? "Dikirim"
                    : "Ambil di Toko"}
                </span>
              </div>
              {transaction.deliveryType === "delivery" && (
                <>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Alamat:</span>
                    <span className="text-sm font-medium text-gray-900 text-right">
                      {transaction.shipmentAddress?.address || "Alamat tidak tersedia"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Penerima:</span>
                    <span className="text-sm font-medium text-gray-900 text-right">
                      {transaction.shipmentAddress?.recipientName || "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Telepon:</span>
                    <span className="text-sm font-medium text-gray-900 text-right">
                      {transaction.shipmentAddress?.phone || "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Kurir:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {transaction.shipmentAddress?.courier || "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Layanan:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {transaction.shipmentAddress?.service || "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Estimasi:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {transaction.shipmentAddress?.estimatedDelivery || "-"}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {transaction.notes && (
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Catatan Tambahan
              </h3>
              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                &ldquo;{transaction.notes}&rdquo;
              </p>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="space-y-3">
              {transaction.status === "pending" && transaction.id.startsWith("trans-") && (
                <button
                  onClick={handleSimulatePayment}
                  className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  Simulasikan Pembayaran Berhasil
                </button>
              )}
              {transaction.deliveryType === "delivery" && (
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailPage;
