"use client";
import Image from "next/image";
import { DetailProductType } from "@/types/detailProduct";
import { useEffect, useMemo, useState } from "react";

interface ProductImageProps {
  detailProduct?: DetailProductType | null;
  selectedVariantImg?: string;
}

const ProductImage = ({ detailProduct, selectedVariantImg }: ProductImageProps) => {
  const [imageError, setImageError] = useState(false);
  const primaryGalleryImage = detailProduct?.gallery_images?.find((img) => img.is_primary)?.url;
  const firstGalleryImage = detailProduct?.gallery_images?.[0]?.url;
  const firstVariantImage = detailProduct?.variants_list?.find((variant) => variant?.img)?.img;
  const imageUrl = selectedVariantImg
    || detailProduct?.primary_image_url
    || primaryGalleryImage
    || firstGalleryImage
    || firstVariantImage
    || "/default-image.jpg";
  const resolvedImageUrl = imageError ? "/default-image.jpg" : imageUrl;

  useEffect(() => {
    setImageError(false);
  }, [imageUrl]);

  const handleImageError = () => {
    setImageError(true);
  };

  const isExternalUrl = useMemo(() => {
    if (!resolvedImageUrl || resolvedImageUrl.startsWith('/')) {
      return false;
    }

    const url = resolvedImageUrl.trim();
    return url.startsWith('http://') || url.startsWith('https://');
  }, [resolvedImageUrl]);

  return (
    <section className="overflow-hidden rounded-[1.75rem] bg-white/95 shadow-[0_12px_30px_rgba(15,23,42,0.10)] ring-1 ring-emerald-50 backdrop-blur" aria-label="Foto produk">
      <div className="relative aspect-square w-full overflow-hidden bg-gradient-to-br from-[#F7FBF8] via-white to-[#EEF7F2]">
        <div className="absolute left-3 top-3 z-10 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-emerald-700 shadow-sm">
          Foto produk
        </div>
        <div className="absolute bottom-3 left-3 z-10 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-[#3F715F] shadow-sm">
          {selectedVariantImg ? "Mengikuti varian" : "Katalog toko"}
        </div>
        <div className="absolute inset-4 rounded-[1.35rem] bg-white/45 shadow-inner ring-1 ring-white/80" />

        {!resolvedImageUrl ? null : !isExternalUrl ? (
          <Image
            src={resolvedImageUrl}
            alt={detailProduct?.name || "Gambar produk katalog"}
            fill
            className="object-contain p-5 opacity-100 transition duration-200"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
            unoptimized
            onError={handleImageError}
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={resolvedImageUrl}
            alt={detailProduct?.name || "Gambar produk katalog"}
            className="relative h-full w-full object-contain p-5 opacity-100 transition duration-200"
            onError={handleImageError}
            loading="eager"
            fetchPriority="high"
          />
        )}
      </div>
    </section>
  );
};

export default ProductImage;
