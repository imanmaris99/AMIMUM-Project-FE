"use client";

import Image from "next/image";
import { BrandDetailType } from "@/types/detailProduct";
import Spinner from "@/components/ui/Spinner";
import { useMemo, useState } from "react";

interface DetailBrandProps {
  brandDetail: BrandDetailType | null;
  errorMessage?: string | null;
  promoProductCount?: number; // Add promo product count
}

const DetailBrand = ({ brandDetail, errorMessage, promoProductCount }: DetailBrandProps) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  // Check if URL is external (http/https) - simple string check
  // Use regular img tag for ALL external images to prevent Next.js Image optimizer retry loops
  const isExternalUrl = useMemo(() => {
    if (!brandDetail?.photo_url || imageError) {
      return false; // Use fallback (local image)
    }
    
    // Simple check: if URL starts with http:// or https://, it's external
    const url = brandDetail.photo_url.trim();
    return url.startsWith('http://') || url.startsWith('https://');
  }, [brandDetail?.photo_url, imageError]);

  if (errorMessage) {
    return <div className="text-red-500 text-center mt-4">{errorMessage}</div>;
  }
  if (!brandDetail) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px]">
        <Spinner className="mb-2" size={40} label="Memuat detail brand..." />
        <p className="text-gray-600 text-base">Memuat detail brand...</p>
      </div>
    );
  }
  // Gunakan description_list sesuai dengan backend DTO
  const descriptionArr = brandDetail.description_list || [];
  // Use promo product count if available, otherwise fall back to total_product
  const productCount = promoProductCount ?? brandDetail.total_product ?? 0;
  return (
    <div className="mt-4 mx-6">
      <div>
        <h6 className="font-semibold font-jakarta">Produksi Oleh</h6>
      </div>
      <div className="bg-customGreen4 p-4 rounded-lg mt-4 min-h-24 flex items-center">
        <div className="flex items-center gap-4">
          {!isExternalUrl ? (
            // Use Next.js Image ONLY for local images (no server-side fetch issues)
            <Image
              src="/default-image.jpg"
              alt={brandDetail.name || "brand"}
              width={70}
              height={70}
              style={{ width: "70px", height: "70px", objectFit: "contain" }}
              unoptimized
            />
          ) : (
            // Use regular img tag for ALL external images (http/https) to prevent Next.js Image optimizer retry loops
            // This completely avoids server-side fetch attempts that cause infinite retry loops
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={brandDetail.photo_url || "/default-image.jpg"}
              alt={brandDetail.name || "brand"}
              width={70}
              height={70}
              style={{ width: "70px", height: "70px", objectFit: "contain" }}
              className="object-contain"
              onError={handleImageError}
              loading="lazy"
            />
          )}
          <div>
            <h1 className="font-bold">{brandDetail.name || "Brand Name"}</h1>
            <p className="text-xs text-gray-500">{brandDetail.category || "Brand Category"}</p>
          </div>
        </div>
      </div>
      <div className="mt-4">
        {descriptionArr.length > 0 ? (
          descriptionArr.map((desc: string, idx: number) => (
            <p key={idx} className="text-xs px-2 mb-2">{desc}</p>
          ))
        ) : (
          <p className="text-xs px-2">Deskripsi brand belum tersedia.</p>
        )}
      </div>
      <div className="mt-4 pb-4 pt-4 flex flex-col gap-2">
        <div className="flex justify-between border-b border-t border-gray-300 py-3">
          <p className="text-gray-500">Jumlah Produk</p>
          <p>{productCount} Produk</p>
        </div>
      </div>
    </div>
  );
};
export default DetailBrand;
