import { TransactionPaymentMethod } from "@/types/transaction";

export interface CustomerStatusConfig {
  text: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
}

export interface CustomerOrderAlert {
  title: string;
  message: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  icon: string;
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

export const getCustomerOrderAlert = (
  status: string,
  trackingNumber?: string,
  deliveryType: string = "delivery"
): CustomerOrderAlert => {
  const hasTrackingNumber = Boolean(trackingNumber?.trim());
  const isPickupOrder = deliveryType === "pickup";

  switch (status) {
    case "pending":
      return {
        title: "Menunggu pembayaran",
        message:
          "Pesanan sudah tercatat. Selesaikan pembayaran agar toko bisa mulai memproses pesanan.",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200",
        textColor: "text-yellow-800",
        icon: "💳",
      };
    case "paid":
    case "capture":
    case "settlement":
      return {
        title: "Pembayaran berhasil",
        message:
          "Pembayaran sudah diterima. Pesanan sekarang menunggu admin memproses dan menyiapkan pengiriman.",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        textColor: "text-blue-800",
        icon: "✅",
      };
    case "processing":
      return {
        title: isPickupOrder ? "Pesanan sedang disiapkan" : "Pesanan sedang diproses",
        message:
          isPickupOrder
            ? "Toko sedang menyiapkan pesanan pickup. Datang ke toko setelah pesanan siap diambil."
            : "Toko sedang menyiapkan pesanan. Nomor resi akan muncul setelah paket diserahkan ke kurir.",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        textColor: "text-blue-800",
        icon: "📦",
      };
    case "shipped":
      return {
        title: "Pesanan sedang dikirim",
        message: hasTrackingNumber
          ? `Pesanan sudah dikirim. No. resi: ${trackingNumber}. Gunakan nomor ini untuk memantau pengiriman di website kurir.`
          : "Pesanan sudah dikirim. Nomor resi belum tersedia di sistem, silakan hubungi admin jika membutuhkan bantuan.",
        bgColor: "bg-indigo-50",
        borderColor: "border-indigo-200",
        textColor: "text-indigo-800",
        icon: "🚚",
      };
    case "delivered":
    case "completed":
      return {
        title: "Pesanan selesai",
        message:
          "Pesanan sudah selesai. Terima kasih sudah berbelanja di Toko Herbal Amimum.",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        textColor: "text-green-800",
        icon: "🌿",
      };
    case "cancelled":
    case "canceled":
    case "failed":
    case "expire":
    case "expired":
    case "cancel":
    case "deny":
      return {
        title: "Pembayaran belum berhasil",
        message:
          "Pembayaran belum berhasil atau sudah kedaluwarsa. Coba bayar ulang dari halaman transaksi atau hubungi admin.",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        textColor: "text-red-800",
        icon: "⚠️",
      };
    default:
      return {
        title: "Status pesanan diperbarui",
        message: "Cek halaman transaksi atau tracking untuk melihat perkembangan terbaru pesanan.",
        bgColor: "bg-gray-50",
        borderColor: "border-gray-200",
        textColor: "text-gray-700",
        icon: "ℹ️",
      };
  }
};
