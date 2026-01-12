import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { CardProductProps } from "./CardProduct/types";
import { generateCardProductData } from "@/data/dummyData";
import { validateProductData } from "@/utils/dataValidation";

function debounce<T extends (...args: unknown[]) => void>(fn: T, delay: number): T {
  let timeout: ReturnType<typeof setTimeout>;
  return function(this: unknown, ...args: unknown[]) {
    try {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn.apply(this, args), delay);
    } catch {
      // Silent error handling
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
      // Silent error handling
    }
  };

  const handleSelectProduct = (productId: string) => {
    try {
      if (!productId) {
        return;
      }
      
      router.push(`/detail-product/${productId}`);
    } catch {
      // Silent error handling
    }
  };

  const dummyProducts = useMemo(() => {
    try {
      return generateCardProductData();
    } catch {
      return [];
    }
  }, []);

  const debouncedFetch = useMemo(() => debounce(async (...args: unknown[]) => {
    const value = args[0] as string;
    setIsLoading(true);
    setIsError(false);
    setErrorMessage("");
    try {
      const filteredProducts = dummyProducts
        .filter(product => 
          validateProductData(product) && 
          product.name.toLowerCase().includes(value.toLowerCase())
        )
        .sort((a, b) => {
          const aIndex = a.name.toLowerCase().indexOf(value.toLowerCase());
          const bIndex = b.name.toLowerCase().indexOf(value.toLowerCase());
          return aIndex - bIndex;
        })
        .slice(0, 5);
      
      setProducts(filteredProducts);
    } catch (err: unknown) {
      setIsError(true);
      setErrorMessage(err instanceof Error ? err.message : "Gagal mengambil data produk.");
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, 400), [dummyProducts]);

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
      // Silent error handling
    }
  };

  const handleClickOutside = useMemo(() => (event: MouseEvent) => {
    try {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    } catch {
      // Silent error handling
    }
  }, []);

  useEffect(() => {
    try {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    } catch {
      // Silent error handling
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