"use client";
import React, { useState } from "react";
import { DetailProductType } from "@/types/detailProduct";
import Spinner from "@/components/ui/Spinner";

interface ProductDescriptionProps {
  data: DetailProductType | undefined;
  isError: number;
  isLoading: boolean;
}

const ProductDescription = ({
  isError,
  isLoading,
  data,
}: ProductDescriptionProps) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const descriptionItems = Array.isArray(data?.description_list)
    ? data.description_list.map((item) => item?.trim()).filter(Boolean)
    : [];
  const fullDescription = descriptionItems.join(" ");
  const isLongDescription = fullDescription.length > 500;
  const visibleDescription = showFullDescription || !isLongDescription
    ? fullDescription
    : fullDescription.slice(0, 500).trimEnd();

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
    return <div className="text-sm text-gray-600">Deskripsi produk belum bisa dimuat. Silakan coba lagi nanti.</div>;
  }

  return (
    <div className="border border-gray-300 rounded-lg shadow-sm">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-2">Deskripsi Produk</h2>
        {fullDescription ? (
          <p className="text-gray-500 text-sm whitespace-pre-line">
            {visibleDescription}{isLongDescription && !showFullDescription ? "..." : ""}
            {isLongDescription && (
              <button
                type="button"
                className="text-green-600 flex items-center hover:underline cursor-pointer mt-2"
                onClick={handleReadMore}
              >
                {showFullDescription ? "Tampilkan lebih sedikit" : "Baca selengkapnya"}
              </button>
            )}
          </p>
        ) : (
          <p className="text-gray-500 text-sm">
            Deskripsi produk belum tersedia di katalog. Silakan hubungi admin toko jika membutuhkan informasi produk sebelum membeli.
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductDescription;
