"use client";

import { useState } from "react";
import { Tag, TagSkeleton } from "@/components/common/Tag";
import { useCategories } from "@/hooks/useCategories";
import { CategoryProps } from "@/components/hompage/Category_Section/types";

const Category = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const { categories, isLoading, isError } = useCategories();

  if (isLoading) return <TagSkeleton />;

  switch (isError) {
    case 404:
      return <div>Data tidak ditemukan. Silakan coba lagi nanti.</div>;
    case 409:
      return <div>Terjadi konflik data. Silakan coba lagi nanti.</div>;
    case 500:
      return <div>Terjadi kesalahan server. Silakan coba lagi nanti.</div>;
    default:
      break;
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
            isSelected={selectedCategory === category.name}
            onClick={() => setSelectedCategory(category.name)}
          />
        ))}
      </div>
    </>
  );
};

export default Category;
