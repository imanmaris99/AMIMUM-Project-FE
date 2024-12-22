"use client";
import React, { useState } from "react";
import { DetailProductType } from "@/types/detailProduct";

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

  // Gabungkan semua elemen description_list menjadi satu string
  const fullDescription = data?.description_list.join(" ") || "";
  const isLongDescription = fullDescription.length > 500;

  // Fungsi untuk toggle teks tambahan
  const handleReadMore = () => {
    setShowFullDescription((prev) => !prev);
  };

  if (isLoading) {
    return <div>Loading...</div>;
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
    <div className="border border-gray-300 p-4 rounded-lg shadow-sm">
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
  );
};

export default ProductDescription;
