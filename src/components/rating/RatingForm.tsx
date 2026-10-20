import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  RATING_NO_ELIGIBLE_PURCHASE_COPY,
  RATING_REVIEW_MAX_LENGTH,
  RATING_VARIANT_SELECTION_COPY,
} from "@/lib/ratingConstraints";
import { EligibleRatingOrderItem } from "@/services/api/rating";

interface RatingFormProps {
  productName: string;
  orderItems: EligibleRatingOrderItem[];
  selectedOrderItemId: string;
  onOrderItemChange: (id: string) => void;
  isLoadingOrderItems?: boolean;
  orderItemsError?: string;
  onSubmit: (rating: number, review: string, orderItem: EligibleRatingOrderItem) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  className?: string;
}

const formatOrderItemLabel = (item: EligibleRatingOrderItem) => {
  const date = new Date(item.order_date);
  const dateLabel = Number.isNaN(date.getTime())
    ? "tanggal tidak tersedia"
    : date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
  const orderReference = item.order_id?.slice(0, 8).toUpperCase() || String(item.order_item_id);
  return `Pesanan #${orderReference} • ${dateLabel} • ${item.variant_name}`;
};

const RatingForm: React.FC<RatingFormProps> = ({
  productName,
  orderItems,
  selectedOrderItemId,
  onOrderItemChange,
  isLoadingOrderItems = false,
  orderItemsError = "",
  onSubmit,
  onCancel,
  isSubmitting = false,
  className = "",
}) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [hoveredRating, setHoveredRating] = useState(0);
  const safeProductName = productName?.trim() || "Produk katalog";
  const displayRating = hoveredRating || rating;
  const selectedOrderItem = orderItems.find(
    (item) => String(item.order_item_id) === selectedOrderItemId
  );
  const canSubmit = rating > 0 && !isLoadingOrderItems && Boolean(selectedOrderItem);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (canSubmit && selectedOrderItem) {
      onSubmit(rating, review.trim(), selectedOrderItem);
    }
  };

  return (
    <div className={`rounded-lg border bg-white p-6 shadow-sm ${className}`}>
      <h3 className="mb-4 text-lg font-semibold text-gray-900">
        Berikan Rating untuk {safeProductName}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <p id="rating-order-item-label" className="text-sm font-medium text-gray-700">
            Item pesanan selesai
          </p>
          {isLoadingOrderItems ? (
            <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-900" role="status">
              Memuat item pesanan selesai…
            </p>
          ) : orderItemsError ? (
            <p className="rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-900" role="alert">
              {orderItemsError}
            </p>
          ) : orderItems.length === 0 ? (
            <p className="rounded-xl bg-gray-50 px-3 py-2 text-sm text-gray-600">
              {RATING_NO_ELIGIBLE_PURCHASE_COPY}
            </p>
          ) : orderItems.length === 1 ? (
            <p className="rounded-xl border border-emerald-100 bg-emerald-50/60 px-3 py-2 text-sm font-medium text-emerald-900">
              {formatOrderItemLabel(orderItems[0])}
            </p>
          ) : (
            <select
              id="rating-order-item"
              aria-labelledby="rating-order-item-label"
              value={selectedOrderItemId}
              onChange={(event) => onOrderItemChange(event.target.value)}
              disabled={isSubmitting}
              className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              required
            >
              <option value="" disabled>Pilih item pesanan yang ingin dinilai</option>
              {orderItems.map((item) => (
                <option key={item.order_item_id} value={String(item.order_item_id)}>
                  {formatOrderItemLabel(item)}
                </option>
              ))}
            </select>
          )}
          {orderItems.length > 0 && !isLoadingOrderItems && !orderItemsError && (
            <p className="text-xs leading-5 text-gray-500">{RATING_VARIANT_SELECTION_COPY}</p>
          )}
        </div>

        <div className="space-y-2">
          <label id="rating-stars-label" className="text-sm font-medium text-gray-700">
            Rating wajib dipilih
          </label>
          <div className="flex flex-wrap items-center gap-1" role="group" aria-labelledby="rating-stars-label">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                aria-label={`${star} dari 5 bintang`}
                aria-pressed={rating === star}
                className={`h-8 w-8 transition-colors duration-200 sm:h-10 sm:w-10 ${star <= displayRating ? "text-yellow-400" : "text-gray-300 hover:text-yellow-200"}`}
                disabled={isSubmitting}
              >
                <svg className="h-full w-full" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
            ))}
            <span className="basis-full text-xs text-gray-600 sm:ml-2 sm:basis-auto sm:text-sm">
              {rating > 0 ? `${rating} bintang` : "Pilih rating"}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="rating-review" className="text-sm font-medium text-gray-700">
            Ulasan (Opsional)
          </label>
          <textarea
            id="rating-review"
            value={review}
            onChange={(event) => setReview(event.target.value)}
            placeholder="Bagikan pengalaman Anda dengan produk ini..."
            className="w-full resize-none rounded-lg border border-gray-300 p-3 focus:border-transparent focus:ring-2 focus:ring-primary"
            rows={4}
            maxLength={RATING_REVIEW_MAX_LENGTH}
            disabled={isSubmitting}
          />
          <div className="text-right text-xs text-gray-500" aria-live="polite">
            {review.length}/{RATING_REVIEW_MAX_LENGTH} karakter
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            disabled={!canSubmit || isSubmitting}
            className="flex-1 bg-primary text-white hover:bg-primary/90"
          >
            {isSubmitting ? "Mengirim..." : "Kirim Rating"}
          </Button>
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting} className="px-6">
              Batal
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default RatingForm;
