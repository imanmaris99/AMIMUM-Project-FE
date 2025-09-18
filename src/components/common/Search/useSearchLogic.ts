import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { CardProductProps } from "./CardProduct/types";
import { generateCardProductData } from "@/data/dummyData";

function debounce<T extends (...args: unknown[]) => void>(fn: T, delay: number): T {
  let timeout: ReturnType<typeof setTimeout>;
  return function(this: unknown, ...args: unknown[]) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), delay);
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
    if (search.trim()) {
      router.push(`/search?q=${search}`);
    }
  };

  const handleSelectProduct = (productId: string) => {
    router.push(`/detail-product/${productId}`);
  };

  // Menggunakan data dari centralized dummy data yang sudah sesuai dengan backend
  const dummyProducts = generateCardProductData();

  // Ganti handleInputChange dengan versi debounce - dinonaktifkan sementara
  const debouncedFetch = debounce(async (value: string) => {
    setIsLoading(true);
    setIsError(false);
    setErrorMessage("");
    try {
      // API call dinonaktifkan sementara karena server sedang down
      // const res = await axios.get(`/api/product/search?name=${encodeURIComponent(value)}`);
      // setProducts(Array.isArray(res.data?.data) ? res.data.data : []);
      
      // Menggunakan dummy data sementara
      const filteredProducts = dummyProducts
        .filter(product => 
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
  }, 400);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    setShowDropdown(value.length > 0);
    if (value.length > 0) {
      debouncedFetch(value);
    } else {
      setProducts([]);
    }
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