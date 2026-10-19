interface RatingErrorDetail {
  detail?: {
    error?: unknown;
  };
}

export const getRating403Message = (errorData: unknown): string => {
  const errorCode = (errorData as RatingErrorDetail | null)?.detail?.error;

  if (errorCode === "Purchase Required") {
    return "Rating hanya dapat diberikan setelah pesanan produk berstatus selesai.";
  }

  return "Silakan login kembali untuk mengelola rating produk.";
};
