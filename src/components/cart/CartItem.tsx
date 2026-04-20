"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CartItemType } from "@/types/apiTypes";

interface CartItemProps {
  item: CartItemType;
  onQuantityChange?: (cartId: string, quantity: number) => void;
  onCheckChange?: (cartId: string, checked: boolean) => void;
  onDelete?: (cartId: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({
  item,
  onQuantityChange,
  onCheckChange,
  onDelete,
}) => {
  const router = useRouter();
  const [quantity, setQuantity] = useState(item.quantity);
  const [isChecked, setIsChecked] = useState(item.is_active !== false);

  // Sync local state with context when item changes
  useEffect(() => {
    setQuantity(item.quantity);
    setIsChecked(item.is_active !== false);
  }, [item.id, item.quantity, item.is_active]);

  const handleMinus = () => {
    const newQuantity = Math.max(1, quantity - 1);
    setQuantity(newQuantity);
    onQuantityChange?.(item.id, newQuantity);
  };

  const handlePlus = () => {
    const newQuantity = Math.max(1, quantity + 1);
    setQuantity(newQuantity);
    onQuantityChange?.(item.id, newQuantity);
  };

  const handleQuantityInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = Math.max(1, parseInt(e.target.value) || 1);
    setQuantity(newQuantity);
    onQuantityChange?.(item.id, newQuantity);
  };

  const handleCheckChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setIsChecked(checked);
    onCheckChange?.(item.id, checked);
  };

  const handleDelete = () => {
    onDelete?.(item.id);
  };

  const handleItemClick = () => {
    if (!item.product_id) {
      return;
    }
    router.push(`/detail-product/${item.product_id}`);
  };

  // Use the price from the new structure
  const displayPrice = item.price;

  const imageUrl = item.image || "/default-image.jpg";
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  // Check if URL is external (http/https) - simple string check
  // Use regular img tag for ALL external images to prevent Next.js Image optimizer retry loops
  const isExternalUrl = useMemo(() => {
    if (!imageUrl || imageError || imageUrl.startsWith('/')) {
      return false; // Use Next.js Image for local images
    }
    
    // Simple check: if URL starts with http:// or https://, it's external
    const url = imageUrl.trim();
    return url.startsWith('http://') || url.startsWith('https://');
  }, [imageUrl, imageError]);

  return (
    <article className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl max-w-full mx-auto will-change-auto">
      {/* Checkbox */}
      <label className={`w-7 h-7 border-2 rounded-lg grid place-items-center cursor-pointer flex-shrink-0 transition-all duration-150 will-change-transform ${
        isChecked 
          ? 'border-primary bg-primary' 
          : 'border-gray-300 hover:border-gray-400'
      }`} aria-label="Pilih produk">
        <input 
          type="checkbox" 
          checked={isChecked}
          onChange={handleCheckChange}
          className="appearance-none m-0 w-0 h-0 absolute"
        />
        {/* Check icon */}
        <svg 
          viewBox="0 0 24 24" 
          width="18" 
          height="18" 
          fill="none" 
          stroke="white" 
          strokeWidth="3" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          aria-hidden="true"
          className={`transition-all duration-150 ${isChecked ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}
        >
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </label>

      {/* Clickable Area - Image and Text */}
      <div
        onClick={handleItemClick}
        className={`flex items-center gap-3 flex-1 min-w-0 rounded-lg p-2 -m-2 transition-colors ${
          item.product_id ? 'cursor-pointer hover:bg-gray-50' : 'cursor-default'
        }`}
      >
        {/* Image */}
        <div className="w-[70px] h-[70px] rounded-lg overflow-hidden border border-gray-200 flex-shrink-0 bg-gray-50 grid place-items-center">
          {!isExternalUrl ? (
            // Use Next.js Image ONLY for local images (no server-side fetch issues)
            <Image 
              src={imageUrl} 
              alt={item.product_name} 
              width={70}
              height={70}
              className="w-full h-full object-cover"
              sizes="70px"
              unoptimized
            />
          ) : (
            // Use regular img tag for ALL external images (http/https) to prevent Next.js Image optimizer retry loops
            // This completely avoids server-side fetch attempts that cause infinite retry loops
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt={item.product_name}
              width={70}
              height={70}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              onError={handleImageError}
              loading="lazy"
            />
          )}
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <h2 className="font-bold text-sm mb-1 line-clamp-2 leading-tight">
            {item.product_name}
          </h2>
          <p className="text-gray-500 text-xs m-0 truncate">
            {item.variant_name}
          </p>
          <div className="mt-2 text-sm font-bold text-green-800" data-unit={displayPrice}>
            Rp {displayPrice.toLocaleString('id-ID')}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-end gap-2 flex-shrink-0">
        <button 
          className="w-6 h-6 border-none bg-transparent cursor-pointer opacity-80 hover:opacity-100 p-1" 
          title="Hapus" 
          onClick={handleDelete}
        >
          <Image src="/Trush_Icon_UIA.svg" alt="Hapus" width={16} height={16} />
        </button>

        <div className="flex items-center border border-gray-200 rounded-md h-7 overflow-hidden" role="group" aria-label="Pengatur jumlah">
          <button 
            type="button" 
            className="w-7 h-7 border-0 bg-gray-100 cursor-pointer text-sm hover:bg-gray-200" 
            aria-label="Kurangi" 
            onClick={handleMinus}
          >
            −
          </button>
          <input 
            type="number" 
            className="w-8 h-7 border-0 text-center text-xs outline-none" 
            value={quantity} 
            min="1" 
            inputMode="numeric" 
            aria-label="Jumlah"
            onChange={handleQuantityInput}
          />
          <button 
            type="button" 
            className="w-7 h-7 border-0 bg-gray-100 cursor-pointer text-sm hover:bg-gray-200" 
            aria-label="Tambah" 
            onClick={handlePlus}
          >
            +
          </button>
        </div>
      </div>
    </article>
  );
};

export default CartItem;
