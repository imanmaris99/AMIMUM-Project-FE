"use client";

import { useState } from "react";

interface ProductVariantsProps {
  product?: any; // Product data with all_variants
  variants?: any[]; // Optional untuk backward compatibility
  onVariantChange?: (variant: any) => void; // Callback untuk mengkomunikasikan variant yang dipilih
}

const ProductVariants = ({ product, variants, onVariantChange }: ProductVariantsProps) => {
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);

  // Use product.variants_list if available, otherwise fallback to static data
  const flavorVariants = product?.variants_list || [
    { id: 1, name: "Anggur", variant: "Anggur", discount: 0, discounted_price: 0 },
    { id: 2, name: "Strawberry", variant: "Strawberry", discount: 0, discounted_price: 0 },
    { id: 3, name: "Cokelat", variant: "Cokelat", discount: 0, discounted_price: 0 },
    { id: 4, name: "Vanilla", variant: "Vanilla", discount: 0, discounted_price: 0 },
    { id: 5, name: "Melon", variant: "Melon", discount: 0, discounted_price: 0 },
    { id: 6, name: "Jeruk", variant: "Jeruk", discount: 0, discounted_price: 0 },
    { id: 7, name: "Susu", variant: "Susu", discount: 0, discounted_price: 0 },
    { id: 8, name: "Mocca", variant: "Mocca", discount: 0, discounted_price: 0 }
  ];

  return (
    <div className="p-4">
      <p className="text-gray-500 text-sm font-medium mb-3">Varian produk :</p>
      <div className="grid grid-cols-2 gap-3">
        {flavorVariants.map((variant) => {
          const hasDiscount = variant.discount && variant.discount > 0;
          const discountedPrice = variant.discounted_price || (hasDiscount ? product?.price * (1 - variant.discount / 100) : product?.price);
          
          return (
            <label 
              key={variant.id} 
              className={`flex flex-col p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                selectedVariant === (variant.variant || variant.name)
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-gray-200 hover:border-gray-300 text-gray-600"
              }`}
            >
              <div className="flex items-center space-x-2 mb-2">
                <input
                  type="radio"
                  name="variant"
                  value={variant.variant || variant.name}
                  checked={selectedVariant === (variant.variant || variant.name)}
                  onChange={() => {
                    const variantName = variant.variant || variant.name;
                    setSelectedVariant(variantName);
                    // Komunikasikan variant yang dipilih ke parent
                    if (onVariantChange) {
                      onVariantChange(variant);
                    }
                  }}
                  className="form-radio text-primary focus:ring-primary text-sm"
                />
                <span className="font-medium text-sm">
                  {variant.variant || variant.name}
                </span>
              </div>
              
              {/* Price and Discount Info */}
              <div className="text-xs">
                {hasDiscount ? (
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <span className="text-red-500 font-semibold">
                        {Math.round(discountedPrice).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                      </span>
                      <span className="bg-red-100 text-red-600 px-1 py-0.5 rounded text-[10px] font-bold">
                        -{variant.discount}%
                      </span>
                    </div>
                    <div className="text-gray-400 line-through">
                      {product?.price?.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-600 font-medium">
                    {product?.price?.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                  </div>
                )}
              </div>
            </label>
          );
        })}
      </div>
      <hr className="mt-4" />
    </div>
  );
};

export default ProductVariants;
