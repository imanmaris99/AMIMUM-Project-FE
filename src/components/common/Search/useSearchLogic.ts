import { useState, useEffect, useRef } from "react";
import { useSearchProduct } from "@/hooks/useSearchProduct";
import { useRouter } from "next/navigation";

const useSearchLogic = () => {
  const [search, setSearch] = useState("");
  const { products, isError, isLoading, errorMessage } = useSearchProduct(search);
  const [showDropdown, setShowDropdown] = useState(false);
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

  return {
    search,
    setSearch,
    products,
    isError,
    isLoading,
    errorMessage,
    showDropdown,
    setShowDropdown,
    handleSelectProduct,
    searchRef,
    handleInputChange,
    handleSearch,
  };
};

export default useSearchLogic;
