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
        <li className="p-2 flex justify-center">
          <PulseLoader color="hsl(var(--primary))" size={10} />
        </li>
      ) : isError ? (
        <li className="p-2 text-gray-500 flex justify-center">
          {errorMessage}
        </li>
      ) : (
        products?.map((product: CardProductProps) => (
          <li
            key={product.id}
            className="p-2 hover:bg-gray-100 cursor-pointer"
            onClick={() => handleSelectProduct(product.id)}
          >
            <div>
              {product.all_variants.map((variant) => (
                <div key={variant.id} className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg flex justify-center items-center bg-gray-100 p-1">
                    <Image
                      src={variant.img || "/default-image.jpg"}
                      alt={product.name}
                      width={50}
                      height={50}
                    />
                  </div>
                  <p className="text-sm">{product.name}</p>
                </div>
              ))}
            </div>
          </li>
        ))
      )}
    </ul>
  );
};

export default SearchDropdown;
