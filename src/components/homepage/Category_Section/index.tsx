"use client";

import { useState } from "react";
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
        <div className="mx-6 mt-6 text-red-500 font-semibold flex justify-center items-center">
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
        {categories?.map((category: CategoryProps, index: number) => (
          <Tag
            key={index}
            title={category.name}
            isSelected={selectedCategory === category.id}
            onClick={() => {
              const newSelectedCategory =
                selectedCategory === category.id ? null : category.id;
              setSelectedCategory(newSelectedCategory);
            }}
          />
        ))}
      </div>
    </>
  );
};

export default React.memo(Category);
