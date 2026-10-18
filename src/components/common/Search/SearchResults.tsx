"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { CardProductProps } from "./CardProduct/types";
import ListProductSection from "./List_Product_Section";
import LoadMoreButton from "./LoadMoreButton";
import { CiSearch } from "react-icons/ci";
import { filterAndSortSearchProducts, SearchProductSortOrder } from "@/lib/searchProductControls";

interface SearchResultsProps {
  searchQuery: string;
  searchResults: CardProductProps[];
  errorMessage: string | null;
  brandFilter?: string;
  isLoading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
  totalLoaded?: number;
  totalAvailable?: number;
}

const SearchResults = ({ 
  searchQuery, 
  searchResults, 
  errorMessage, 
  brandFilter,
  isLoading = false,
  hasMore = false,
  onLoadMore,
  isLoadingMore = false,
  totalLoaded = 0,
  totalAvailable = 0
}: SearchResultsProps) => {
  const [sortOrder, setSortOrder] = useState<SearchProductSortOrder>('relevance');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [minPriceInput, setMinPriceInput] = useState('');
  const [maxPriceInput, setMaxPriceInput] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const hasResults = searchResults && searchResults.length > 0;
  const sanitizedSearchQuery = searchQuery.trim();
  const sanitizedBrandFilter = brandFilter?.trim();
  const isSearching = sanitizedSearchQuery.length > 0;

  // Use provided props or fallback to internal state for backward compatibility
  const displayHasMore = hasMore !== undefined ? hasMore : (searchResults.length > 10);
  const displayTotalLoaded = totalLoaded > 0 ? totalLoaded : searchResults.length;
  const displayTotalAvailable = totalAvailable > 0 ? totalAvailable : searchResults.length;
  const displayIsLoadingMore = isLoadingMore;

  useEffect(() => {
    setSortOrder('relevance');
    setSelectedBrand('');
    setMinPriceInput('');
    setMaxPriceInput('');
    setInStockOnly(false);
  }, [searchQuery, brandFilter]);

  const brandOptions = useMemo(() => {
    const brands = new Map<string, string>();
    searchResults.forEach((product) => {
      const name = product.brand_info?.name?.trim();
      if (name) brands.set(name.toLowerCase(), name);
    });
    return [...brands.values()].sort((a, b) => a.localeCompare(b, 'id'));
  }, [searchResults]);

  const minPrice = minPriceInput.trim() ? Number(minPriceInput) : undefined;
  const maxPrice = maxPriceInput.trim() ? Number(maxPriceInput) : undefined;
  const filteredSearchResults = useMemo(
    () => filterAndSortSearchProducts(searchResults, {
      brandName: selectedBrand || undefined,
      minPrice: Number.isFinite(minPrice) ? minPrice : undefined,
      maxPrice: Number.isFinite(maxPrice) ? maxPrice : undefined,
      inStockOnly,
      sortOrder,
    }),
    [searchResults, selectedBrand, minPrice, maxPrice, inStockOnly, sortOrder],
  );
  const hasActiveFilters = Boolean(selectedBrand || minPriceInput || maxPriceInput || inStockOnly);
  const hasActiveControls = hasActiveFilters || sortOrder !== 'relevance';

  const resetControls = () => {
    setSortOrder('relevance');
    setSelectedBrand('');
    setMinPriceInput('');
    setMaxPriceInput('');
    setInStockOnly(false);
  };

  const handleLoadMore = () => {
    if (onLoadMore) {
      onLoadMore();
    }
  };

  return (
    <div className="px-4 py-4 sm:px-6">
      {/* Search Header */}
      <div className="mb-4 rounded-3xl bg-white/95 p-4 shadow-[0_8px_22px_rgba(15,23,42,0.08)]">
        <div className="flex items-center gap-2 mb-2">
          <CiSearch className="w-5 h-5 text-emerald-700" />
          <h2 className="text-base font-bold text-gray-900">
            Hasil Pencarian
          </h2>
        </div>
        
        {/* Search Query Display */}
        <div className="text-sm leading-5 text-[#6B7C73]">
          {isSearching ? (
            <span>
              Menampilkan hasil katalog untuk: <span className="font-semibold text-[#2F6F5A]">&ldquo;{sanitizedSearchQuery}&rdquo;</span>
              {sanitizedBrandFilter && (
                <span> dari merek <span className="font-semibold text-[#2F6F5A]">&ldquo;{sanitizedBrandFilter}&rdquo;</span></span>
              )}
            </span>
          ) : (
            <span className="text-gray-500">Masukkan kata kunci produk di kolom pencarian untuk melihat katalog toko.</span>
          )}
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="mb-4 rounded-3xl border border-red-100 bg-red-50 p-4 shadow-[0_8px_22px_rgba(15,23,42,0.06)]">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="text-red-700 font-medium">Pencarian belum bisa dimuat</span>
          </div>
          <p className="text-red-600 text-sm mt-1">
            {errorMessage || "Data pencarian produk belum tersedia. Silakan coba lagi beberapa saat lagi."}
          </p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="rounded-3xl bg-white/95 px-5 py-12 text-center shadow-[0_8px_22px_rgba(15,23,42,0.08)]">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="animate-spin h-8 w-8 text-[#2F6F5A]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="text-gray-600 text-sm">Mencari produk...</p>
        </div>
      )}

      {/* No Query State */}
      {!isLoading && !isSearching && !errorMessage && (
        <div className="rounded-3xl bg-white/95 px-5 py-8 text-center shadow-[0_8px_22px_rgba(15,23,42,0.08)]">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 ring-1 ring-emerald-100">
            <CiSearch className="h-8 w-8 text-emerald-700" />
          </div>
          <h3 className="mb-2 text-lg font-bold text-gray-900">Mulai cari produk toko</h3>
          <p className="mx-auto mb-4 max-w-[300px] text-sm leading-5 text-[#6B7C73]">
            Gunakan kolom pencarian di atas untuk mencari produk herbal, brand, kategori, atau layanan custom craft.
          </p>
          <div className="mx-auto grid max-w-[300px] grid-cols-2 gap-2 text-xs text-[#6B7C73]">
            <span className="rounded-2xl bg-emerald-50 px-3 py-2">Herbal</span>
            <span className="rounded-2xl bg-emerald-50 px-3 py-2">Jamu</span>
            <span className="rounded-2xl bg-emerald-50 px-3 py-2">Madu</span>
            <span className="rounded-2xl bg-emerald-50 px-3 py-2">Custom Craft</span>
          </div>
        </div>
      )}

      {/* No Results Message */}
      {!isLoading && isSearching && !hasResults && !errorMessage && (
        <div className="rounded-3xl bg-white/95 px-5 py-10 text-center shadow-[0_8px_22px_rgba(15,23,42,0.08)]">
          <div className="w-16 h-16 mx-auto mb-4 bg-amber-50 rounded-full flex items-center justify-center ring-1 ring-amber-100">
            <CiSearch className="w-8 h-8 text-amber-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada produk katalog</h3>
          <p className="text-gray-500 text-sm mb-4">
            Belum ada produk katalog yang cocok dengan pencarian <span className="font-semibold">&ldquo;{sanitizedSearchQuery}&rdquo;</span>
            {sanitizedBrandFilter && (
              <span> dari merek <span className="font-semibold">&ldquo;{sanitizedBrandFilter}&rdquo;</span></span>
            )}
          </p>
          <div className="text-sm text-gray-400">
            <p>Coba gunakan kata kunci yang lebih umum atau cek kategori produk di halaman utama.</p>
            {sanitizedBrandFilter && (
              <p className="mt-1">Atau cari produk dari brand lain yang tersedia di katalog toko.</p>
            )}
          </div>
        </div>
      )}

      {/* Results Count */}
      {hasResults && (
        <div className="mb-4 rounded-2xl bg-white/80 p-4 shadow-[0_8px_18px_rgba(15,23,42,0.05)]">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm text-[#6B7C73]" aria-live="polite">
              {hasActiveFilters ? (
                <>Menampilkan <span className="font-semibold text-[#2F6F5A]">{filteredSearchResults.length}</span> dari <span className="font-semibold text-[#2F6F5A]">{displayTotalAvailable}</span> produk</>
              ) : (
                <>Ditemukan <span className="font-semibold text-[#2F6F5A]">{displayTotalAvailable}</span> produk</>
              )}
              {sanitizedBrandFilter && (
                <span> dari merek <span className="font-semibold text-[#2F6F5A]">&ldquo;{sanitizedBrandFilter}&rdquo;</span></span>
              )}
            </p>
            {hasActiveControls && (
              <button
                type="button"
                onClick={resetControls}
                className="min-h-9 rounded-xl px-3 text-xs font-semibold text-emerald-800 hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
              >
                Reset
              </button>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <label className="flex min-w-0 flex-col gap-1 text-xs font-medium text-[#6B7C73]">
              Urutkan
              <select
                aria-label="Urutkan produk"
                className="min-h-11 w-full rounded-xl border border-emerald-100 bg-white px-3 text-sm text-[#0D0E09] outline-none focus:ring-2 focus:ring-emerald-200"
                value={sortOrder}
                onChange={(event) => setSortOrder(event.target.value as SearchProductSortOrder)}
              >
                <option value="relevance">Paling relevan</option>
                <option value="price-asc">Harga terendah</option>
                <option value="price-desc">Harga tertinggi</option>
                <option value="newest">Terbaru</option>
              </select>
            </label>

            {brandOptions.length > 1 && (
              <label className="flex min-w-0 flex-col gap-1 text-xs font-medium text-[#6B7C73]">
                Merek
                <select
                  aria-label="Filter merek"
                  className="min-h-11 w-full rounded-xl border border-emerald-100 bg-white px-3 text-sm text-[#0D0E09] outline-none focus:ring-2 focus:ring-emerald-200"
                  value={selectedBrand}
                  onChange={(event) => setSelectedBrand(event.target.value)}
                >
                  <option value="">Semua merek</option>
                  {brandOptions.map((brand) => <option key={brand} value={brand}>{brand}</option>)}
                </select>
              </label>
            )}

            <div className="grid grid-cols-2 gap-2">
              <label className="flex min-w-0 flex-col gap-1 text-xs font-medium text-[#6B7C73]">
                Harga min. (Rp)
                <input
                  aria-label="Harga minimum"
                  type="number"
                  min="0"
                  inputMode="numeric"
                  placeholder="Tanpa batas"
                  value={minPriceInput}
                  onChange={(event) => setMinPriceInput(event.target.value)}
                  className="min-h-11 w-full min-w-0 rounded-xl border border-emerald-100 bg-white px-3 text-sm text-[#0D0E09] outline-none focus:ring-2 focus:ring-emerald-200"
                />
              </label>
              <label className="flex min-w-0 flex-col gap-1 text-xs font-medium text-[#6B7C73]">
                Harga maks. (Rp)
                <input
                  aria-label="Harga maksimum"
                  type="number"
                  min="0"
                  inputMode="numeric"
                  placeholder="Tanpa batas"
                  value={maxPriceInput}
                  onChange={(event) => setMaxPriceInput(event.target.value)}
                  className="min-h-11 w-full min-w-0 rounded-xl border border-emerald-100 bg-white px-3 text-sm text-[#0D0E09] outline-none focus:ring-2 focus:ring-emerald-200"
                />
              </label>
            </div>

            <label className="flex min-h-11 items-center gap-2 rounded-xl border border-emerald-100 bg-white px-3 text-sm text-[#0D0E09] sm:self-end">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(event) => setInStockOnly(event.target.checked)}
                className="h-4 w-4 accent-emerald-700"
              />
              Stok tersedia
            </label>
          </div>
        </div>
      )}

      {hasResults && filteredSearchResults.length === 0 && (
        <div role="status" className="mb-4 rounded-2xl bg-white/95 px-5 py-8 text-center shadow-[0_8px_22px_rgba(15,23,42,0.06)]">
          <h3 className="text-base font-semibold text-gray-900">Tidak ada produk yang cocok</h3>
          <p className="mt-1 text-sm text-[#6B7C73]">Coba ubah rentang harga, merek, atau pilihan stok.</p>
          <button
            type="button"
            onClick={resetControls}
            className="mt-4 min-h-10 rounded-xl bg-[#2F6F5A] px-4 text-sm font-semibold text-white hover:bg-[#285E4E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
          >
            Hapus filter
          </button>
        </div>
      )}

      {/* Product List */}
      {hasResults && filteredSearchResults.length > 0 && <ListProductSection products={filteredSearchResults} />}

      {/* Load More Button */}
      {hasResults && (
        <LoadMoreButton
          isLoading={displayIsLoadingMore}
          hasMore={displayHasMore}
          onLoadMore={handleLoadMore}
          totalLoaded={displayTotalLoaded}
          totalAvailable={displayTotalAvailable}
        />
      )}
    </div>
  );
};

export default SearchResults;
