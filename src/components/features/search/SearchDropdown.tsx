"use client";

import React, { useMemo, useState } from "react";
import { PulseLoader } from "react-spinners";
import Image from "next/image";
import { CardProductProps } from "./CardProduct/types";

interface SearchDropdownProps {
  products: CardProductProps[];
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
  handleSelectProduct: (productId: string) => void;
}

const SearchDropdownItem = ({ product, handleSelectProduct }: { product: CardProductProps; handleSelectProduct: (productId: string) => void }) => {
  const [imageError, setImageError] = useState(false);
  const imageUrl = product.image || product.all_variants[0]?.img || "/buyungupik_agr-1.svg";

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
    <li
      className="p-2 hover:bg-gray-100 cursor-pointer"
      onClick={() => handleSelectProduct(product.id)}
    >
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-lg flex justify-center items-center bg-gray-100 p-1">
          {!isExternalUrl ? (
            // Use Next.js Image ONLY for local images (no server-side fetch issues)
            <Image
              src={imageUrl}
              alt={product.name}
              width={50}
              height={50}
              onError={(e) => {
                e.currentTarget.src = "/buyungupik_agr-1.svg";
              }}
              unoptimized
            />
          ) : (
            // Use regular img tag for ALL external images (http/https) to prevent Next.js Image optimizer retry loops
            // This completely avoids server-side fetch attempts that cause infinite retry loops
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt={product.name}
              width={50}
              height={50}
              style={{ maxWidth: "50px", maxHeight: "50px", objectFit: "contain" }}
              onError={handleImageError}
              loading="lazy"
            />
          )}
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">{product.name}</p>
          <p className="text-xs text-gray-500">
            {product.all_variants && product.all_variants.length > 0 
              ? `${product.all_variants.length} varian tersedia`
              : "Produk tersedia"}
          </p>
        </div>
      </div>
    </li>
  );
};

const SearchDropdown: React.FC<SearchDropdownProps> = ({
  products,
  isLoading,
  isError,
  errorMessage,
  handleSelectProduct,
}) => {
  return (
    <ul className="absolute w-full bg-white border border-gray-200 rounded-lg mt-1 shadow-lg z-10">
      {isLoading ? (
        <li className="p-2 flex flex-col items-center justify-center">
          <PulseLoader color="hsl(var(--primary))" size={10} />
          <span className="text-gray-500 text-xs mt-2">Mencari produk...</span>
        </li>
      ) : isError ? (
        <li className="p-2 text-gray-500 flex justify-center">
          {errorMessage}
        </li>
      ) : (
        products?.slice(0, 5).map((product: CardProductProps) => (
          <SearchDropdownItem
            key={product.id}
            product={product}
            handleSelectProduct={handleSelectProduct}
          />
        ))
      )}
    </ul>
  );
};

export default SearchDropdown;
