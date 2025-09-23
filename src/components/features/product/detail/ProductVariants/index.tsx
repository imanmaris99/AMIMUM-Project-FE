"use client";

import { useCart } from "@/contexts/CartContext";
import { DetailProductType, VariantProductType } from "@/types/detailProduct";

interface ProductVariantsProps {
  product?: DetailProductType;
  variants?: VariantProductType[];
  onVariantChange?: (variant: VariantProductType) => void;
  selectedVariant?: VariantProductType;
  showQuickAdd?: boolean;
}

const ProductVariants = ({ 
  product, 
  variants, 
  onVariantChange, 
  selectedVariant: propSelectedVariant,
  // showQuickAdd = false // Removed unused parameter 
}: ProductVariantsProps) => {
  const { isInCart: checkIsInCart } = useCart();

  // Use product.variants_list if available, otherwise fallback to static data
  const flavorVariants = product?.variants_list || variants || [
    { id: 1, name: "Anggur", variant: "Anggur", discount: 15, discounted_price: 12750 },
    { id: 2, name: "Strawberry", variant: "Strawberry", discount: 0, discounted_price: 15000 },
    { id: 3, name: "Cokelat", variant: "Cokelat", discount: 20, discounted_price: 12000 },
    { id: 4, name: "Vanilla", variant: "Vanilla", discount: 0, discounted_price: 15000 },
    { id: 5, name: "Melon", variant: "Melon", discount: 10, discounted_price: 13500 },
    { id: 6, name: "Jeruk", variant: "Jeruk", discount: 0, discounted_price: 15000 },
    { id: 7, name: "Susu", variant: "Susu", discount: 25, discounted_price: 11250 },
    { id: 8, name: "Mocca", variant: "Mocca", discount: 0, discounted_price: 15000 }
  ];

  const handleVariantSelect = (variant: VariantProductType) => {
    if (onVariantChange) {
      onVariantChange(variant);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4">
        <p className="text-gray-500 text-sm font-medium mb-3">Varian produk :</p>
        <div className="grid grid-cols-1 gap-3">
          {flavorVariants.map((variant) => {
            const hasDiscount = variant.discount && variant.discount > 0;
            const originalPrice = hasDiscount ? Math.round(variant.discounted_price / (1 - variant.discount / 100)) : (variant.discounted_price || product?.price || 0);
            const discountedPrice = variant.discounted_price || product?.price || 0;
            const isSelected = propSelectedVariant?.id === variant.id;
            const isInCart = product ? checkIsInCart(product.id, variant.id) : false;
            
            return (
              <label 
                key={variant.id} 
                className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="variant"
                  value={variant.variant || variant.name}
                  checked={isSelected}
                  onChange={() => handleVariantSelect({
                    id: variant.id,
                    product: product?.name || "",
                    name: variant.name,
                    img: (variant as any).img || "",
                    variant: variant.variant,
                    expiration: "",
                    stock: 0,
                    discount: variant.discount,
                    discounted_price: variant.discounted_price,
                    updated_at: ""
                  })}
                  className="form-radio text-primary focus:ring-primary text-sm"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`font-medium text-sm ${isSelected ? 'text-primary' : 'text-gray-700'}`}>
                      {variant.variant || variant.name}
                    </span>
                    {isInCart && (
                      <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                        ✓ Di Keranjang
                      </span>
                    )}
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
                          {originalPrice?.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                        </div>
                      </div>
                    ) : (
                      <div className="text-gray-600 font-medium">
                        {discountedPrice?.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                      </div>
                    )}
                  </div>
                </div>
              </label>
            );
          })}
        </div>
        <hr className="mt-4" />
      </div>
    </div>
  );
};

export default ProductVariants;
