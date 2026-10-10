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
    <section className="mx-4 mt-4 flex flex-col gap-3 rounded-3xl bg-white/95 p-4 shadow-[0_8px_22px_rgba(15,23,42,0.08)] sm:mx-6">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">Cari di brand ini</p>
        <p className="mt-1 text-sm leading-5 text-[#6B7C73]">Temukan produk khusus dari {safeBrandName} tanpa keluar dari halaman brand.</p>
      </div>
      <div className="relative">
        <input
          type="search"
          inputMode="search"
          placeholder={`Cari produk dari ${safeBrandName}`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyPress}
          disabled={isSearching}
          className="w-full rounded-2xl border border-emerald-100 bg-emerald-50/50 p-3 pr-12 text-sm font-semibold text-gray-900 outline-none placeholder:text-sm placeholder:font-normal placeholder:text-gray-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-gray-50"
        />
        <button
          type="button"
          aria-label="Cari produk dari brand ini"
          disabled={isSearching || !searchQuery.trim()}
          onClick={() => void handleSearch()}
          className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl bg-[#00764F] text-white transition-colors hover:bg-[#005A3C] disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          <CiSearch className="h-5 w-5" />
        </button>
      </div>

      {isSearching && (
        <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 px-3 py-2 text-sm text-[#00764F]">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#00764F] border-t-transparent"></div>
          <span>Mencari produk katalog dari {safeBrandName}...</span>
        </div>
      )}

      {hasSearched && !isSearching && (
        <div className="mt-2">
          {searchError ? (
            <div className="rounded-3xl border border-amber-100 bg-amber-50 px-4 py-8 text-center shadow-[0_8px_22px_rgba(15,23,42,0.06)]">
              <p className="text-sm text-amber-800">{searchError}</p>
              <button
                onClick={handleClearSearch}
                className="mt-3 text-sm text-[#00764F] hover:underline"
              >
                Hapus pencarian
              </button>
            </div>
          ) : searchResults.length > 0 ? (
            <div>
              <div className="mb-3 flex flex-col gap-2 rounded-2xl bg-emerald-50 px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-[#6B7C73]">
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
            <div className="rounded-3xl bg-gray-50 px-4 py-8 text-center">
              <p className="mb-1 text-sm text-gray-700">Belum ada produk katalog yang cocok.</p>
              <p className="text-xs text-gray-500">
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
        <div className="mt-1 flex flex-col gap-2 rounded-2xl bg-red-50 px-3 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold text-red-700">
            Lihat produk yang sedang promo?
          </p>
          <Button
            variant="destructive"
            type="button"
            onClick={handleCheckPromo}
            className="rounded-xl bg-red-500 text-white transition-colors hover:bg-red-600"
          >
            Cek Promo
          </Button>
        </div>
      )}
    </section>
  );
};

export default SearchProductByBrand;
