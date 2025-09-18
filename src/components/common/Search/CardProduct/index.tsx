"use client";

import Image from "next/image";
import { GoHeart } from "react-icons/go";
import { CardProductProps } from "./types";
import rupiahFormater from "@/utils/rupiahFormater";
import useSearchLogic from "../useSearchLogic";
import WishlistButton from "@/components/common/WishlistButton";

const CardProduct = ({ product }: { product: CardProductProps }) => {
  const { handleSelectProduct } = useSearchLogic();

  // Calculate highest discount from all variants
  const highestDiscount = product.all_variants.reduce((max, variant) => {
    const discount = variant.discount || 0;
    return discount > max ? discount : max;
  }, 0);

  // Calculate lowest discounted price from all variants
  const lowestDiscountedPrice = product.all_variants.reduce((min, variant) => {
    const discountedPrice = variant.discounted_price || variant.discount ? 
      (variant.discount ? product.price * (1 - variant.discount / 100) : product.price) : product.price;
    return discountedPrice < min ? discountedPrice : min;
  }, product.price);

  // Check if product has any discount
  const hasDiscount = highestDiscount > 0;

  return (
    <div onClick={() => handleSelectProduct(product.id)} className="w-40 h-56 rounded-lg shadow-md flex flex-col justify-center items-center gap-2 relative cursor-pointer">
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
          <Image
            src={product.all_variants[0]?.img || "/buyungupik_agr-1.svg"}
            alt={product.name}
            width={100}
            height={100}
            className="rounded-lg"
            onError={(e) => {
              e.currentTarget.src = "/buyungupik_agr-1.svg";
            }}
          />
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
                  {rupiahFormater(product.price)}
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
