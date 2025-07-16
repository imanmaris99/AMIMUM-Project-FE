import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const useSearchLogic = () => {
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
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

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    setShowDropdown(value.length > 0);
    if (value.length > 0) {
      setIsLoading(true);
      setIsError(false);
      setErrorMessage("");
      try {
        const res = await axios.get(`/api/product/search?name=${encodeURIComponent(value)}`);
        setProducts(Array.isArray(res.data?.data) ? res.data.data : []);
      } catch (err: any) {
        setIsError(true);
        setErrorMessage(err?.response?.data?.message || "Gagal mengambil data produk.");
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
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
