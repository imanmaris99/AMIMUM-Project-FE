"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { WishlistItem as WishlistItemType } from "@/types/wishlist";
import rupiahFormater from "@/utils/rupiahFormater";
import { toast } from "react-hot-toast";

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
  const canOpenDetail = Boolean(item.productId);
  const hasValidPrice = typeof item.price === "number" && item.price > 0;
  const imageUrl = item.image || "/default-image.jpg";

  const handleItemClick = () => {
    if (!canOpenDetail) {
      toast.error("Detail produk belum tersedia dari data wishlist.");
      return;
    }

    router.push(`/detail-product/${item.productId}`);
  };

  return (
    <div
      className={`flex items-center gap-4 p-4 bg-white border-b border-gray-200 transition-colors ${
        canOpenDetail ? "hover:bg-gray-50 cursor-pointer" : "cursor-default"
      }`}
      onClick={handleItemClick}
      role={canOpenDetail ? "button" : undefined}
      tabIndex={canOpenDetail ? 0 : undefined}
      onKeyDown={(event) => {
        if (canOpenDetail && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          handleItemClick();
        }
      }}
    >
      <div className="flex-shrink-0">
        <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
          <Image
            src={imageUrl}
            alt={item.name}
            width={80}
            height={80}
            className="w-full h-full object-cover"
            onError={(event) => {
              const target = event.currentTarget as HTMLImageElement;
              if (!target.src.endsWith("/default-image.jpg")) {
                target.src = "/default-image.jpg";
              }
            }}
          />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-[#0D0E09] truncate -mb-1">
          {item.name || "Produk wishlist"}
        </h3>

        <div className="mb-2">
          <span className="text-xs text-[#7A7A7A]">
            {item.variant || "Varian tidak tersedia"}
          </span>
        </div>

        <div className="space-y-1">
          {hasValidPrice ? (
            item.discount && item.originalPrice ? (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-red-500">
                    {rupiahFormater(item.price)}
                  </p>
                  <span className="bg-red-100 text-red-600 px-1.5 py-0.5 rounded text-[10px] font-bold">
                    -{item.discount}%
                  </span>
                </div>
                <p className="text-xs text-gray-400 line-through">
                  {rupiahFormater(item.originalPrice)}
                </p>
              </div>
            ) : (
              <p className="text-sm font-bold text-[#001F14]">
                {rupiahFormater(item.price)}
              </p>
            )
          ) : (
            <p className="text-xs font-medium text-gray-500">
              Harga belum tersedia
            </p>
          )}

          {!canOpenDetail && (
            <p className="text-[11px] text-yellow-700">
              Detail produk belum tersedia dari data wishlist.
            </p>
          )}
        </div>
      </div>

      <div className="flex-shrink-0">
        <button
          type="button"
          aria-label={`Hapus ${item.name} dari wishlist`}
          onClick={(event) => {
            event.stopPropagation();
            onRemove(item.id);
          }}
          disabled={isRemoving}
          className="p-3 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isRemoving ? (
            <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
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
