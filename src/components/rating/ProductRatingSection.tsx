"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import LoginRequiredModal from "@/components/common/LoginRequiredModal";
import { Button } from "@/components/ui/button";
import RatingDisplay from "@/components/rating/RatingDisplay";
import RatingForm from "@/components/rating/RatingForm";
import { SessionManager } from "@/lib/auth";
import { createProductRating } from "@/services/api/rating";

interface ProductRatingSectionProps {
  productId: string;
  productName: string;
  averageRating?: number;
  totalRatings?: number;
}

const ProductRatingSection = ({
  productId,
  productName,
  averageRating = 0,
  totalRatings = 0,
}: ProductRatingSectionProps) => {
  const [summary, setSummary] = useState({
    averageRating: Number.isFinite(averageRating) ? averageRating : 0,
    totalRatings: Number.isFinite(totalRatings) ? totalRatings : 0,
  });
  const [showForm, setShowForm] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStartReview = () => {
    if (!SessionManager.isAuthenticated()) {
      setShowLoginModal(true);
      return;
    }

    setShowForm((current) => !current);
  };

  const handleSubmit = async (rate: number, review: string) => {
    setIsSubmitting(true);

    try {
      await createProductRating({ productId, rate, review });
      setSummary((current) => {
        const nextTotal = current.totalRatings + 1;
        return {
          totalRatings: nextTotal,
          averageRating: Number(((current.averageRating * current.totalRatings + rate) / nextTotal).toFixed(1)),
        };
      });
      setShowForm(false);
      toast.success("Terima kasih, ulasan Anda berhasil dikirim.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Ulasan belum bisa dikirim. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      className="rounded-3xl bg-white/95 p-4 shadow-[0_8px_22px_rgba(15,23,42,0.08)] ring-1 ring-emerald-50"
      aria-labelledby="product-ratings-heading"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">Pengalaman pembeli</p>
          <h2 id="product-ratings-heading" className="mt-1 text-base font-bold text-[#0D0E09]">Rating & ulasan</h2>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={handleStartReview}
          aria-expanded={showForm}
          className="shrink-0 border-emerald-700 px-3 py-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-50"
        >
          {showForm ? "Tutup form" : "Tulis ulasan"}
        </Button>
      </div>

      <div className="mt-3 rounded-2xl bg-emerald-50/70 p-3">
        <RatingDisplay
          ratingData={{
            avg_rating: summary.averageRating,
            total_rater: summary.totalRatings,
            rating_distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
            recent_reviews: [],
          }}
        />
      </div>
      <p className="mt-3 text-xs leading-5 text-[#52665B]">
        Ulasan baru hanya dapat dikirim oleh akun pemilik pesanan produk yang sudah selesai. Setiap akun dapat memberi satu rating per produk.
      </p>

      {showForm && (
        <RatingForm
          productName={productName}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
          isSubmitting={isSubmitting}
          className="mt-4 rounded-2xl border-emerald-100 p-4 shadow-none"
        />
      )}

      <LoginRequiredModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        feature="general"
        title="Login untuk menulis ulasan"
        description="Login terlebih dahulu. Rating hanya bisa dikirim oleh akun yang memiliki pesanan produk ini dengan status selesai."
        redirectAfterLogin={`/detail-product/${productId}`}
      />
    </section>
  );
};

export default ProductRatingSection;
