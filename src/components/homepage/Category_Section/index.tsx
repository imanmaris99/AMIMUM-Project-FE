"use client";

import { Tag, TagSkeleton } from "@/components";
import { useCategories } from "@/hooks/useCategories";
import { CategoryProps } from "./types";

const Category = ({
  selectedCategory,
  setSelectedCategory,
}: {
  selectedCategory: number | null;
  setSelectedCategory: (category: number | null) => void;
}) => {
  const { categories, isLoading, isError, errorMessage } = useCategories();

  if (isLoading) return <TagSkeleton />;

  if (isError) {
    return (
      <>
        <div className="mx-6 mt-6">
          <h6 className="font-semibold font-jakarta">Kategori</h6>
        </div>
        <div className="mx-6 mt-6 text-red-500 font-semibold">
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
              selectedCategory === category.id ? null : category.id;
              setSelectedCategory(category.id);
            }}
          />
        ))}
      </div>
    </>
  );
};

export default Category;
