"use client";

import React, { useState } from "react";
import { useCart } from "@/contexts/CartContext";

interface AddToCartButtonProps {
  product: any;
  variant?: any;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showVariantModal?: boolean;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({ 
  product, 
  variant,
  className = "",
  size = 'md',
  showVariantModal = true
}) => {
  const { addToCart, isInCart } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (variant) {
      // If specific variant is provided, add directly
      addToCart(product, variant);
    } else if (showVariantModal && product.all_variants && product.all_variants.length > 1) {
      // If multiple variants available, show modal
      setIsModalOpen(true);
    } else {
      // If single variant or no modal needed, add directly
      addToCart(product);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleVariantSelect = (selectedVariant: any) => {
    addToCart(product, selectedVariant);
    setIsModalOpen(false);
  };

  const isInCartAlready = isInCart(product.id);

  return (
    <>
      <button
        onClick={handleClick}
        className={`bg-[#00764F] text-white rounded-full font-medium hover:bg-[#005a3c] transition-colors duration-200 ${sizeClasses[size]} ${className}`}
      >
        {isInCartAlready ? "✓ Di Keranjang" : "Tambah ke Keranjang"}
      </button>

      {/* Variant Selection Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Pilih Varian</h3>
              <button
                onClick={handleModalClose}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-3">
              {product.all_variants?.map((variant: any) => {
                const hasDiscount = variant.discount && variant.discount > 0;
                const discountedPrice = variant.discounted_price || (hasDiscount ? product.price * (1 - variant.discount / 100) : product.price);
                
                return (
                  <button
                    key={variant.id}
                    onClick={() => handleVariantSelect(variant)}
                    className="w-full p-3 rounded-lg border-2 border-gray-200 hover:border-[#00764F] text-left transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{variant.variant || variant.name}</span>
                      <div className="text-right">
                        {hasDiscount ? (
                          <div className="space-y-1">
                            <div className="flex items-center gap-1">
                              <span className="text-red-500 font-semibold">
                                Rp {Math.round(discountedPrice).toLocaleString('id-ID')}
                              </span>
                              <span className="bg-red-100 text-red-600 px-1 py-0.5 rounded text-xs font-bold">
                                -{variant.discount}%
                              </span>
                            </div>
                            <div className="text-gray-400 line-through text-sm">
                              Rp {product.price.toLocaleString('id-ID')}
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-600 font-medium">
                            Rp {product.price.toLocaleString('id-ID')}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddToCartButton;
