import React from "react";
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
          <li
            key={product.id}
            className="p-2 hover:bg-gray-100 cursor-pointer"
            onClick={() => handleSelectProduct(product.id)}
          >
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg flex justify-center items-center bg-gray-100 p-1">
                <Image
                  src={product.all_variants[0]?.img || "/buyungupik_agr-1.svg"}
                  alt={product.name}
                  width={50}
                  height={50}
                  onError={(e) => {
                    e.currentTarget.src = "/buyungupik_agr-1.svg";
                  }}
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{product.name}</p>
                <p className="text-xs text-gray-500">
                  {product.all_variants.length} varian tersedia
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-green-600">
                  Rp {product.price.toLocaleString()}
                </p>
              </div>
            </div>
          </li>
        ))
      )}
    </ul>
  );
};

export default SearchDropdown;
