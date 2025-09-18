"use client";

import React, { useState } from 'react';
import { useWishlist } from '@/contexts/WishlistContext';
import WishlistVariantModal from '../WishlistVariantModal';

interface WishlistButtonProps {
  product: any;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showVariantModal?: boolean;
}

const WishlistButton: React.FC<WishlistButtonProps> = ({ 
  product, 
  className = "",
  size = 'md',
  showVariantModal = true
}) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isWishlisted = isInWishlist(product.id);

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      if (!product || !product.id || !product.name) {
        console.error("Invalid product data for wishlist:", product);
        return;
      }
      
      if (isWishlisted) {
        // If already in wishlist, remove it directly
        toggleWishlist(product);
        console.log(`Removed from wishlist: ${product.name}`);
      } else {
        // If not in wishlist, show variant modal if enabled and product has multiple variants
        if (showVariantModal && product.all_variants && product.all_variants.length > 1) {
          setIsModalOpen(true);
        } else {
          // If no modal needed or single variant, add directly
          toggleWishlist(product);
          console.log(`Added to wishlist: ${product.name}`);
        }
      }
    } catch (error) {
      console.error("Error handling wishlist click:", error);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <button
        onClick={handleClick}
        className={`${sizeClasses[size]} ${className} transition-colors duration-200`}
        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        <svg
          className="w-full h-full"
          fill={isWishlisted ? "#ef4444" : "none"}
          stroke={isWishlisted ? "#ef4444" : "currentColor"}
          strokeWidth="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </button>

      <WishlistVariantModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        product={product}
      />
    </>
  );
};

export default WishlistButton;
