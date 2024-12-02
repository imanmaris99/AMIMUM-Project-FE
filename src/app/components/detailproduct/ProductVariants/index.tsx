"use client";

import { useState } from "react";

const ProductVariants = () => {
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);

  const variants = [
    "Anggur",
    "Strawberry",
    "Cokelat",
    "Vanilla",
    "Melon",
    "Jeruk",
    "Susu",
    "Mocca",
  ];

  return (
    <div className="p-4">
      <p className="text-gray-500 text-sm font-medium mb-2">Varian produk :</p>
      <div className="grid grid-cols-4 gap-3">
        {variants.map((variant) => (
          <label key={variant} className="flex items-center space-x-2">
            <input
              type="radio"
              name="variant"
              value={variant}
              checked={selectedVariant === variant}
              onChange={() => setSelectedVariant(variant)}
              className="form-radio text-green-600 focus:ring-green-500 text-sm"
            />
            <span
              className={`${
                selectedVariant === variant ? "text-gray-900" : "text-gray-400"
              } font-medium text-sm`}
            >
              {variant}
            </span>
          </label>
        ))}
      </div>
      <hr className="mt-4" />
    </div>
  );
};

export default ProductVariants;
