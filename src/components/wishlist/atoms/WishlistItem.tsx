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
      className={`flex items-center gap-3 p-3 transition-colors ${
        canOpenDetail ? "cursor-pointer hover:bg-emerald-50/60" : "cursor-default"
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
        <div className="h-20 w-20 overflow-hidden rounded-2xl bg-emerald-50 ring-1 ring-emerald-100">
          <Image
            src={imageUrl}
            alt={item.name}
            width={80}
            height={80}
            className="h-full w-full object-cover"
            onError={(event) => {
              const target = event.currentTarget as HTMLImageElement;
              if (!target.src.endsWith("/default-image.jpg")) {
                target.src = "/default-image.jpg";
              }
            }}
          />
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-semibold text-[#0D0E09]">
          {item.name || "Produk wishlist"}
        </h3>

        <div className="mt-1 mb-2">
          <span className="text-xs text-[#6B7C73]">
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
                  <span className="rounded-full bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-red-600">
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
            <p className="text-xs font-medium text-[#6B7C73]">
              Harga belum tersedia
            </p>
          )}

          {!canOpenDetail && (
            <p className="mt-1 rounded-xl bg-amber-50 px-2 py-1 text-[11px] text-amber-700">
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
          className="rounded-full p-3 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isRemoving ? (
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
          ) : (
            <svg
              className="h-6 w-6"
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
