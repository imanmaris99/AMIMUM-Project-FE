"use client";

import React, { useState, useEffect } from 'react';
import { CardProductProps } from "./CardProduct/types";
import ListProductSection from "./List_Product_Section";
import LoadMoreButton from "./LoadMoreButton";
import { CiSearch } from "react-icons/ci";

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
  const hasResults = searchResults && searchResults.length > 0;
  const isSearching = searchQuery.trim().length > 0;

  // Use provided props or fallback to internal state for backward compatibility
  const displayHasMore = hasMore !== undefined ? hasMore : (searchResults.length > 10);
  const displayTotalLoaded = totalLoaded > 0 ? totalLoaded : searchResults.length;
  const displayTotalAvailable = totalAvailable > 0 ? totalAvailable : searchResults.length;
  const displayIsLoadingMore = isLoadingMore;

  const handleLoadMore = () => {
    if (onLoadMore) {
      onLoadMore();
    }
  };

  return (
    <div className="px-6 py-4 mt-5">
      {/* Search Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <CiSearch className="w-5 h-5 text-gray-500" />
          <h1 className="text-lg font-semibold text-gray-900">
            Hasil Pencarian
          </h1>
        </div>
        
        {/* Search Query Display */}
        <div className="text-sm text-gray-600">
          {isSearching ? (
            <span>
              Menampilkan hasil untuk: <span className="font-semibold text-[#00764F]">"{searchQuery}"</span>
              {brandFilter && (
                <span> dari merek <span className="font-semibold text-[#00764F]">"{brandFilter}"</span></span>
              )}
            </span>
          ) : (
            <span className="text-gray-500">Masukkan kata kunci untuk mencari produk</span>
          )}
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="text-red-700 font-medium">Terjadi kesalahan</span>
          </div>
          <p className="text-red-600 text-sm mt-1">{errorMessage}</p>
        </div>
      )}

      {/* No Results Message */}
      {isSearching && !hasResults && !errorMessage && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <CiSearch className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada produk ditemukan</h3>
          <p className="text-gray-500 text-sm mb-4">
            Tidak ada produk yang cocok dengan pencarian <span className="font-semibold">"{searchQuery}"</span>
            {brandFilter && (
              <span> dari merek <span className="font-semibold">"{brandFilter}"</span></span>
            )}
          </p>
          <div className="text-sm text-gray-400">
            <p>Coba gunakan kata kunci yang berbeda atau lebih umum</p>
            {brandFilter && (
              <p className="mt-1">Atau cari produk dari merek lain</p>
            )}
          </div>
        </div>
      )}

      {/* Results Count */}
      {hasResults && (
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Ditemukan <span className="font-semibold text-[#00764F]">{displayTotalAvailable}</span> produk
            {brandFilter && (
              <span> dari merek <span className="font-semibold text-[#00764F]">"{brandFilter}"</span></span>
            )}
          </p>
        </div>
      )}

      {/* Product List */}
      {hasResults && <ListProductSection products={searchResults} />}

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
