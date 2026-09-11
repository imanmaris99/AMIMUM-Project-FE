import { TransactionPaymentMethod } from "@/types/transaction";

export interface CustomerStatusConfig {
  text: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
}

export const failedPaymentStatuses = [
  "cancelled",
  "canceled",
  "failed",
  "expire",
  "expired",
  "cancel",
  "deny",
] as const;

export const isOfflinePaymentMethod = (paymentMethod?: TransactionPaymentMethod) =>
  paymentMethod === "cod" || paymentMethod === "pay_at_store";

export const isOnlinePaymentMethod = (paymentMethod?: TransactionPaymentMethod) =>
  Boolean(paymentMethod) && !isOfflinePaymentMethod(paymentMethod);

export const isPendingPaymentStatus = (status?: string) => status === "pending";

export const isFailedPaymentStatus = (status?: string) =>
  failedPaymentStatuses.includes((status || "") as (typeof failedPaymentStatuses)[number]);

export const isSuccessfulPaymentStatus = (status?: string) =>
  ["processing", "capture", "settlement", "paid", "completed"].includes(
    status || ""
  );

export const getCustomerStatusConfig = (
  status: string,
  paymentMethod?: TransactionPaymentMethod
): CustomerStatusConfig => {
  void paymentMethod;
  switch (status) {
    case "pending":
      return {
        text: "Menunggu Bayar",
        bgColor: "bg-yellow-100",
        textColor: "text-yellow-700",
        borderColor: "border-yellow-200",
      };
    case "paid":
    case "capture":
    case "settlement":
      return {
        text: "Pembayaran Berhasil",
        bgColor: "bg-blue-100",
        textColor: "text-blue-600",
        borderColor: "border-blue-200",
      };
    case "processing":
      return {
        text: "Pesanan Diproses",
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
      return {
        text: "Selesai",
        bgColor: "bg-green-100",
        textColor: "text-green-600",
        borderColor: "border-green-200",
      };
    case "completed":
      return {
        text: "Pesanan Selesai",
        bgColor: "bg-green-100",
        textColor: "text-green-600",
        borderColor: "border-green-200",
      };
    case "cancelled":
    case "canceled":
    case "failed":
    case "expire":
    case "expired":
    case "cancel":
    case "deny":
      return {
        text: "Pembayaran Gagal",
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
        text: "Status belum tersedia",
        bgColor: "bg-gray-100",
        textColor: "text-gray-600",
        borderColor: "border-gray-200",
      };
  }
};
