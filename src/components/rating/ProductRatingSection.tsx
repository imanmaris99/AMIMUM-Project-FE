"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { BadgeCheck, Star } from "lucide-react";
import { toast } from "react-hot-toast";
import LoginRequiredModal from "@/components/common/LoginRequiredModal";
import { Button } from "@/components/ui/button";
import RatingForm from "@/components/rating/RatingForm";
import { SessionManager } from "@/lib/auth";
import { RequestGeneration } from "@/lib/ratingRequestGeneration";
import {
  createProductRating,
  getProductRatings,
  ProductRatingSummary,
  ProductRatingsPageResponse,
} from "@/services/api/rating";

const PAGE_SIZE = 10;

type ReviewSort = "recent" | "highest" | "lowest";

interface ProductRatingSectionProps {
  productId: string;
  productName: string;
  onSummaryChange?: (summary: ProductRatingSummary | null) => void;
}

const formatReviewDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Tanggal ulasan tidak tersedia"
    : date.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
};

const ReviewStars = ({ rate }: { rate: number }) => (
  <div className="flex items-center gap-0.5" aria-label={`${rate} dari 5 bintang`}>
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        aria-hidden="true"
        className={`h-4 w-4 ${star <= rate ? "fill-amber-400 text-amber-400" : "text-gray-300"}`}
      />
    ))}
  </div>
);

const ProductRatingSection = ({ productId, productName, onSummaryChange }: ProductRatingSectionProps) => {
  const [page, setPage] = useState<ProductRatingsPageResponse | null>(null);
  const requestGeneration = useRef(new RequestGeneration());
  const [selectedRate, setSelectedRate] = useState<number | null>(null);
  const [sort, setSort] = useState<ReviewSort>("recent");
  const [reloadVersion, setReloadVersion] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [duplicateReview, setDuplicateReview] = useState(false);

  useEffect(() => {
    const generationTracker = requestGeneration.current;
    const generation = generationTracker.begin();
    setIsLoading(true);
    setIsLoadingMore(false);
    setLoadError("");
    setPage(null);
    onSummaryChange?.(null);

    getProductRatings(productId, { skip: 0, limit: PAGE_SIZE, rate: selectedRate, sort })
      .then((result) => {
        if (!generationTracker.isCurrent(generation)) return;
        setPage(result);
        onSummaryChange?.(result.summary);
      })
      .catch((error: unknown) => {
        if (!generationTracker.isCurrent(generation)) return;
        setLoadError(error instanceof Error ? error.message : "Ulasan produk belum bisa dimuat.");
      })
      .finally(() => {
        if (generationTracker.isCurrent(generation)) setIsLoading(false);
      });

    return () => {
      generationTracker.begin();
    };
  }, [productId, selectedRate, sort, reloadVersion, onSummaryChange]);

  const handleStartReview = () => {
    if (!SessionManager.isAuthenticated()) {
      setShowLoginModal(true);
      return;
    }
    setDuplicateReview(false);
    setShowForm((current) => !current);
  };

  const handleSubmit = async (rate: number, review: string) => {
    setIsSubmitting(true);
    setDuplicateReview(false);

    try {
      await createProductRating({ productId, rate, review });
      setShowForm(false);
      setReloadVersion((current) => current + 1);
      toast.success("Terima kasih, ulasan Anda berhasil dikirim.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Ulasan belum bisa dikirim. Silakan coba lagi.";
      setDuplicateReview(message.includes("sudah memberi rating"));
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoadMore = async () => {
    if (!page || isLoadingMore) return;
    const generation = requestGeneration.current.current();
    setIsLoadingMore(true);
    setLoadError("");

    try {
      const nextPage = await getProductRatings(productId, {
        skip: page.data.length,
        limit: PAGE_SIZE,
        rate: selectedRate,
        sort,
      });
      if (!requestGeneration.current.isCurrent(generation)) return;
      setPage((current) => current ? { ...nextPage, data: [...current.data, ...nextPage.data] } : nextPage);
      onSummaryChange?.(nextPage.summary);
    } catch (error) {
      if (!requestGeneration.current.isCurrent(generation)) return;
      setLoadError(error instanceof Error ? error.message : "Ulasan berikutnya belum bisa dimuat.");
    } finally {
      if (requestGeneration.current.isCurrent(generation)) setIsLoadingMore(false);
    }
  };

  const summary = page?.summary;
  const distribution = summary?.rating_distribution ?? {};
  const hasVerifiedReviews = (summary?.total_rater ?? 0) > 0;

  return (
    <section
      id="product-ratings"
      className="rounded-3xl bg-white/95 p-4 shadow-[0_8px_22px_rgba(15,23,42,0.08)] ring-1 ring-emerald-50"
      aria-labelledby="product-ratings-heading"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">Pengalaman pembeli</p>
          <h2 id="product-ratings-heading" className="mt-1 text-base font-bold text-[#0D0E09]">Rating & ulasan</h2>
          <p className="mt-1 text-xs leading-5 text-[#6B7C73]">Ulasan publik hanya menampilkan pembelian yang terverifikasi.</p>
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

      {isLoading ? (
        <div className="mt-4 rounded-2xl bg-emerald-50/60 p-5 text-center text-sm text-emerald-900" role="status">
          Memuat rating pembeli terverifikasi…
        </div>
      ) : loadError && !page ? (
        <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-900" role="alert">
          <p>{loadError}</p>
          <Button type="button" variant="outline" onClick={() => setReloadVersion((current) => current + 1)} className="mt-3 border-amber-300">
            Coba lagi
          </Button>
        </div>
      ) : page && (
        <>
          <div className="mt-4 grid gap-4 rounded-2xl bg-emerald-50/60 p-4 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
            <div className="flex flex-col items-center justify-center rounded-2xl bg-white/80 p-3 text-center">
              <p className="text-3xl font-extrabold text-[#0D0E09]">
                {hasVerifiedReviews ? summary?.avg_rating.toFixed(1) : "—"}
                <span className="ml-1 text-sm font-semibold text-gray-500">/ 5</span>
              </p>
              <div className="mt-1 flex" aria-label={hasVerifiedReviews ? `${summary?.avg_rating.toFixed(1)} dari 5` : "Belum ada rating terverifikasi"}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} aria-hidden="true" className={`h-4 w-4 ${hasVerifiedReviews && star <= Math.round(summary?.avg_rating ?? 0) ? "fill-amber-400 text-amber-400" : "text-gray-300"}`} />
                ))}
              </div>
              <p className="mt-1 text-xs text-[#6B7C73]">
                {summary?.total_rater ?? 0} ulasan terverifikasi
              </p>
            </div>

            <div className="space-y-1" aria-label="Distribusi rating terverifikasi">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = Number(distribution[String(star)] ?? 0);
                const percentage = summary?.total_rater ? (count / summary.total_rater) * 100 : 0;
                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setSelectedRate((current) => current === star ? null : star)}
                    aria-pressed={selectedRate === star}
                    aria-label={`Filter ${star} bintang, ${count} ulasan`}
                    className={`grid w-full grid-cols-[3.5rem_1fr_2rem] items-center gap-2 rounded-lg px-2 py-1 text-left text-xs transition ${selectedRate === star ? "bg-emerald-100" : "hover:bg-white/70"}`}
                  >
                    <span className="font-medium text-gray-700">{star} bintang</span>
                    <span className="h-2 overflow-hidden rounded-full bg-gray-200">
                      <span className="block h-full rounded-full bg-amber-400" style={{ width: `${percentage}%` }} />
                    </span>
                    <span className="text-right text-gray-600">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSelectedRate(null)}
                aria-pressed={selectedRate === null}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold ${selectedRate === null ? "bg-emerald-700 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
              >
                Semua ({summary?.total_rater ?? 0})
              </button>
              {selectedRate !== null && (
                <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800">
                  Filter {selectedRate} bintang
                </span>
              )}
            </div>
            <label className="flex items-center gap-2 text-xs text-gray-600">
              Urutkan
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value as ReviewSort)}
                className="max-w-[10rem] rounded-xl border border-gray-200 bg-white px-2 py-2 text-xs text-gray-800 outline-none focus:border-emerald-600"
                aria-label="Urutkan ulasan"
              >
                <option value="recent">Terbaru</option>
                <option value="highest">Rating tertinggi</option>
                <option value="lowest">Rating terendah</option>
              </select>
            </label>
          </div>

          {page.data.length === 0 ? (
            <div className="py-8 text-center">
              <p className="font-semibold text-gray-800">
                {hasVerifiedReviews ? "Tidak ada ulasan pada filter ini." : "Belum ada ulasan terverifikasi."}
              </p>
              <p className="mt-1 text-sm leading-5 text-gray-500">
                {hasVerifiedReviews ? "Coba pilih rating lain atau tampilkan semua ulasan." : "Ulasan akan tampil setelah pembeli menyelesaikan pesanan dan mengirim rating."}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {page.data.map((review) => (
                <article key={review.id} className="py-4 first:pt-4">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="text-sm font-semibold text-gray-900">{review.rater_name || "Pembeli"}</span>
                    {review.verified_purchase && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-800">
                        <BadgeCheck aria-hidden="true" className="h-3.5 w-3.5" />
                        Pembelian terverifikasi
                      </span>
                    )}
                    <time className="text-xs text-gray-500" dateTime={review.created_at}>{formatReviewDate(review.created_at)}</time>
                  </div>
                  <div className="mt-2"><ReviewStars rate={review.rate} /></div>
                  {review.review?.trim() ? (
                    <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-gray-700">{review.review.trim()}</p>
                  ) : (
                    <p className="mt-2 text-sm italic text-gray-500">Pembeli memberi rating tanpa ulasan tertulis.</p>
                  )}
                </article>
              ))}
            </div>
          )}

          {loadError && <p className="mt-3 text-sm text-amber-800" role="alert">{loadError}</p>}
          {page.has_more && (
            <Button type="button" variant="outline" onClick={handleLoadMore} disabled={isLoadingMore} className="mt-3 w-full border-emerald-200 text-emerald-800">
              {isLoadingMore ? "Memuat ulasan…" : "Muat ulasan lainnya"}
            </Button>
          )}
        </>
      )}

      {showForm && (
        <RatingForm
          productName={productName}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
          isSubmitting={isSubmitting}
          className="mt-4 rounded-2xl border-emerald-100 p-4 shadow-none"
        />
      )}
      {duplicateReview && (
        <div className="mt-3 rounded-2xl bg-amber-50 p-3 text-sm text-amber-900" role="status">
          Rating produk ini sudah pernah dikirim dari akun Anda. Buka halaman Rating & Ulasan Saya untuk mengeditnya.
          <Link href="/my-ratings" className="ml-1 inline-flex font-semibold underline underline-offset-2">Edit rating</Link>
        </div>
      )}

      <p className="mt-3 text-xs leading-5 text-gray-500">
        Nama pembeli disamarkan. Rating hanya dapat diberikan oleh akun pemilik pesanan produk berstatus selesai; satu akun dapat memberi satu rating per produk.
      </p>

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
