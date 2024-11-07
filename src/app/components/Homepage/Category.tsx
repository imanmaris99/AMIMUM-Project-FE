import { useState } from "react";
import Tag from "../Tag";
import { useFetchCategories } from "@/hooks/useFetchCategories";

const Category = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const { categories, isLoading, error } = useFetchCategories();

  return (
    <>
      <div className="mx-6 mt-6">
        <h6 className="font-semibold font-jakarta">Kategori</h6>
      </div>

      <div className="mx-6 mt-6 flex gap-2 overflow-x-auto hide-scrollbar whitespace-nowrap">
        {categories.map((category, index) => (
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
