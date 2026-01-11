"use client";

import React, { useState } from "react";
import { CardProductProps } from "@/components/common/Search/CardProduct/types";
import { useWishlist } from "@/contexts/WishlistContext";
import { WishlistItem } from "@/types/wishlist";

interface WishlistVariantModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: CardProductProps | null;
}

const WishlistVariantModal: React.FC<WishlistVariantModalProps> = ({
  isOpen,
  onClose,
  product
}) => {
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const { addToWishlist } = useWishlist();

  if (!isOpen || !product) return null;

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedVariant) {
      // Find the selected variant
      const selectedVariantData = product.all_variants.find(variant => 
        variant.variant === selectedVariant
      );
      
      if (selectedVariantData) {
        // Convert to WishlistItem format
        const wishlistItem: WishlistItem = {
          id: `${product.id}-${selectedVariant}`,
          productId: product.id,
          name: product.name,
          variant: selectedVariant,
          quantity: 1,
          price: selectedVariantData.discounted_price || product.price,
          image: selectedVariantData.img || product.image || (product.all_variants && product.all_variants.length > 0 ? product.all_variants[0].img : "/default-image.jpg"),
          addedAt: new Date().toISOString(),
          brand: product.brand_info?.name,
          originalPrice: product.price,
          discount: selectedVariantData.discount || 0
        };
        
        addToWishlist(wishlistItem);
        onClose();
        setSelectedVariant(null);
      }
    }
  };

  const handleClose = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    onClose();
    setSelectedVariant(null);
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleClose}
    >
      <div 
        className="bg-white rounded-lg p-6 w-80 max-w-[90vw]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Pilih Varian
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">{product.name}</p>
          <p className="text-xs text-gray-500">Pilih varian yang ingin ditambahkan ke wishlist:</p>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-6">
          {product.all_variants.map((variant) => {
            const hasDiscount = variant.discount && variant.discount > 0;
            const discountedPrice = variant.discounted_price || (hasDiscount ? product.price * (1 - variant.discount / 100) : product.price);
            
            return (
              <label
                key={variant.id}
                className={`flex flex-col p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                  selectedVariant === variant.variant
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-gray-200 hover:border-gray-300 text-gray-600"
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <input
                    type="radio"
                    name="variant"
                    value={variant.variant}
                    checked={selectedVariant === variant.variant}
                    onChange={(e) => {
                      e.stopPropagation();
                      setSelectedVariant(variant.variant);
                    }}
                    className="form-radio text-primary focus:ring-primary text-sm"
                  />
                  <span className="font-medium text-sm">
                    {variant.variant}
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
                        {product.price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-600 font-medium">
                      {product.price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                    </div>
                  )}
                </div>
              </label>
            );
          })}
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleAddToWishlist}
            disabled={!selectedVariant}
            className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Tambah ke Wishlist
          </button>
        </div>
      </div>
    </div>
  );
};

export default WishlistVariantModal;
