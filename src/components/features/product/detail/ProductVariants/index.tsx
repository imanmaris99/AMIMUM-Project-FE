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
}: ProductVariantsProps) => {
  const { isInCart: checkIsInCart } = useCart();
  const productVariants = product?.variants_list ?? variants ?? [];

  const handleVariantSelect = (variant: VariantProductType) => {
    onVariantChange?.(variant);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4">
        <p className="text-gray-500 text-sm font-medium mb-3">Varian produk :</p>
        {productVariants.length === 0 ? (
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800">
            Varian produk belum tersedia di katalog. Silakan hubungi admin toko sebelum membeli.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {productVariants.map((variant) => {
              const hasDiscount = Boolean(variant.discount && variant.discount > 0);
              const discountedPrice = variant.discounted_price || product?.price || 0;
              const originalPrice = hasDiscount
                ? Math.round(discountedPrice / (1 - variant.discount / 100))
                : discountedPrice;
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
                    onChange={() => handleVariantSelect(variant)}
                    className="form-radio text-primary focus:ring-primary text-sm"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`font-medium text-sm ${isSelected ? "text-primary" : "text-gray-700"}`}>
                        {variant.variant || variant.name || "Varian produk"}
                      </span>
                      {isInCart && (
                        <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                          ✓ Di Keranjang
                        </span>
                      )}
                    </div>

                    <div className="text-xs">
                      {hasDiscount ? (
                        <div className="space-y-1">
                          <div className="flex items-center gap-1">
                            <span className="text-red-500 font-semibold">
                              {Math.round(discountedPrice).toLocaleString("id-ID", { style: "currency", currency: "IDR" })}
                            </span>
                            <span className="bg-red-100 text-red-600 px-1 py-0.5 rounded text-[10px] font-bold">
                              -{variant.discount}%
                            </span>
                          </div>
                          <div className="text-gray-400 line-through">
                            {originalPrice.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}
                          </div>
                        </div>
                      ) : (
                        <div className="text-gray-600 font-medium">
                          {discountedPrice.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}
                        </div>
                      )}
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
        )}
        <hr className="mt-4" />
      </div>
    </div>
  );
};

export default ProductVariants;
