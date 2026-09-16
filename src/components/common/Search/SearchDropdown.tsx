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
  const variants = Array.isArray(product?.all_variants) ? product.all_variants : [];
  const productName = product?.name?.trim() || "Produk katalog";
  const imageUrl = product?.image || variants[0]?.img || "/default-image.jpg";

  const handleImageError = () => {
    setImageError(true);
  };

  const isExternalUrl = useMemo(() => {
    if (!imageUrl || imageError || imageUrl.startsWith("/")) {
      return false;
    }

    const url = imageUrl.trim();
    return url.startsWith("http://") || url.startsWith("https://");
  }, [imageUrl, imageError]);

  return (
    <li
      className="p-2 hover:bg-gray-100 cursor-pointer"
      onClick={() => handleSelectProduct(product.id)}
    >
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-lg flex justify-center items-center bg-gray-100 p-1">
          {!isExternalUrl ? (
            <Image
              src={imageUrl}
              alt={productName}
              width={50}
              height={50}
              onError={(e) => {
                e.currentTarget.src = "/default-image.jpg";
              }}
              unoptimized
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt={productName}
              width={50}
              height={50}
              style={{ maxWidth: "50px", maxHeight: "50px", objectFit: "contain" }}
              onError={handleImageError}
              loading="lazy"
            />
          )}
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">{productName}</p>
          <p className="text-xs text-gray-500">
            {variants.length > 0
              ? `${variants.length} varian tersedia`
              : "Varian produk belum tersedia di katalog"}
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
  if (isLoading) {
    return (
      <ul className="absolute w-full bg-white border border-gray-200 rounded-lg mt-1 shadow-lg z-10">
        <li className="p-2 flex flex-col items-center justify-center">
          <PulseLoader color="hsl(var(--primary))" size={10} />
          <span className="text-gray-500 text-xs mt-2">Mencari produk katalog...</span>
        </li>
      </ul>
    );
  }

  if (isError) {
    return (
      <ul className="absolute w-full bg-white border border-gray-200 rounded-lg mt-1 shadow-lg z-10">
        <li className="p-2 text-gray-500 flex justify-center text-center text-xs">
          {errorMessage || "Data pencarian produk belum tersedia. Silakan coba lagi beberapa saat lagi."}
        </li>
      </ul>
    );
  }

  if (!products || products.length === 0) {
    return (
      <ul className="absolute w-full bg-white border border-gray-200 rounded-lg mt-1 shadow-lg z-10">
        <li className="p-2 text-gray-500 flex justify-center text-center text-xs">
          Belum ada produk katalog yang cocok.
        </li>
      </ul>
    );
  }

  return (
    <ul className="absolute w-full bg-white border border-gray-200 rounded-lg mt-1 shadow-lg z-10">
      {products.slice(0, 5).map((product: CardProductProps) => (
        <SearchDropdownItem
          key={product.id}
          product={product}
          handleSelectProduct={handleSelectProduct}
        />
      ))}
    </ul>
  );
};

export default SearchDropdown;
