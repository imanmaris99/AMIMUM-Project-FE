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
      <div className="mx-4 mt-4 rounded-3xl border border-amber-100 bg-amber-50 p-4 text-sm leading-5 text-amber-800 shadow-[0_8px_22px_rgba(15,23,42,0.06)] sm:mx-6">
        {errorMessage}
      </div>
    );
  }

  if (!brandDetail) {
    return (
      <div className="mx-4 mt-4 flex min-h-[200px] flex-col items-center justify-center rounded-3xl bg-white/95 p-6 shadow-[0_8px_22px_rgba(15,23,42,0.08)] sm:mx-6">
        <Spinner className="mb-2" size={40} label="Memuat detail brand..." />
        <p className="text-base text-[#6B7C73]">Memuat detail brand...</p>
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
    <section className="mx-4 mt-4 space-y-3 sm:mx-6">
      {errorMessage && (
        <div className="rounded-3xl border border-amber-100 bg-amber-50 p-3 text-xs leading-5 text-amber-800 shadow-[0_8px_22px_rgba(15,23,42,0.06)]">
          {errorMessage}
        </div>
      )}

      <div className="rounded-3xl bg-white/95 p-4 shadow-[0_8px_22px_rgba(15,23,42,0.08)]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">Produksi oleh</p>
        <div className="mt-3 flex items-center gap-4">
          <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-3xl bg-emerald-50 ring-1 ring-emerald-100">
            {!isExternalUrl ? (
              <Image
                src="/default-image.jpg"
                alt={brandName}
                width={80}
                height={80}
                className="h-full w-full object-contain p-2"
                unoptimized
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={brandDetail.photo_url || "/default-image.jpg"}
                alt={brandName}
                width={80}
                height={80}
                className="h-full w-full object-contain p-2"
                onError={handleImageError}
                loading="lazy"
              />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="break-words text-xl font-bold leading-tight text-[#0D0E09]">{brandName}</h1>
            <p className="mt-1 text-sm text-[#6B7C73]">{brandCategory}</p>
            <div className="mt-3 inline-flex rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100">
              {productCount} produk katalog
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl bg-white/95 p-4 shadow-[0_8px_22px_rgba(15,23,42,0.08)]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">Detail brand</p>
        <div className="mt-3 space-y-2 text-sm leading-6 text-[#4B5F55]">
          {descriptionArr.length > 0 ? (
            descriptionArr.map((desc: string, idx: number) => (
              <p key={idx} className="break-words">{desc}</p>
            ))
          ) : (
            <p>Deskripsi brand belum tersedia di katalog toko.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default DetailBrand;
