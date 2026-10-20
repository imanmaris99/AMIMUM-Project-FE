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
    return "Pilih varian yang benar-benar pernah Anda beli pada pesanan selesai.";
  }

  return "Silakan login kembali untuk mengelola rating produk.";
};

export const isRatingEndpointHandled = (urlPath: string): boolean =>
  /^\/rating\/(?:product\/[^/]+(?:\/eligible-variants)?|my-rating-products-list|edit\/\d+|delete\/\d+)$/.test(urlPath);
