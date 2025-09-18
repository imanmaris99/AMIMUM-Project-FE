"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { WishlistItem as WishlistItemType } from "@/types/wishlist";
import rupiahFormater from "@/utils/rupiahFormater";

interface WishlistItemProps {
  item: WishlistItemType;
  onRemove: (id: string) => void;
  isRemoving?: boolean;
}

const WishlistItem: React.FC<WishlistItemProps> = ({ 
  item, 
  onRemove, 
  isRemoving = false 
}) => {
  const router = useRouter();

  const handleItemClick = () => {
    // Navigate to product detail page using productId
    router.push(`/detail-product/${item.productId}`);
  };

  return (
    <div 
      className="flex items-center gap-4 p-4 bg-white border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
      onClick={handleItemClick}
    >
      {/* Product Image */}
      <div className="flex-shrink-0">
        <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
          <Image
            src={item.image}
            alt={item.name}
            width={80}
            height={80}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        {/* Product Name */}
        <h3 className="text-sm font-semibold text-[#0D0E09] truncate -mb-1">
          {item.name}
        </h3>
        
        {/* Detail Section: Variant */}
        <div className="mb-3">
          <span className="text-xs text-[#C4C4C4]">
            {item.variant}
          </span>
        </div>
        
        {/* Price */}
        <p className="text-sm font-bold text-[#001F14]">
          {rupiahFormater(item.price)}
        </p>
      </div>

      {/* Remove Button */}
      <div className="flex-shrink-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(item.id);
          }}
          disabled={isRemoving}
          className="p-3 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isRemoving ? (
            <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default WishlistItem;
