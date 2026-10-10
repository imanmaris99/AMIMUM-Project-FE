"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import LoginProtection from '@/components/common/LoginProtection';
import UnifiedHeader from '@/components/common/UnifiedHeader';
import {
  deleteProductRating,
  getMyProductRatings,
  ProductRatingItem,
  updateProductRating,
} from '@/services/api/rating';

const formatRatingDate = (value: string) => {
  const parsedDate = new Date(value);

  if (!value || Number.isNaN(parsedDate.getTime())) {
    return 'Tanggal tidak tersedia';
  }

  return parsedDate.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const sanitizeRatingItem = (rating: ProductRatingItem): ProductRatingItem => {
  const rate = Number(rating.rate);

  return {
    ...rating,
    rate: Number.isInteger(rate) && rate >= 1 && rate <= 5 ? rate : 0,
    review: rating.review?.trim() || "",
    product_name: rating.product_name?.trim() || "Produk katalog",
  };
};

export default function MyRatingsPage() {
  const [ratings, setRatings] = useState<ProductRatingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRating, setSelectedRating] = useState<ProductRatingItem | null>(null);
  const [editableRate, setEditableRate] = useState(0);
  const [editableReview, setEditableReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingRatingId, setDeletingRatingId] = useState<number | null>(null);
  const [pendingDeleteRating, setPendingDeleteRating] = useState<ProductRatingItem | null>(null);

  useEffect(() => {
    const loadRatings = async () => {
      try {
        const response = await getMyProductRatings();
        setRatings(Array.isArray(response.data) ? response.data.map(sanitizeRatingItem) : []);
      } catch {
        toast.error("Rating Anda belum bisa dimuat. Silakan coba lagi beberapa saat lagi.");
        setRatings([]);
      } finally {
        setIsLoading(false);
      }
    };

    void loadRatings();
  }, []);

  const handleEditRating = (rating: ProductRatingItem) => {
    setSelectedRating(rating);
    setEditableRate(rating.rate > 0 ? rating.rate : 0);
    setEditableReview(rating.review || "");
  };

  useEffect(() => {
    if (!pendingDeleteRating && !selectedRating) return;

    const scrollY = window.scrollY;
    const { body, documentElement } = document;
    const previousBodyOverflow = body.style.overflow;
    const previousBodyPosition = body.style.position;
    const previousBodyTop = body.style.top;
    const previousBodyWidth = body.style.width;
    const previousHtmlOverflow = documentElement.style.overflow;

    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";
    documentElement.style.overflow = "hidden";

    return () => {
      body.style.overflow = previousBodyOverflow;
      body.style.position = previousBodyPosition;
      body.style.top = previousBodyTop;
      body.style.width = previousBodyWidth;
      documentElement.style.overflow = previousHtmlOverflow;
      window.scrollTo(0, scrollY);
    };
  }, [pendingDeleteRating, selectedRating]);

  const requestDeleteRating = (rating: ProductRatingItem) => {
    setPendingDeleteRating(rating);
  };

  const handleDeleteRating = async () => {
    if (!pendingDeleteRating) {
      return;
    }

    try {
      setDeletingRatingId(pendingDeleteRating.id);
      await deleteProductRating(pendingDeleteRating.id);
      setRatings((prev) => prev.filter((rating) => rating.id !== pendingDeleteRating.id));
      setSelectedRating((current) => current?.id === pendingDeleteRating.id ? null : current);
      setPendingDeleteRating(null);
      toast.success("Rating berhasil dihapus.");
    } catch {
      toast.error("Rating belum bisa dihapus. Silakan coba lagi beberapa saat lagi.");
    } finally {
      setDeletingRatingId(null);
    }
  };

  const handleSubmitEdit = async () => {
    if (!selectedRating || editableRate < 1 || editableRate > 5) {
      toast.error("Pilih rating 1 sampai 5 bintang sebelum menyimpan ulasan.");
      return;
    }

    if (editableReview.trim().length > 500) {
      toast.error("Ulasan maksimal 500 karakter.");
      return;
    }

    setIsSubmitting(true);

    try {
      await updateProductRating({
        ratingId: selectedRating.id,
        rate: editableRate,
        review: editableReview.trim(),
      });

      setRatings((prev) =>
        prev.map((rating) =>
          rating.id === selectedRating.id
            ? {
                ...rating,
                rate: editableRate,
                review: editableReview.trim(),
              }
            : rating
        )
      );
      setSelectedRating(null);
      toast.success("Rating berhasil diperbarui.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Gagal memperbarui rating."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LoginProtection useModal={true} feature="general">
      <div className="min-h-screen bg-transparent pb-24">
        <UnifiedHeader
          type="main"
          showSearch={false}
          showCart={true}
          showNotifications={true}
        />

        <div className="px-4 py-4 pb-[calc(6.5rem+env(safe-area-inset-bottom))]">
          <section className="mb-4 rounded-3xl bg-white/95 p-4 shadow-[0_8px_22px_rgba(15,23,42,0.08)] ring-1 ring-emerald-100">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">Akun customer</p>
            <h1 className="mt-1 text-lg font-bold text-[#0D0E09]">Rating & Ulasan Saya</h1>
            <p className="mt-1 text-xs leading-5 text-[#6B7C73]">
              Kelola ulasan produk yang pernah Anda berikan melalui akun ini.
            </p>
          </section>

          {isLoading ? (
            <div className="rounded-3xl bg-white/95 p-8 text-center shadow-[0_8px_22px_rgba(15,23,42,0.08)] ring-1 ring-emerald-50">
              <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
              <p className="text-sm text-[#6B7C73]">Memuat rating dan ulasan Anda...</p>
            </div>
          ) : ratings.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-emerald-100 bg-white/95 px-5 py-12 text-center shadow-[0_8px_22px_rgba(15,23,42,0.08)]">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
                <svg className="h-8 w-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.364 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.364-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-bold text-[#0D0E09]">Belum Ada Rating</h3>
              <p className="mx-auto mb-5 max-w-xs text-sm leading-6 text-[#6B7C73]">
                Belum ada rating produk dari akun Anda. Rating akan muncul setelah Anda memberi ulasan pada produk yang pernah dibeli.
              </p>
              <Button asChild className="rounded-2xl bg-primary px-5 py-3 text-white hover:bg-primary/90">
                <Link href="/transaction">Lihat Riwayat Pesanan</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {ratings.map((rating) => (
                <div key={rating.id} className="rounded-3xl bg-white/95 p-4 shadow-[0_8px_22px_rgba(15,23,42,0.08)] ring-1 ring-emerald-50">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="mb-2 break-words text-base font-bold text-[#0D0E09]">
                        {rating.product_name || 'Produk tidak tersedia'}
                      </h3>
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <div className="flex items-center" aria-label={rating.rate > 0 ? `${rating.rate} dari 5 bintang` : "Rating belum valid"}>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              className={`w-4 h-4 ${star <= rating.rate ? "text-yellow-400" : "text-gray-300"}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">{rating.rate > 0 ? `${rating.rate} bintang` : "Rating belum valid"}</span>
                      </div>
                      {rating.review ? (
                        <p className="mb-3 whitespace-pre-line rounded-2xl bg-emerald-50/60 px-3 py-2 text-sm leading-6 text-[#4B5C54]">{rating.review}</p>
                      ) : (
                        <p className="mb-3 rounded-2xl bg-gray-50 px-3 py-2 text-sm italic text-gray-500">Tanpa ulasan tertulis.</p>
                      )}
                      <p className="text-xs text-[#6B7C73]">
                        Diberikan pada {formatRatingDate(rating.created_at)}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditRating(rating)}
                        className="rounded-2xl border-emerald-200 text-primary hover:bg-emerald-50"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={deletingRatingId === rating.id}
                        onClick={() => requestDeleteRating(rating)}
                        className="rounded-2xl border-red-100 text-red-600 hover:bg-red-50 hover:text-red-700 disabled:opacity-60"
                      >
                        {deletingRatingId === rating.id ? "Hapus..." : "Hapus"}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedRating && (
          <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/50 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
            <div className="max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto rounded-3xl bg-white pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-2xl">
              <div className="p-5">
                <div className="mb-4 rounded-3xl bg-white p-4 text-center shadow-[0_8px_22px_rgba(15,23,42,0.08)] ring-1 ring-emerald-50">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">Ulasan produk</p>
                  <h3 className="mt-1 text-lg font-bold text-[#0D0E09]">Edit Rating</h3>
                  <p className="mt-2 text-sm leading-6 text-[#6B7C73]">
                    {selectedRating.product_name || 'Produk tidak tersedia'}
                  </p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#0D0E09]">
                      Pilih Rating
                    </label>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setEditableRate(star)}
                          className={`${star <= editableRate ? "text-yellow-400" : "text-gray-300"}`}
                          aria-label={`${star} bintang`}
                        >
                          <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#0D0E09]">
                      Ulasan
                    </label>
                    <textarea
                      value={editableReview}
                      onChange={(event) => setEditableReview(event.target.value)}
                      rows={4}
                      className="min-h-[120px] w-full resize-none rounded-2xl border border-emerald-100 bg-emerald-50/60 p-3 text-sm leading-6 text-[#0D0E09] outline-none"
                      maxLength={500}
                      placeholder="Bagikan pengalaman Anda terhadap produk ini"
                    />
                  </div>
                  <div className="sticky bottom-0 -mx-5 flex gap-3 bg-white/95 px-5 pt-4 backdrop-blur">
                    <Button
                      onClick={() => setSelectedRating(null)}
                      className="flex-1 rounded-2xl"
                      variant="outline"
                      disabled={isSubmitting}
                    >
                      Tutup
                    </Button>
                    <Button
                      onClick={() => void handleSubmitEdit()}
                      disabled={isSubmitting || editableRate < 1}
                      className="flex-1 rounded-2xl bg-primary text-white hover:bg-primary/90 disabled:opacity-60"
                    >
                      {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {pendingDeleteRating && (
          <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/50 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
            <div className="max-h-[calc(100dvh-2rem)] w-full max-w-sm overflow-y-auto rounded-3xl bg-white pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-2xl">
              <div className="space-y-4 p-5">
                <div className="rounded-3xl bg-white p-4 text-center shadow-[0_8px_22px_rgba(15,23,42,0.08)] ring-1 ring-red-100">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-red-600">Konfirmasi</p>
                  <h3 className="mt-1 text-lg font-bold text-gray-900">Hapus Rating?</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    Rating untuk <span className="font-semibold">{pendingDeleteRating.product_name || 'Produk katalog'}</span> akan dihapus dari akun Anda.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 rounded-2xl"
                    disabled={deletingRatingId === pendingDeleteRating.id}
                    onClick={() => setPendingDeleteRating(null)}
                  >
                    Batal
                  </Button>
                  <Button
                    type="button"
                    className="flex-1 rounded-2xl bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
                    disabled={deletingRatingId === pendingDeleteRating.id}
                    onClick={() => void handleDeleteRating()}
                  >
                    {deletingRatingId === pendingDeleteRating.id ? "Menghapus..." : "Hapus Rating"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </LoginProtection>
  );
}
