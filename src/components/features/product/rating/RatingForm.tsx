"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

interface RatingFormProps {
  productName: string;
  onSubmit: (rating: number, review: string) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  className?: string;
}

const RatingForm: React.FC<RatingFormProps> = ({
  productName,
  onSubmit,
  onCancel,
  isSubmitting = false,
  className = ""
}) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating > 0) {
      onSubmit(rating, review);
    }
  };

  const handleStarClick = (starRating: number) => {
    setRating(starRating);
  };

  const handleStarHover = (starRating: number) => {
    setHoveredRating(starRating);
  };

  const handleStarLeave = () => {
    setHoveredRating(0);
  };

  const displayRating = hoveredRating || rating;

  return (
    <div className={`bg-white p-6 rounded-lg shadow-sm border ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Berikan Rating untuk {productName}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating Stars */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Rating *
          </label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleStarClick(star)}
                onMouseEnter={() => handleStarHover(star)}
                onMouseLeave={handleStarLeave}
                className={`w-8 h-8 transition-colors duration-200 ${
                  star <= displayRating
                    ? "text-yellow-400"
                    : "text-gray-300 hover:text-yellow-200"
                }`}
                disabled={isSubmitting}
              >
                <svg
                  className="w-full h-full"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
            ))}
            <span className="ml-2 text-sm text-gray-600">
              {rating > 0 ? `${rating} bintang` : 'Pilih rating'}
            </span>
          </div>
        </div>

        {/* Review Textarea */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Ulasan (Opsional)
          </label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Bagikan pengalaman Anda dengan produk ini..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            rows={4}
            maxLength={500}
            disabled={isSubmitting}
          />
          <div className="text-xs text-gray-500 text-right">
            {review.length}/500 karakter
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            disabled={rating === 0 || isSubmitting}
            className="flex-1 bg-primary hover:bg-primary/90 text-white"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Mengirim...</span>
              </div>
            ) : (
              'Kirim Rating'
            )}
          </Button>
          
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              className="px-6"
            >
              Batal
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default RatingForm;
