"use client";

import { Tag, TagSkeleton } from "@/components";
import { CategoryProps } from "./types";
import React from "react";

interface CategorySectionProps {
  categories: CategoryProps[] | null;
  errorMessage?: string | null;
  selectedCategory: number | null;
  setSelectedCategory: (id: number | null) => void;
}

const Category = ({
  categories,
  errorMessage,
  selectedCategory,
  setSelectedCategory,
}: CategorySectionProps) => {
  // Hapus useState, gunakan props

  if (!categories && !errorMessage) return <TagSkeleton />;

  if (errorMessage) {
    return (
      <>
        <div className="mx-6 mt-6">
          <h6 className="font-semibold font-jakarta">Kategori</h6>
        </div>
        <div className="mx-6 mt-4 rounded-lg border border-yellow-100 bg-yellow-50 px-4 py-3 text-center font-jakarta text-sm text-yellow-800">
          {errorMessage}
        </div>
      </>
    );
  }

  return (
    <>
      <div className="mx-6 mt-6">
        <h6 className="font-semibold font-jakarta">Kategori</h6>
      </div>

      <div className="mx-6 mt-6 flex gap-2 overflow-x-auto hide-scrollbar whitespace-nowrap">
        {categories && categories.length > 0 ? (
          categories.map((category: CategoryProps, index: number) => (
            <Tag
              key={category.id ?? index}
              title={category.name}
              isSelected={selectedCategory === category.id}
              onClick={() => {
                const newSelectedCategory =
                  selectedCategory === category.id ? null : category.id;
                setSelectedCategory(newSelectedCategory);
              }}
            />
          ))
        ) : (
          <p className="rounded-full bg-white px-3 py-2 font-jakarta text-xs text-gray-500">
            Kategori belum tersedia. Semua produk katalog tetap ditampilkan jika ada.
          </p>
        )}
      </div>
    </>
  );
};

export default React.memo(Category);
