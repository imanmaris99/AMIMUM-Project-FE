"use client";

import { useState, useEffect, useRef } from "react";
import { CiSearch } from "react-icons/ci";
import { Button } from "@/components/ui/button";
import { useSearchProduct } from "@/app/hooks/useSearchProduct";
import { PulseLoader } from "react-spinners";
import { useRouter } from "next/navigation";
import { CardProductProps } from "./CardProduct/types";
import Image from "next/image";

const Search = () => {
  const [search, setSearch] = useState("");
  const { products, isError, isLoading } = useSearchProduct(search);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  const handleSearch = () => {
    if (search.trim()) {
      router.push(`/search?q=${search}`);
    }
  };

  const handleSelectProduct = (productName: string) => {
    router.push(`/product/${productName}`);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setShowDropdown(e.target.value.length > 0);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={searchRef}>
      <div className="flex items-center justify-center border border-gray-200 rounded-lg px-2 py-2">
        <CiSearch className="w-8 h-8 text-gray-500 ml-2" />
        <input
          className="w-full px-2 focus:outline-none text-lg placeholder:text-sm"
          type="text"
          placeholder="Cari produk"
          value={search}
          onChange={handleInputChange}
        />
        <Button onClick={handleSearch} variant="default">
          Cari
        </Button>
      </div>

      {showDropdown && (
        <ul className="absolute w-full bg-white border border-gray-200 rounded-lg mt-1 shadow-lg z-10">
          {isLoading ? (
            <li className="p-2 flex justify-center">
              <PulseLoader color="hsl(var(--primary))" size={10} />
            </li>
          ) : isError ? (
            <li className="p-2 text-gray-500 flex justify-center">{isError}</li>
          ) : (
            products?.map((product: CardProductProps) => (
              <li
                key={product.id}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelectProduct(product.name)}
              >
                <div>
                  {product.all_variants.map((variant) => (
                    <div className="flex items-center gap-2">
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
      )}
    </div>
  );
};

export default Search;
