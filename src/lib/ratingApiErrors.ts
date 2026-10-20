interface RatingErrorDetail {
  detail?: {
    error?: unknown;
  };
}

export const getRating403Message = (errorData: unknown): string => {
  const errorCode = (errorData as RatingErrorDetail | null)?.detail?.error;

  if (errorCode === "Purchase Required") {
    return "Rating hanya dapat diberikan setelah pesanan berstatus selesai dan pembayaran berhasil.";
  }

  if (errorCode === "Purchased Variant Required") {
    return "Varian rating harus sama dengan varian pada item pesanan yang dipilih.";
  }

  if (errorCode === "Purchased Order Item Required") {
    return "Item pesanan ini bukan pesanan selesai milik akun Anda.";
  }

  return "Silakan login kembali untuk mengelola rating produk.";
};

export const getRating409Message = (
  action: "load" | "create" | "update" | "delete"
): string => {
  if (action === "create") {
    return "Item pesanan ini sudah diberi rating. Buka halaman Rating & Ulasan Saya untuk mengubah rating yang ada.";
  }

  if (action === "update") {
    return "Rating belum bisa diperbarui karena datanya berubah. Muat ulang halaman lalu coba lagi.";
  }

  if (action === "delete") {
    return "Rating belum bisa dihapus karena datanya berubah. Muat ulang halaman lalu coba lagi.";
  }

  return "Rating belum bisa dimuat karena datanya berubah. Silakan coba lagi.";
};

export const isRatingEndpointHandled = (urlPath: string): boolean =>
  /^\/rating\/(?:product\/[^/]+(?:\/(?:eligible-variants|eligible-order-items))?|my-rating-products-list|edit\/\d+|delete\/\d+)$/.test(urlPath);
