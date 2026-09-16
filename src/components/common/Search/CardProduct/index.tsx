"use client";

import Image from "next/image";
import { CardProductProps } from "./types";
import rupiahFormater from "@/utils/rupiahFormater";
import useSearchLogic from "../useSearchLogic";
import WishlistButton from "@/components/common/WishlistButton";
import { useMemo, useState } from "react";

const CardProduct = ({ product }: { product: CardProductProps }) => {
  const { handleSelectProduct } = useSearchLogic();
  const [imageError, setImageError] = useState(false);

  const variants = Array.isArray(product?.all_variants) ? product.all_variants : [];
  const productName = product?.name?.trim() || "Produk katalog";
  const basePrice = Number(product?.price);
  const hasValidBasePrice = Number.isFinite(basePrice) && basePrice > 0;
  const imageUrl = product?.image || variants[0]?.img || "/default-image.jpg";

  const handleImageError = () => {
    setImageError(true);
  };

  const isExternalUrl = useMemo(() => {
    if (!imageUrl || imageError || imageUrl.startsWith("/")) {
      return false;
    }

    const url = imageUrl.trim();
    return url.startsWith("http://") || url.startsWith("https://");
  }, [imageUrl, imageError]);

  if (!product || !product.id || !productName) {
    return null;
  }

  const highestVariantDiscount = variants.reduce((max, variant) => {
    const discount = Number(variant.discount || 0);
    return Number.isFinite(discount) && discount > max ? discount : max;
  }, 0);
  const highestDiscount = Number(product.brand_highest_discount || highestVariantDiscount || 0);

  const variantPrices = variants
    .map((variant) => Number(variant.discounted_price || basePrice))
    .filter((price) => Number.isFinite(price) && price > 0);

  const lowestDiscountedPrice = variantPrices.length > 0
    ? Math.min(...variantPrices)
    : basePrice;

  const hasDiscount = hasValidBasePrice && Number.isFinite(highestDiscount) && highestDiscount > 0;
  const displayPrice = hasDiscount ? lowestDiscountedPrice : basePrice;
  const hasDisplayPrice = Number.isFinite(displayPrice) && displayPrice > 0;
  const originalPriceForDisplay = hasDiscount && product.brand_highest_discount
    ? Math.round(displayPrice / (1 - highestDiscount / 100))
    : basePrice;

  return (
    <div onClick={() => product.id && handleSelectProduct(product.id)} className="w-40 h-56 rounded-lg shadow-md flex flex-col justify-center items-center gap-2 relative cursor-pointer">
      <div
        className="absolute top-2 right-2"
        onClick={(e) => e.stopPropagation()}
      >
        <WishlistButton
          product={{
            id: product.id,
            name: productName,
            price: hasValidBasePrice ? basePrice : 0,
            image: product.image || variants[0]?.img || "/default-image.jpg",
            brand: product.brand_info?.name,
          }}
          className="bg-white rounded-full p-1 hover:bg-gray-50"
          size="md"
        />
      </div>

      {hasDiscount && (
        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md z-10">
          -{highestDiscount}%
        </div>
      )}

      <div className="flex flex-col justify-center items-center">
        <div className="bg-gray-100 w-32 h-28 rounded-lg flex justify-center items-center">
          {!isExternalUrl ? (
            <Image
              src={imageUrl}
              alt={productName}
              width={100}
              height={100}
              className="rounded-lg"
              loading="lazy"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
              onError={(e) => {
                e.currentTarget.src = "/default-image.jpg";
              }}
              unoptimized
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt={productName}
              width={100}
              height={100}
              className="rounded-lg"
              style={{ maxWidth: "100px", maxHeight: "100px", objectFit: "contain" }}
              onError={handleImageError}
              loading="lazy"
            />
          )}
        </div>
      </div>
      <div className="flex flex-col justify-center w-32 min-h-20">
        <div className="space-y-1">
          <p className="font-bold text-xs whitespace-nowrap overflow-hidden text-ellipsis">
            {productName}
          </p>
          <p className="text-gray-500 text-[10px]">
            {variants.length > 0
              ? `${variants.length} varian tersedia`
              : "Varian produk belum tersedia di katalog"}
          </p>
          <div className="flex items-center gap-2">
            <p className="text-[10px] text-gray-500">
              {hasDisplayPrice ? `Mulai dari ${rupiahFormater(displayPrice)}` : "Harga belum tersedia"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {!hasDisplayPrice ? (
              <p className="font-bold text-sm text-gray-500">
                Harga belum tersedia
              </p>
            ) : hasDiscount ? (
              <>
                <p className="font-bold text-sm text-red-500">
                  {rupiahFormater(displayPrice)}
                </p>
                {originalPriceForDisplay > displayPrice && (
                  <p className="text-xs text-gray-400 line-through">
                    {rupiahFormater(originalPriceForDisplay)}
                  </p>
                )}
              </>
            ) : (
              <p className="font-bold text-sm">
                {rupiahFormater(displayPrice)}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardProduct;
