"use client";

import React, { useState } from 'react';
import { useWishlist } from '@/contexts/WishlistContext';
import WishlistVariantModal from '../WishlistVariantModal';
import LoginRequiredModal from '../LoginRequiredModal';
import { SessionManager } from '@/lib/auth';
import { WishlistItem } from '@/types/wishlist';

interface WishlistButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    brand?: string;
  };
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showVariantModal?: boolean;
}

const WishlistButton: React.FC<WishlistButtonProps> = ({ 
  product, 
  className = "",
  size = 'md',
  // showVariantModal: _showVariantModal = true
}) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
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
        return;
      }

      // Check if user is logged in
      const isLoggedIn = SessionManager.isAuthenticated();
      
      if (!isLoggedIn) {
        setShowLoginModal(true);
        return;
      }
      
      // Convert product to WishlistItem format
      const wishlistItem: WishlistItem = {
        id: product.id,
        productId: product.id,
        name: product.name,
        variant: "Default", // Default variant since we don't have variant info
        quantity: 1,
        price: product.price,
        image: product.image,
        addedAt: new Date().toISOString(),
        brand: product.brand
      };

      if (isWishlisted) {
        // If already in wishlist, remove it directly
        toggleWishlist(wishlistItem);
      } else {
        // If not in wishlist, add directly
        toggleWishlist(wishlistItem);
      }
    } catch (error) {
      console.error('Wishlist toggle error:', error);
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
        product={null}
      />

      <LoginRequiredModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        feature="wishlist"
        title="Login untuk Menyimpan ke Wishlist"
        description="Silakan login terlebih dahulu untuk menyimpan produk ke wishlist dan mengakses daftar produk favorit Anda."
      />
    </>
  );
};

export default WishlistButton;
