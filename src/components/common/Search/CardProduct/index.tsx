"use client";

import Image from "next/image";
import { CardProductProps } from "./types";
import rupiahFormater from "@/utils/rupiahFormater";
import useSearchLogic from "../useSearchLogic";
import WishlistButton from "@/components/common/WishlistButton";
import { useEffect, useMemo, useState } from "react";

type CardProductImageLoading = "lazy" | "eager";

const CardProduct = ({
  product,
  imageLoading = "lazy",
}: {
  product: CardProductProps;
  imageLoading?: CardProductImageLoading;
}) => {
  const { handleSelectProduct } = useSearchLogic();
  const [imageError, setImageError] = useState(false);

  const variants = Array.isArray(product?.all_variants) ? product.all_variants : [];
  const productName = product?.name?.trim() || "Produk katalog";
  const basePrice = Number(product?.price);
  const hasValidBasePrice = Number.isFinite(basePrice) && basePrice > 0;
  const galleryImages = Array.isArray(product?.gallery_images) ? product.gallery_images : [];
  const primaryGalleryImage = galleryImages.find((image) => image?.is_primary && image?.url)?.url;
  const firstGalleryImage = [...galleryImages]
    .sort((a, b) => Number(a?.sort_order || 0) - Number(b?.sort_order || 0))
    .find((image) => image?.url)?.url;
  const firstVariantImage = variants.find((variant) => variant?.img)?.img;
  const imageUrl = product?.primary_image_url || primaryGalleryImage || firstGalleryImage || product?.image || firstVariantImage || "/default-image.jpg";
  const resolvedImageUrl = imageError ? "/default-image.jpg" : imageUrl;
  const isFallbackImage = resolvedImageUrl === "/default-image.jpg";
  const showImageFallback = imageError || isFallbackImage;

  useEffect(() => {
    setImageError(false);
  }, [imageUrl]);

  const handleImageError = () => {
    setImageError(true);
  };

  const isExternalUrl = useMemo(() => {
    if (!resolvedImageUrl || resolvedImageUrl.startsWith("/")) {
      return false;
    }

    const url = resolvedImageUrl.trim();
    return url.startsWith("http://") || url.startsWith("https://");
  }, [resolvedImageUrl]);

  if (!product || !product.id || !productName) {
    return null;
  }

  const highestVariantDiscount = variants.reduce((max, variant) => {
    const discount = Number(variant.discount || 0);
    return Number.isFinite(discount) && discount > max ? discount : max;
  }, 0);
  const productHighestDiscount = Number(product.brand_highest_discount);
  const highestDiscount = Math.max(
    Number.isFinite(productHighestDiscount) ? productHighestDiscount : 0,
    highestVariantDiscount,
  );

  const variantPrices = variants
    .map((variant) => Number(variant.discounted_price || basePrice))
    .filter((price) => Number.isFinite(price) && price > 0);

  const displayPrice = variantPrices.length > 0
    ? Math.min(...variantPrices)
    : basePrice;

  const hasDisplayPrice = Number.isFinite(displayPrice) && displayPrice > 0;
  const hasDiscount = hasDisplayPrice && highestDiscount > 0;

  const variantCountText = variants.length > 1
    ? `${variants.length} pilihan varian`
    : variants.length === 1
      ? "1 pilihan varian"
      : "Detail produk tersedia";

  return (
    <article
      onClick={() => product.id && handleSelectProduct(product.id)}
      className="group relative flex w-full cursor-pointer flex-col overflow-hidden rounded-[1.35rem] border border-emerald-50 bg-white/95 p-2 shadow-[0_10px_24px_rgba(15,23,42,0.08)] transition duration-200 active:scale-[0.99] sm:p-2.5"
    >
      <div
        className="absolute right-2 top-2 z-20"
        onClick={(e) => e.stopPropagation()}
      >
        <WishlistButton
          product={{
            id: product.id,
            name: productName,
            price: hasValidBasePrice ? basePrice : 0,
            image: resolvedImageUrl,
            brand: product.brand_info?.name,
          }}
          className="rounded-full bg-white/95 p-0.5 shadow-[0_4px_12px_rgba(15,23,42,0.12)] hover:bg-gray-50"
          size="sm"
        />
      </div>

      {hasDiscount && (
        <div className="absolute left-2 top-2 z-20 rounded-full bg-red-500 px-2 py-1 text-[10px] font-bold text-white shadow-sm sm:text-[11px]">
          Diskon hingga {highestDiscount}%
        </div>
      )}

      <div
        className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-[1.1rem] bg-gradient-to-br from-[#F8FBF7] via-white to-[#F3F8F5] bg-contain bg-center bg-no-repeat p-2 ring-1 ring-emerald-50/80"
        style={{ backgroundImage: showImageFallback ? "url('/default-image.jpg')" : undefined }}
      >
          {!isExternalUrl ? (
            <Image
              src={resolvedImageUrl}
              alt={productName}
              width={160}
              height={160}
              className="h-full w-full rounded-xl object-cover opacity-100 shadow-[inset_0_0_0_1px_rgba(15,23,42,0.03)] transition duration-200 group-active:scale-[0.98]"
              loading={imageLoading}
              priority={imageLoading === "eager"}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
              onError={() => {
                setImageError(true);
              }}
              unoptimized
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={resolvedImageUrl}
              alt={productName}
              className="h-full w-full rounded-xl object-cover opacity-100 shadow-[inset_0_0_0_1px_rgba(15,23,42,0.03)] transition duration-200 group-active:scale-[0.98]"
              onError={(event) => {
                if (!event.currentTarget.src.endsWith("/default-image.jpg")) {
                  event.currentTarget.src = "/default-image.jpg";
                }
                handleImageError();
              }}
              loading={imageLoading}
              fetchPriority={imageLoading === "eager" ? "high" : "auto"}
            />
          )}
      </div>
      <div className="flex flex-col gap-1.5 px-0.5 pb-0.5 pt-2.5">
        <div className="space-y-0.5">
          <p className="line-clamp-2 min-h-[32px] text-[13px] font-bold leading-4 text-[#0D0E09]">
            {productName}
          </p>
          <p className="line-clamp-1 text-[11px] leading-4 text-[#7A887F]">
            {variantCountText}
          </p>
        </div>
        <div className="flex flex-wrap items-end gap-x-2 gap-y-0.5">
            {!hasDisplayPrice ? (
              <p className="text-sm font-bold text-gray-500">
                Harga belum tersedia
              </p>
            ) : (
              <div className="flex flex-col">
                <span className="text-[10px] font-medium leading-3 text-[#7A887F]">Mulai dari</span>
                <p className="text-[17px] font-extrabold leading-5 text-[#0D0E09]">
                  {rupiahFormater(displayPrice)}
                </p>
              </div>
            )}
        </div>
      </div>
    </article>
  );
};

export default CardProduct;
