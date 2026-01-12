"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { CardProductProps } from "./CardProduct/types";
import { SearchGetProduct } from "@/services/api/product";

function debounce<T extends (...args: unknown[]) => void>(fn: T, delay: number): T {
  let timeout: ReturnType<typeof setTimeout>;
  return function(this: unknown, ...args: unknown[]) {
    try {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn.apply(this, args), delay);
    } catch {
    }
  } as T;
}

const useSearchLogic = () => {
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [products, setProducts] = useState<CardProductProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  const handleSearch = () => {
    try {
      if (search.trim()) {
        router.push(`/search?q=${search}`);
      }
    } catch {
    }
  };

  const handleSelectProduct = (productId: string) => {
    try {
      if (!productId) {
        return;
      }
      
      router.push(`/detail-product/${productId}`);
    } catch {
    }
  };

  const debouncedFetch = useMemo(() => debounce(async (...args: unknown[]) => {
    const value = args[0] as string;
    setIsLoading(true);
    setIsError(false);
    setErrorMessage("");
    try {
      const products = await SearchGetProduct(value);
      
      // Limit to 5 products for dropdown
      const limitedProducts = products.slice(0, 5);
      
      setProducts(limitedProducts);
    } catch (err: unknown) {
      setIsError(true);
      setErrorMessage(err instanceof Error ? err.message : "Gagal mengambil data produk.");
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, 400), []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const value = e.target.value;
      setSearch(value);
      setShowDropdown(value.length > 0);
      
      if (value.length > 0) {
        debouncedFetch(value);
      } else {
        setProducts([]);
      }
    } catch {
    }
  };

  const handleClickOutside = useMemo(() => (event: MouseEvent) => {
    try {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    } catch {
    }
  }, []);

  useEffect(() => {
    try {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    } catch {
    }
  }, [handleClickOutside]);

  return {
    search,
    setSearch,
    showDropdown,
    setShowDropdown,
    handleSelectProduct,
    searchRef,
    handleInputChange,
    handleSearch,
    products,
    isLoading,
    isError,
    errorMessage,
  };
};

export default useSearchLogic;