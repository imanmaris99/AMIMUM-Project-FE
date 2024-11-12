"use client";

import { useState } from "react";
import { Tag, TagSkeleton } from "@/app/components/common/Tag";
import { useCategories } from "@/hooks/useCategories";
import { CategoryProps } from "@/types/apiTypes";

const Category = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const { categories, isLoading, isError } = useCategories();

  if (isLoading) return <TagSkeleton />;

  if (isError) return <div>Error fetching categories</div>;

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
