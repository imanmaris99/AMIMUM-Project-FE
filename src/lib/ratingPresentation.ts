export type ProductReviewSort = "recent" | "highest" | "lowest";
export type RatingListContentState = "loading" | "error" | "results";

export const getRatingListContentState = (
  isLoading: boolean,
  loadError: string,
): RatingListContentState => {
  if (isLoading) return "loading";
  if (loadError) return "error";
  return "results";
};

export interface RatingReviewLike {
  id: number;
  rate: number;
  created_at: string;
}

export interface CompleteRatingPageLike<T extends RatingReviewLike> {
  data: T[];
  has_more: boolean;
}

export const deriveCompleteRatingPage = <
  T extends RatingReviewLike,
  P extends CompleteRatingPageLike<T>,
>(
  page: P,
  selectedRate: number | null,
  sort: ProductReviewSort,
): P | null => {
  if (page.has_more) return null;

  const data = page.data
    .filter((review) => selectedRate === null || review.rate === selectedRate)
    .slice()
    .sort((left, right) => {
      if (sort === "highest" && left.rate !== right.rate) {
        return right.rate - left.rate;
      }
      if (sort === "lowest" && left.rate !== right.rate) {
        return left.rate - right.rate;
      }

      const dateDifference = Date.parse(right.created_at) - Date.parse(left.created_at);
      return dateDifference || right.id - left.id;
    });

  return { ...page, data };
};
