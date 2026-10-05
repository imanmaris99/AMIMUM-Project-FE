"use client";

import React, { useState } from "react";
import Link from "next/link";
import WishlistItem from "../atoms/WishlistItem";
import { WishlistItem as WishlistItemType } from "@/types/wishlist";
import { useWishlist } from "@/contexts/WishlistContext";
import { Button } from "@/components/ui/button";

interface WishlistListProps {
  items: WishlistItemType[];
  onRemoveItem: (id: string) => void;
}

const WishlistList: React.FC<WishlistListProps> = ({ items, onRemoveItem }) => {
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set());
  const { removeFromWishlist } = useWishlist();

  const handleRemoveItem = async (id: string) => {
    setRemovingItems(prev => new Set(prev).add(id));

    try {
      await removeFromWishlist(id);
      onRemoveItem(id);
    } finally {
      setRemovingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl bg-white/95 px-5 py-14 text-center shadow-[0_8px_22px_rgba(15,23,42,0.08)]">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 shadow-sm ring-1 ring-emerald-100">
          <svg
            className="h-8 w-8 text-primary/60"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </div>
        <h3 className="mb-2 text-lg font-semibold text-gray-900">
          Wishlist Masih Kosong
        </h3>
        <p className="mb-5 max-w-xs text-sm leading-relaxed text-[#6B7C73]">
          Simpan produk yang ingin dibeli nanti. Produk yang tampil di sini berasal dari wishlist akun Anda.
        </p>
        <Button asChild className="rounded-2xl bg-primary text-white hover:bg-primary/90">
          <Link href="/search">Cari Produk</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.id} className="overflow-hidden rounded-3xl bg-white/95 shadow-[0_8px_22px_rgba(15,23,42,0.08)]">
          <WishlistItem
            item={item}
            onRemove={handleRemoveItem}
            isRemoving={removingItems.has(item.id)}
          />
        </div>
      ))}
    </div>
  );
};

export default WishlistList;
