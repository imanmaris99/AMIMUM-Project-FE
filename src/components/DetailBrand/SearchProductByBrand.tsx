"use client";

import { useState } from 'react';
import { CiSearch } from 'react-icons/ci';
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { SearchGetProductByBrand } from "@/services/api/product";
import { CardProductProps } from "@/components/common/Search/CardProduct/types";
import ListProductSection from "@/components/common/Search/List_Product_Section";

interface SearchProductByBrandProps {
  brandId: number;
  brandName?: string;
  brandData?: {
    id: number;
    name: string;
    photo_url?: string;
  } | null;
}

const SearchProductByBrand = ({ brandId, brandName, brandData }: SearchProductByBrandProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<CardProductProps[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const router = useRouter();
  const safeBrandName = brandName?.trim() || brandData?.name?.trim() || "brand ini";

  const handleSearch = async () => {
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) {
      return;
    }

    setIsSearching(true);
    setHasSearched(true);
    setSearchResults([]);
    setSearchError(null);

    try {
      const brandProducts = await SearchGetProductByBrand(brandId, trimmedQuery);

      const productsWithBrandInfo = brandProducts.map(product => ({
        ...product,
        all_variants: Array.isArray(product.all_variants) ? product.all_variants : [],
        brand_info: {
          ...product.brand_info,
          id: brandId,
          name: brandData?.name || brandName || "",
          photo_url: brandData?.photo_url || undefined,
        },
      }));

      setSearchResults(productsWithBrandInfo);
    } catch {
      setSearchResults([]);
      setSearchError("Pencarian produk brand belum bisa dimuat. Silakan coba lagi beberapa saat lagi.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isSearching) {
      void handleSearch();
    }
  };

  const handleCheckPromo = () => {
    router.push(`/promo/${brandId}`);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setHasSearched(false);
    setSearchError(null);
  };

  return (
    <div className="flex flex-col gap-3 mt-2 mx-6">
      <div className="relative">
        <input
          type="text"
          placeholder={`Cari produk dari ${safeBrandName}`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyPress}
          disabled={isSearching}
          className="w-full border border-gray-300 rounded-lg p-3 pl-6 outline-none placeholder:text-sm focus:border-[#006A47] focus:ring-1 focus:ring-[#006A47] disabled:bg-gray-50 disabled:cursor-not-allowed"
        />
        <CiSearch
          className={`absolute w-6 h-6 right-4 top-1/2 -translate-y-1/2 cursor-pointer transition-colors ${
            isSearching
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-500 hover:text-[#006A47]'
          }`}
          onClick={!isSearching ? () => void handleSearch() : undefined}
        />
      </div>

      {isSearching && (
        <div className="flex items-center gap-2 text-sm text-[#00764F]">
          <div className="w-4 h-4 border-2 border-[#00764F] border-t-transparent rounded-full animate-spin"></div>
          <span>Mencari produk katalog dari {safeBrandName}...</span>
        </div>
      )}

      {hasSearched && !isSearching && (
        <div className="mt-2">
          {searchError ? (
            <div className="text-center py-8 bg-yellow-50 border border-yellow-200 rounded-lg px-4">
              <p className="text-yellow-800 text-sm">{searchError}</p>
              <button
                onClick={handleClearSearch}
                className="mt-3 text-sm text-[#00764F] hover:underline"
              >
                Hapus pencarian
              </button>
            </div>
          ) : searchResults.length > 0 ? (
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-gray-600">
                  Ditemukan <span className="font-semibold text-[#00764F]">{searchResults.length}</span> produk katalog
                </p>
                <button
                  onClick={handleClearSearch}
                  className="text-sm text-[#00764F] hover:underline"
                >
                  Hapus pencarian
                </button>
              </div>
              <ListProductSection products={searchResults} />
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg px-4">
              <p className="text-gray-600 text-sm mb-1">Belum ada produk katalog yang cocok.</p>
              <p className="text-gray-500 text-xs">
                Belum ada produk yang cocok dengan &ldquo;{searchQuery.trim()}&rdquo; dari {safeBrandName}.
              </p>
              <button
                onClick={handleClearSearch}
                className="mt-3 text-sm text-[#00764F] hover:underline"
              >
                Hapus pencarian
              </button>
            </div>
          )}
        </div>
      )}

      {!hasSearched && (
        <div className="flex justify-center items-center gap-2 mt-2">
          <p className="text-gray-500 text-sm font-jakarta font-semibold">
            Lihat produk yang sedang promo?
          </p>
          <Button
            variant="destructive"
            type="button"
            onClick={handleCheckPromo}
            className="bg-red-500 hover:bg-red-600 text-white transition-colors"
          >
            Cek Promo
          </Button>
        </div>
      )}
    </div>
  );
};

export default SearchProductByBrand;
