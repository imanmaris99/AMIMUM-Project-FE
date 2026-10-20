export const RATING_REVIEW_MAX_LENGTH = 100;
export const RATING_PURCHASE_ELIGIBILITY_COPY =
  "Rating hanya dapat diberikan setelah pesanan berstatus selesai dan pembayaran berhasil.";
export const RATING_VARIANT_SELECTION_COPY =
  "Pilih item pesanan selesai yang ingin dinilai; varian mengikuti item tersebut.";
export const RATING_NO_ELIGIBLE_PURCHASE_COPY =
  "Belum ada pembelian yang memenuhi syarat. Rating tersedia setelah pesanan selesai dan pembayaran berhasil.";

export const getRatingEligibilityProductId = (productId?: string | null): string =>
  typeof productId === "string" ? productId.trim() : "";

export const getCompletedOrderRatingHref = (
  orderStatus: string,
  productId?: string | null,
  orderItemId?: string | number | null,
  isLocalSimulatedTransaction = false
): string | null => {
  const normalizedProductId = getRatingEligibilityProductId(productId);
  const normalizedOrderItemId = Number(orderItemId);
  if (
    isLocalSimulatedTransaction ||
    orderStatus.trim().toLowerCase() !== "completed" ||
    !normalizedProductId ||
    !Number.isSafeInteger(normalizedOrderItemId) ||
    normalizedOrderItemId <= 0
  ) {
    return null;
  }

  return `/detail-product/${encodeURIComponent(normalizedProductId)}?orderItemId=${normalizedOrderItemId}#product-ratings`;
};

export const getOrderItemRatingAction = (hasRating: boolean, ratingHref: string | null) => {
  if (hasRating) {
    return {
      kind: "rated" as const,
      disabled: true,
      label: "Sudah dinilai",
      message: "Anda sudah memberikan penilaian untuk item pesanan ini. Tombol penilaian tidak dapat digunakan lagi.",
      href: null,
    };
  }

  if (!ratingHref) return null;

  return {
    kind: "available" as const,
    disabled: false,
    label: "Beri penilaian",
    message: null,
    href: ratingHref,
  };
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
