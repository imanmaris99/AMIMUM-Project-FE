"use client";
import React, { useState } from "react";

const ProductDescription = () => {
  // State untuk mengontrol apakah teks tambahan ditampilkan
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Fungsi untuk toggle teks tambahan
  const handleReadMore = () => {
    setShowFullDescription((prev) => !prev);
  };

  return (
    <div className="border border-gray-300 p-4 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-2">Deskripsi Produk</h2>
      <p className="text-gray-500 text-sm">
        Jamu Buyung Upik adalah jamu anak-anak yang mengandung berbagai rasa
        buah yang aman dikonsumsi. Selain rasanya yang enak dan disukai
        anak-anak, jamu ini juga berkhasiat untuk memelihara daya tahan tubuh
        anak, memperbaiki nafsu makan & secara tradisional digunakan pada
        penderita cacingan.{" "}
        {showFullDescription && (
          <span>
            Jamu ini terbuat dari bahan-bahan alami pilihan, diproses secara
            higienis untuk memastikan kualitas terbaik. Dapat dikonsumsi secara
            rutin tanpa efek samping. Cocok untuk semua anak di atas usia 2
            tahun.
          </span>
        )}
        <span
          className="text-green-600 flex items-center hover:underline cursor-pointer"
          onClick={handleReadMore}
        >
          {showFullDescription ? "Show Less" : "Read More"}
        </span>
      </p>
    </div>
  );
};

export default ProductDescription;
