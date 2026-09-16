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
      <div className="flex flex-col items-center justify-center py-14 text-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-5">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
          <svg
            className="w-8 h-8 text-gray-400"
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
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Wishlist Masih Kosong
        </h3>
        <p className="text-gray-500 text-sm max-w-xs mb-5">
          Simpan produk yang ingin dibeli nanti. Produk yang tampil di sini berasal dari wishlist akun Anda.
        </p>
        <Button asChild className="bg-primary hover:bg-primary/90 text-white">
          <Link href="/search">Cari Produk</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.id} className="bg-white rounded-lg shadow-md border-0 overflow-hidden">
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
