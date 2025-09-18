"use client";

import { useState } from "react";
import { VariantType } from "@/types/detailProduct";

interface ProductVariantsProps {
  variants: VariantType[];
}

const ProductVariants = ({ variants }: ProductVariantsProps) => {
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);

  return (
    <div className="p-4">
      <p className="text-gray-500 text-sm font-medium mb-3">Varian produk :</p>
      <div className="flex flex-wrap gap-3">
        {(variants || []).map((variant) => (
          <label 
            key={variant.id} 
            className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg border-2 cursor-pointer transition-all duration-200 min-w-[120px] h-12 ${
              selectedVariant === variant.name 
                ? "border-primary bg-primary/5 text-primary" 
                : "border-gray-200 hover:border-gray-300 text-gray-600"
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
            <span className="font-medium text-sm whitespace-nowrap text-center">
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
