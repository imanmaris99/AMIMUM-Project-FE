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

  const handleImageError = () => {
    setImageError(true);
  };

  const imageUrl = product.all_variants[0]?.img || "/buyungupik_agr-1.svg";
  
  // Check if URL is external (http/https) - simple string check
  // Use regular img tag for ALL external images to prevent Next.js Image optimizer retry loops
  const isExternalUrl = useMemo(() => {
    if (!imageUrl || imageError || imageUrl.startsWith('/')) {
      return false; // Use Next.js Image for local images
    }
    
    // Simple check: if URL starts with http:// or https://, it's external
    const url = imageUrl.trim();
    return url.startsWith('http://') || url.startsWith('https://');
  }, [imageUrl, imageError]);

  // Validate product data
  if (!product || !product.all_variants || product.all_variants.length === 0) {
    return null;
  }

  // Calculate highest discount from all variants
  // If brand_highest_discount is available (for promo pages), use it instead
  const highestDiscount = product.brand_highest_discount || product.all_variants.reduce((max, variant) => {
    const discount = variant.discount || 0;
    return discount > max ? discount : max;
  }, 0);

  // Calculate lowest discounted price from all variants
  const lowestDiscountedPrice = product.all_variants.reduce((min, variant) => {
    const discountedPrice = variant.discounted_price || product.price;
    return discountedPrice < min ? discountedPrice : min;
  }, product.price);

  // Find the variant with lowest discounted price to get its original price
  const lowestPriceVariant = product.all_variants.find(variant => 
    variant.discounted_price === lowestDiscountedPrice
  );
  
  // Use the original price of the variant with lowest discounted price
  // If using brand_highest_discount, calculate original price based on that discount
  let originalPriceForDisplay = product.price;
  if (product.brand_highest_discount) {
    // Calculate original price based on brand's highest discount
    originalPriceForDisplay = Math.round(lowestDiscountedPrice / (1 - product.brand_highest_discount / 100));
  } else if (lowestPriceVariant) {
    // Use the original price of the variant with lowest discounted price
    originalPriceForDisplay = Math.round(lowestDiscountedPrice / (1 - (lowestPriceVariant.discount || 0) / 100));
  }

  // Check if product has any discount
  const hasDiscount = highestDiscount > 0;

  return (
    <div onClick={() => product.id && handleSelectProduct(product.id)} className="w-40 h-56 rounded-lg shadow-md flex flex-col justify-center items-center gap-2 relative cursor-pointer">
      <div className="absolute top-2 right-2">
        <WishlistButton 
          product={product} 
          className="bg-white rounded-full p-1 hover:bg-gray-50"
          size="md"
        />
      </div>
      
      {/* Discount Badge */}
      {hasDiscount && (
        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md z-10">
          -{highestDiscount}%
        </div>
      )}

      <div className="flex flex-col justify-center items-center">
        <div className="bg-gray-100 w-32 h-28 rounded-lg flex justify-center items-center">
          {!isExternalUrl ? (
            // Use Next.js Image ONLY for local images (no server-side fetch issues)
            <Image
              src={imageUrl}
              alt={product.name}
              width={100}
              height={100}
              className="rounded-lg"
              onError={(e) => {
                e.currentTarget.src = "/buyungupik_agr-1.svg";
              }}
              unoptimized
            />
          ) : (
            // Use regular img tag for ALL external images (http/https) to prevent Next.js Image optimizer retry loops
            // This completely avoids server-side fetch attempts that cause infinite retry loops
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt={product.name}
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
            {product.name}
          </p>
          <p className="text-gray-500 text-[10px]">
            {product.all_variants.length} varian tersedia
          </p>
          <div className="flex items-center gap-2">
            <p className="text-[10px] text-gray-500">
              Mulai dari {hasDiscount ? rupiahFormater(lowestDiscountedPrice) : rupiahFormater(product.price)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {hasDiscount ? (
              <>
                <p className="font-bold text-sm text-red-500">
                  {rupiahFormater(lowestDiscountedPrice)}
                </p>
                <p className="text-xs text-gray-400 line-through">
                  {rupiahFormater(originalPriceForDisplay)}
                </p>
              </>
            ) : (
              <p className="font-bold text-sm">
                {rupiahFormater(product.price)}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardProduct;
