"use client";

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
    } catch (error) {
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
    } catch (error) {
    }
  };

  const handleSelectProduct = (productId: string) => {
    try {
      if (!productId) {
        return;
      }
      
      router.push(`/detail-product/${productId}`);
    } catch (error) {
    }
  };

  // Menggunakan data dari centralized dummy data yang sudah sesuai dengan backend
  const dummyProducts = useMemo(() => {
    try {
      return generateCardProductData();
    } catch (error) {
      return [];
    }
  }, []);

  // Ganti handleInputChange dengan versi debounce - dinonaktifkan sementara
  const debouncedFetch = useMemo(() => debounce(async (...args: unknown[]) => {
    const value = args[0] as string;
    setIsLoading(true);
    setIsError(false);
    setErrorMessage("");
    try {
      // API call dinonaktifkan sementara karena server sedang down
      // const res = await axios.get(`/api/product/search?name=${encodeURIComponent(value)}`);
      // setProducts(Array.isArray(res.data?.data) ? res.data.data : []);
      
      // Menggunakan dummy data sementara dengan validasi
      const filteredProducts = dummyProducts
        .filter(product => 
          validateProductData(product) && 
          product.name.toLowerCase().includes(value.toLowerCase())
        )
        .sort((a, b) => {
          // Urutkan berdasarkan relevansi: yang cocok di awal nama lebih relevan
          const aIndex = a.name.toLowerCase().indexOf(value.toLowerCase());
          const bIndex = b.name.toLowerCase().indexOf(value.toLowerCase());
          return aIndex - bIndex;
        })
        .slice(0, 5); // Batasi maksimal 5 hasil
      
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
    } catch (error) {
    }
  };

  const handleClickOutside = useMemo(() => (event: MouseEvent) => {
    try {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    } catch (error) {
    }
  }, []);

  useEffect(() => {
    try {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    } catch (error) {
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