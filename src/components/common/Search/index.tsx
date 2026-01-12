"use client";

import { CiSearch } from "react-icons/ci";
import { Button } from "@/components/ui/button";
import useSearchLogic from './useSearchLogic';
import SearchDropdown from './SearchDropdown';

const Search = () => {
  const {
    search,
    products,
    isError,
    isLoading,
    errorMessage,
    showDropdown,
    setShowDropdown,
    handleSelectProduct,
    searchRef,
    handleInputChange,
    handleSearch
  } = useSearchLogic();

  return (
    <div className="relative mt-4 mx-6" ref={searchRef}>
      <div className="flex items-center justify-center border border-gray-200 rounded-lg px-2 py-2">
        <CiSearch className="w-8 h-8 text-gray-500 ml-2" />
        <input
          className="w-full px-2 focus:outline-none text-lg placeholder:text-sm"
          type="text"
          placeholder="Cari produk"
          value={search}
          onChange={handleInputChange}
          onFocus={() => {
            if (search.length > 0) {
              setShowDropdown(true);
            }
          }}
        />
        <Button onClick={handleSearch} variant="default" disabled={!search.trim()}>
          Cari
        </Button>
      </div>

      {showDropdown && (
        <SearchDropdown
          products={products || []}
          isLoading={isLoading}
          isError={isError}
          errorMessage={errorMessage || ""}
          handleSelectProduct={(productId) => {
            handleSelectProduct(productId);
            setShowDropdown(false);
          }}
        />
      )}
    </div>
  );
};

export default Search;
