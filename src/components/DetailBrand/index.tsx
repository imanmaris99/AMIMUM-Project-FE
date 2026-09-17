"use client";

import Image from "next/image";
import { BrandDetailType } from "@/types/detailProduct";
import Spinner from "@/components/ui/Spinner";
import { useMemo, useState } from "react";

interface DetailBrandProps {
  brandDetail: BrandDetailType | null;
  errorMessage?: string | null;
  promoProductCount?: number;
  totalProductCount?: number;
}

const DetailBrand = ({ brandDetail, errorMessage, promoProductCount, totalProductCount }: DetailBrandProps) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const isExternalUrl = useMemo(() => {
    if (!brandDetail?.photo_url || imageError) {
      return false;
    }

    const url = brandDetail.photo_url.trim();
    return url.startsWith("http://") || url.startsWith("https://");
  }, [brandDetail?.photo_url, imageError]);

  if (!brandDetail && errorMessage) {
    return (
      <div className="mt-4 mx-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
        {errorMessage}
      </div>
    );
  }

  if (!brandDetail) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px]">
        <Spinner className="mb-2" size={40} label="Memuat detail brand..." />
        <p className="text-gray-600 text-base">Memuat detail brand...</p>
      </div>
    );
  }

  const descriptionArr = Array.isArray(brandDetail.description_list)
    ? brandDetail.description_list.map((desc) => desc?.trim()).filter(Boolean)
    : [];
  const productCount = Number.isFinite(Number(totalProductCount))
    ? Number(totalProductCount)
    : Number.isFinite(Number(promoProductCount))
      ? Number(promoProductCount)
      : Number(brandDetail.total_product || 0);
  const brandName = brandDetail.name?.trim() || "Brand produk";
  const brandCategory = brandDetail.category?.trim() || "Kategori brand belum tersedia";

  return (
    <div className="mt-4 mx-6">
      {errorMessage && (
        <div className="mb-3 rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-xs text-yellow-800">
          {errorMessage}
        </div>
      )}
      <div>
        <h6 className="font-semibold font-jakarta">Produksi Oleh</h6>
      </div>
      <div className="bg-customGreen4 p-4 rounded-lg mt-4 min-h-24 flex items-center">
        <div className="flex items-center gap-4">
          {!isExternalUrl ? (
            <Image
              src="/default-image.jpg"
              alt={brandName}
              width={70}
              height={70}
              style={{ width: "70px", height: "70px", objectFit: "contain" }}
              unoptimized
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={brandDetail.photo_url || "/default-image.jpg"}
              alt={brandName}
              width={70}
              height={70}
              style={{ width: "70px", height: "70px", objectFit: "contain" }}
              className="object-contain"
              onError={handleImageError}
              loading="lazy"
            />
          )}
          <div>
            <h1 className="font-bold">{brandName}</h1>
            <p className="text-xs text-gray-500">{brandCategory}</p>
          </div>
        </div>
      </div>
      <div className="mt-4">
        {descriptionArr.length > 0 ? (
          descriptionArr.map((desc: string, idx: number) => (
            <p key={idx} className="text-xs px-2 mb-2">{desc}</p>
          ))
        ) : (
          <p className="text-xs px-2">Deskripsi brand belum tersedia di katalog toko.</p>
        )}
      </div>
      <div className="mt-4 pb-4 pt-4 flex flex-col gap-2">
        <div className="flex justify-between border-b border-t border-gray-300 py-3">
          <p className="text-gray-500">Jumlah produk katalog</p>
          <p>{productCount} produk</p>
        </div>
      </div>
    </div>
  );
};

export default DetailBrand;
