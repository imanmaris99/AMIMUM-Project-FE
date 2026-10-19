export const RATING_REVIEW_MAX_LENGTH = 100;

export const getRatingInputError = (rate: number, review: string): string | null => {
  if (!Number.isInteger(rate) || rate < 1 || rate > 5) {
    return "Pilih rating 1 sampai 5 bintang sebelum menyimpan ulasan.";
  }

  if (review.length > RATING_REVIEW_MAX_LENGTH) {
    return `Ulasan maksimal ${RATING_REVIEW_MAX_LENGTH} karakter.`;
  }

  return null;
};
