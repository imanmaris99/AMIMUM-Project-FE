export const RATING_REVIEW_MAX_LENGTH = 100;
export const RATING_PURCHASE_ELIGIBILITY_COPY =
  "Rating hanya dapat diberikan setelah pesanan berstatus selesai dan pembayaran berhasil.";
export const RATING_VARIANT_SELECTION_COPY =
  "Pilih varian yang tercatat pada pesanan Anda.";
export const RATING_NO_ELIGIBLE_PURCHASE_COPY =
  "Belum ada pembelian yang memenuhi syarat. Rating tersedia setelah pesanan selesai dan pembayaran berhasil.";

export const getRatingEligibilityProductId = (productId?: string | null): string =>
  typeof productId === "string" ? productId.trim() : "";

export const getCompletedOrderRatingHref = (
  orderStatus: string,
  productId?: string | null,
  isLocalSimulatedTransaction = false
): string | null => {
  const normalizedProductId = getRatingEligibilityProductId(productId);
  if (
    isLocalSimulatedTransaction ||
    orderStatus.trim().toLowerCase() !== "completed" ||
    !normalizedProductId
  ) {
    return null;
  }

  return `/detail-product/${encodeURIComponent(normalizedProductId)}#product-ratings`;
};

export const getRatingInputError = (rate: number, review: string): string | null => {
  if (!Number.isInteger(rate) || rate < 1 || rate > 5) {
    return "Pilih rating 1 sampai 5 bintang sebelum menyimpan ulasan.";
  }

  if (review.length > RATING_REVIEW_MAX_LENGTH) {
    return `Ulasan maksimal ${RATING_REVIEW_MAX_LENGTH} karakter.`;
  }

  return null;
};
