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
    handleSelectProduct,
    searchRef,
    handleInputChange,
    handleSearch
  } = useSearchLogic();

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
        <SearchDropdown
          products={products || []}
          isLoading={isLoading}
          isError={isError}
          errorMessage={errorMessage || ""}
          handleSelectProduct={handleSelectProduct}
        />
      )}
    </div>
  );
};

export default Search;
