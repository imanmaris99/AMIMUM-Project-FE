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
  paymentMethod?: TransactionPaymentMethod,
  deliveryType: string = "delivery"
): CustomerStatusConfig => {
  const isPickupOrder = deliveryType === "pickup";

  switch (status) {
    case "pending":
      return {
        text: paymentMethod === "qris_manual"
          ? "Menunggu Konfirmasi QRIS"
          : paymentMethod === "transfer"
            ? "Menunggu Transfer BRI"
            : "Menunggu Bayar",
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
        text: isPickupOrder ? "Siap Diambil" : "Pesanan Diproses",
        bgColor: isPickupOrder ? "bg-emerald-100" : "bg-blue-100",
        textColor: isPickupOrder ? "text-emerald-700" : "text-blue-600",
        borderColor: isPickupOrder ? "border-emerald-200" : "border-blue-200",
      };
    case "shipped":
      return {
        text: isPickupOrder ? "Siap Diambil" : "Dikirim",
        bgColor: isPickupOrder ? "bg-emerald-100" : "bg-indigo-100",
        textColor: isPickupOrder ? "text-emerald-700" : "text-indigo-600",
        borderColor: isPickupOrder ? "border-emerald-200" : "border-indigo-200",
      };
    case "delivered":
    case "completed":
      return {
        text: isPickupOrder ? "Sudah Diambil" : "Pesanan Selesai",
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
        message: isPickupOrder
          ? "Pembayaran sudah diterima. Pesanan ambil di toko menunggu admin menyiapkan barang. Datang ke toko setelah status siap diambil."
          : "Pembayaran sudah diterima. Pesanan sekarang menunggu admin memproses dan menyiapkan pengiriman.",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        textColor: "text-blue-800",
        icon: "✅",
      };
    case "processing":
      return {
        title: isPickupOrder ? "Pesanan siap diambil" : "Pesanan sedang diproses",
        message:
          isPickupOrder
            ? "Pesanan pickup sudah siap diambil di toko dan tidak memakai nomor resi kurir. Silakan datang ke toko saat jam operasional."
            : "Toko sedang menyiapkan pesanan. Nomor resi akan muncul setelah paket diserahkan ke kurir.",
        bgColor: isPickupOrder ? "bg-emerald-50" : "bg-blue-50",
        borderColor: isPickupOrder ? "border-emerald-200" : "border-blue-200",
        textColor: isPickupOrder ? "text-emerald-800" : "text-blue-800",
        icon: isPickupOrder ? "🏬" : "📦",
      };
    case "shipped":
      if (isPickupOrder) {
        return {
          title: "Pesanan siap diambil",
          message: "Pesanan pickup sudah siap diambil di toko dan tidak memakai nomor resi kurir.",
          bgColor: "bg-emerald-50",
          borderColor: "border-emerald-200",
          textColor: "text-emerald-800",
          icon: "🏬",
        };
      }
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
        title: isPickupOrder ? "Pesanan sudah diambil" : "Pesanan selesai",
        message: isPickupOrder
          ? "Pesanan pickup sudah diterima. Terima kasih sudah berbelanja di Toko Herbal Amimum."
          : "Pesanan sudah selesai. Terima kasih sudah berbelanja di Toko Herbal Amimum.",
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
