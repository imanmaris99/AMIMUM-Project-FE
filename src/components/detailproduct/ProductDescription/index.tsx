"use client";
import React, { useState } from "react";
import { DetailProductType } from "@/types/detailProduct";
import Spinner from "@/components/ui/Spinner";

interface ProductDescriptionProps {
  data: DetailProductType | undefined;
  isError: number;
  isLoading: boolean;
}

const ProductDescriptionSkeleton = () => (
  <div className="border border-gray-300 p-4 rounded-lg shadow-sm animate-pulse">
    <div className="h-6 w-1/3 bg-gray-300 rounded mb-2" />
    <div className="space-y-2">
      <div className="h-4 w-full bg-gray-300 rounded" />
      <div className="h-4 w-5/6 bg-gray-300 rounded" />
      <div className="h-4 w-2/3 bg-gray-300 rounded" />
    </div>
  </div>
);

const ProductDescription = ({
  isError,
  isLoading,
  data,
}: ProductDescriptionProps) => {
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Gabungkan semua elemen description_list menjadi satu string
  const fullDescription = data?.description_list.join(" ") || "";
  const isLongDescription = fullDescription.length > 500;

  // Fungsi untuk toggle teks tambahan
  const handleReadMore = () => {
    setShowFullDescription((prev) => !prev);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[120px]">
        <Spinner className="mb-2" size={32} label="Memuat deskripsi produk..." />
        <p className="text-gray-600 text-sm">Memuat deskripsi produk...</p>
      </div>
    );
  }

  if (isError) {
    switch (isError) {
      case 403:
        return (
          <div>
            Token tidak valid atau pengguna tidak terautentikasi. Silakan coba
            lagi nanti.
          </div>
        );
      case 404:
        return (
          <div>
            Pengguna tidak ditemukan atau tidak memiliki rating produk. Silakan
            coba lagi nanti.
          </div>
        );
      case 409:
        return (
          <div>
            Terjadi konflik saat mengakses data. Silakan coba lagi nanti.
          </div>
        );
      case 500:
        return <div>Terjadi kesalahan server. Silakan coba lagi nanti.</div>;
      default:
        break;
    }
  }

  return (
    <div className="border border-gray-300 rounded-lg shadow-sm">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-2">Deskripsi Produk</h2>
      <p className="text-gray-500 text-sm">
        {data?.description_list[0]}{" "}
        {showFullDescription && (
          <span>{data?.description_list.slice(1).join(" ")}</span>
        )}
        {isLongDescription && (
          <span
            className="text-green-600 flex items-center hover:underline cursor-pointer"
            onClick={handleReadMore}
          >
            {showFullDescription ? "Show Less" : "Read More"}
          </span>
        )}
      </p>
      </div>
    </div>
  );
};

export default ProductDescription;
