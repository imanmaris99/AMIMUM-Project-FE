"use client";

import { useState } from "react";

interface ProductVariantsProps {
  variants?: any[]; // Optional untuk backward compatibility
}

const ProductVariants = ({ variants }: ProductVariantsProps) => {
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);

  // Data variant rasa yang sudah ditentukan
  const flavorVariants = [
    { id: 1, name: "Anggur" },
    { id: 2, name: "Strawberry" },
    { id: 3, name: "Cokelat" },
    { id: 4, name: "Vanilla" },
    { id: 5, name: "Melon" },
    { id: 6, name: "Jeruk" },
    { id: 7, name: "Susu" },
    { id: 8, name: "Mocca" }
  ];

  return (
    <div className="p-4">
      <p className="text-gray-500 text-sm font-medium mb-3">Varian produk :</p>
      <div className="grid grid-cols-4 gap-3">
        {flavorVariants.map((variant) => (
          <label 
            key={variant.id} 
            className={`flex items-center space-x-2 cursor-pointer transition-all duration-200 ${
              selectedVariant === variant.name 
                ? "text-primary" 
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <input
              type="radio"
              name="variant"
              value={variant.name}
              checked={selectedVariant === variant.name}
              onChange={() => setSelectedVariant(variant.name)}
              className="form-radio text-primary focus:ring-primary text-sm"
            />
            <span className="font-medium text-sm whitespace-nowrap">
              {variant.name}
            </span>
          </label>
        ))}
      </div>
      <hr className="mt-4" />
    </div>
  );
};

export default ProductVariants;
