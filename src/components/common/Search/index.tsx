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
    <div className="relative mx-4 mt-4 sm:mx-6" ref={searchRef}>
      <div className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-3 py-2.5 shadow-sm transition-colors focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10">
        <CiSearch className="h-6 w-6 flex-shrink-0 text-gray-500" />
        <input
          className="min-w-0 flex-1 bg-transparent px-1 text-base font-medium leading-6 text-gray-900 placeholder:text-sm placeholder:font-normal placeholder:text-gray-400 focus:outline-none sm:text-[17px]"
          type="text"
          placeholder="Cari produk herbal"
          value={search}
          onChange={handleInputChange}
          onFocus={() => {
            if (search.length > 0) {
              setShowDropdown(true);
            }
          }}
        />
        <Button
          onClick={handleSearch}
          variant="default"
          disabled={!search.trim()}
          className="h-10 rounded-xl px-5 text-sm font-semibold shadow-sm disabled:opacity-50"
        >
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
