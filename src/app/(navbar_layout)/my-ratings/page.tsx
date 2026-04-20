"use client";

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import {
  deleteProductRating,
  getMyProductRatings,
  ProductRatingItem,
  updateProductRating,
} from '@/services/api/rating';

export default function MyRatingsPage() {
  const [ratings, setRatings] = useState<ProductRatingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRating, setSelectedRating] = useState<ProductRatingItem | null>(null);
  const [editableRate, setEditableRate] = useState(0);
  const [editableReview, setEditableReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadRatings = async () => {
      try {
        const response = await getMyProductRatings();
        setRatings(response.data);
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Gagal mengambil rating Anda."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadRatings();
  }, []);

  const handleEditRating = (rating: ProductRatingItem) => {
    setSelectedRating(rating);
    setEditableRate(rating.rate);
    setEditableReview(rating.review || "");
  };

  const handleDeleteRating = async (ratingId: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus rating ini?")) {
      try {
        await deleteProductRating(ratingId);
        setRatings((prev) => prev.filter((rating) => rating.id !== ratingId));
        setSelectedRating(null);
        toast.success("Rating berhasil dihapus.");
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Gagal menghapus rating."
        );
      }
    }
  };

  const handleSubmitEdit = async () => {
    if (!selectedRating) {
      return;
    }

    setIsSubmitting(true);

    try {
      await updateProductRating({
        ratingId: selectedRating.id,
        rate: editableRate,
        review: editableReview,
      });

      setRatings((prev) =>
        prev.map((rating) =>
          rating.id === selectedRating.id
            ? {
                ...rating,
                rate: editableRate,
                review: editableReview,
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

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat rating Anda...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Rating Saya</h1>
        <p className="text-gray-600">
          Kelola rating dan ulasan yang telah Anda berikan
        </p>
      </div>

      {ratings.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.364 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.364-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Belum Ada Rating</h3>
          <p className="text-gray-600 mb-4">
            Anda belum memberikan rating untuk produk apapun.
          </p>
          <Button 
            onClick={() => window.history.back()}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            Kembali ke Produk
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {ratings.map((rating) => (
            <div key={rating.id} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {rating.product_name}
                  </h3>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className={`w-4 h-4 ${
                            star <= rating.rate
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
                      {rating.rate} bintang
                    </span>
                  </div>
                  {rating.review && (
                    <p className="text-gray-700 mb-2">{rating.review}</p>
                  )}
                  <p className="text-xs text-gray-500">
                    Diberikan pada {new Date(rating.created_at).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div className="flex gap-2">
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
                      onClick={() => void handleDeleteRating(rating.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      Hapus
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Rating Modal */}
      {selectedRating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Edit Rating</h3>
              <p className="text-sm text-gray-600 mb-4">
                Rating untuk: {selectedRating.product_name}
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
                        className={`${
                          star <= editableRate
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                      >
                        <svg
                          className="w-6 h-6"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
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
                    placeholder="Bagikan pengalaman Anda terhadap produk ini"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={() => setSelectedRating(null)}
                    className="flex-1"
                    variant="outline"
                  >
                    Tutup
                  </Button>
                  <Button
                    onClick={() => void handleSubmitEdit()}
                    disabled={isSubmitting || editableRate < 1}
                    className="flex-1 bg-primary hover:bg-primary/90 text-white"
                  >
                    {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
