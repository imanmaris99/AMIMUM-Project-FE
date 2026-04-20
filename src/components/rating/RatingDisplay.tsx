import React from 'react';

export interface RatingDisplayReview {
  id: number | string;
  rate: number;
  review: string;
  rater_name?: string;
  created_at: string;
}

export interface RatingDisplaySummary {
  avg_rating: number;
  total_rater: number;
  rating_distribution: Record<1 | 2 | 3 | 4 | 5, number>;
  recent_reviews: RatingDisplayReview[];
}

interface RatingDisplayProps {
  ratingData: RatingDisplaySummary;
  showDistribution?: boolean;
  showReviews?: boolean;
  className?: string;
}

const RatingDisplay: React.FC<RatingDisplayProps> = ({
  ratingData,
  showDistribution = false,
  showReviews = false,
  className = ""
}) => {
  const { avg_rating, total_rater, rating_distribution, recent_reviews } = ratingData;

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Rating Stars */}
      <div className="flex items-center gap-2">
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg
              key={star}
              className={`w-4 h-4 ${
                star <= Math.floor(avg_rating)
                  ? "text-yellow-400"
                  : "text-gray-300"
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <span className="text-sm text-gray-600">
          {avg_rating.toFixed(1)} ({total_rater} ulasan)
        </span>
      </div>

      {/* Rating Distribution */}
      {showDistribution && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Distribusi Rating</h4>
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = rating_distribution[rating as keyof typeof rating_distribution];
            const percentage = total_rater > 0 ? (count / total_rater) * 100 : 0;
            
            return (
              <div key={rating} className="flex items-center gap-2">
                <span className="text-xs text-gray-600 w-4">{rating}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500 w-8">{count}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Recent Reviews */}
      {showReviews && recent_reviews.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">Ulasan Terbaru</h4>
          <div className="space-y-2">
            {recent_reviews.slice(0, 3).map((review) => (
              <div key={review.id} className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`w-3 h-3 ${
                          star <= review.rate
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">{review.rater_name}</span>
                  <span className="text-xs text-gray-400">
                    {new Date(review.created_at).toLocaleDateString('id-ID')}
                  </span>
                </div>
                {review.review && (
                  <p className="text-sm text-gray-700">{review.review}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RatingDisplay;
