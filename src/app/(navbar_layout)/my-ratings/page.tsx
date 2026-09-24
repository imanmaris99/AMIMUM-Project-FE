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
      <div className="min-h-screen bg-[#FAFAFA] pb-24">
        <UnifiedHeader
          type="main"
          showSearch={false}
          showCart={true}
          showNotifications={true}
        />

        <div className="px-6 py-5">
          <div className="mb-6">
            <h1 className="text-xl font-bold text-gray-900 mb-2">Rating Saya</h1>
            <p className="text-sm text-gray-600">
              Kelola rating dan ulasan yang benar-benar pernah Anda berikan melalui akun ini.
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-600 text-sm">Memuat rating Anda...</p>
              </div>
            </div>
          ) : ratings.length === 0 ? (
            <div className="text-center py-14 rounded-2xl border border-dashed border-gray-200 bg-white px-5">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.364 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.364-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Belum Ada Rating</h3>
              <p className="text-gray-600 text-sm mb-5 max-w-xs mx-auto">
                Belum ada rating produk dari akun Anda. Rating akan muncul setelah Anda memberi ulasan pada produk yang pernah dibeli.
              </p>
              <Button asChild className="bg-primary hover:bg-primary/90 text-white">
                <Link href="/transaction">Lihat Riwayat Pesanan</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {ratings.map((rating) => (
                <div key={rating.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-gray-900 mb-2 truncate">
                        {rating.product_name || 'Produk tidak tersedia'}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
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
                        <span className="text-sm text-gray-600">{rating.rate > 0 ? `${rating.rate} bintang` : "Rating belum valid"}</span>
                      </div>
                      {rating.review ? (
                        <p className="text-sm text-gray-700 mb-2 whitespace-pre-line">{rating.review}</p>
                      ) : (
                        <p className="text-sm text-gray-500 mb-2 italic">Tanpa ulasan tertulis.</p>
                      )}
                      <p className="text-xs text-gray-500">
                        Diberikan pada {formatRatingDate(rating.created_at)}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditRating(rating)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={deletingRatingId === rating.id}
                        onClick={() => requestDeleteRating(rating)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 disabled:opacity-60"
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
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[80]">
            <div className="bg-white rounded-2xl max-w-md w-full max-h-[calc(100dvh-2rem)] overflow-y-auto pb-[calc(1rem+env(safe-area-inset-bottom))]">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Edit Rating</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Rating untuk: {selectedRating.product_name || 'Produk tidak tersedia'}
                </p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ulasan
                    </label>
                    <textarea
                      value={editableReview}
                      onChange={(event) => setEditableReview(event.target.value)}
                      rows={4}
                      className="w-full rounded border border-gray-300 p-3 text-sm text-gray-700"
                      maxLength={500}
                      placeholder="Bagikan pengalaman Anda terhadap produk ini"
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={() => setSelectedRating(null)}
                      className="flex-1"
                      variant="outline"
                      disabled={isSubmitting}
                    >
                      Tutup
                    </Button>
                    <Button
                      onClick={() => void handleSubmitEdit()}
                      disabled={isSubmitting || editableRate < 1}
                      className="flex-1 bg-primary hover:bg-primary/90 text-white disabled:opacity-60"
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
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[80]">
            <div className="bg-white rounded-2xl max-w-sm w-full max-h-[calc(100dvh-2rem)] overflow-y-auto pb-[calc(1rem+env(safe-area-inset-bottom))]">
              <div className="p-5 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Hapus Rating?</h3>
                  <p className="text-sm text-gray-600 mt-2">
                    Rating untuk <span className="font-medium">{pendingDeleteRating.product_name || 'Produk katalog'}</span> akan dihapus dari akun Anda.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    disabled={deletingRatingId === pendingDeleteRating.id}
                    onClick={() => setPendingDeleteRating(null)}
                  >
                    Batal
                  </Button>
                  <Button
                    type="button"
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white disabled:opacity-60"
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
