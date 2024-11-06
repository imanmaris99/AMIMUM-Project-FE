import { useState } from "react";
import Tag from "../Tag";

const Category = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const categories = Array.from(
    { length: 5 },
    (_, index) => `Kategori ${index + 1}`
  );

  return (
    <>
      <div className="mx-6 mt-6">
        <h6 className="font-semibold font-jakarta">Kategori</h6>
      </div>

      <div className="mx-6 mt-6 flex gap-2 overflow-x-auto hide-scrollbar whitespace-nowrap">
        {categories.map((category, index) => (
          <Tag
            key={index}
            title={category}
            isSelected={selectedCategory === category}
            onClick={() => setSelectedCategory(category)}
          />
        ))}
      </div>
    </>
  );
};

export default Category;
