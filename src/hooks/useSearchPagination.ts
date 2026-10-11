"use client";

import { useState, useEffect, useCallback } from 'react';
import { CardProductProps } from '@/components/common/Search/CardProduct/types';
import { SearchGetProduct } from '@/services/api/product';

interface UseSearchPaginationProps {
  searchQuery: string;
  brandFilter?: string;
}

interface UseSearchPaginationReturn {
  products: CardProductProps[];
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
  hasMore: boolean;
  loadMore: () => void;
  isLoadingMore: boolean;
  totalLoaded: number;
  totalAvailable: number;
}

const ITEMS_PER_PAGE = 10;

const useSearchPagination = ({
  searchQuery,
  brandFilter
}: UseSearchPaginationProps): UseSearchPaginationReturn => {
  const [allResults, setAllResults] = useState<CardProductProps[]>([]);
  const [products, setProducts] = useState<CardProductProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [totalAvailable, setTotalAvailable] = useState(0);

  const fetchProducts = useCallback(async (query: string) => {
    try {
      setIsLoading(true);
      setIsError(false);
      setErrorMessage(null);
      setAllResults([]);
      setProducts([]);
      setCurrentPage(1);
      setHasMore(false);
      setTotalAvailable(0);

      const loadedProducts = await SearchGetProduct(query);
      const filteredProducts = brandFilter
        ? loadedProducts.filter(product =>
            product.brand_info?.name?.toLowerCase().includes(brandFilter.toLowerCase())
          )
        : loadedProducts;

      const firstPageProducts = filteredProducts.slice(0, ITEMS_PER_PAGE);

      setAllResults(filteredProducts);
      setProducts(firstPageProducts);
      setTotalAvailable(filteredProducts.length);
      setHasMore(ITEMS_PER_PAGE < filteredProducts.length);
      setCurrentPage(1);
    } catch {
      setIsError(true);
      setErrorMessage('Data pencarian produk belum tersedia. Silakan coba lagi beberapa saat lagi.');
    } finally {
      setIsLoading(false);
    }
  }, [brandFilter]);

  useEffect(() => {
    if (searchQuery.trim()) {
      fetchProducts(searchQuery.trim());
      return;
    }

    setAllResults([]);
    setProducts([]);
    setCurrentPage(1);
    setHasMore(false);
    setTotalAvailable(0);
    setIsError(false);
    setErrorMessage(null);
  }, [searchQuery, brandFilter, fetchProducts]);

  const loadMore = useCallback(() => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);

    try {
      const nextPage = currentPage + 1;
      const endIndex = nextPage * ITEMS_PER_PAGE;
      const nextProducts = allResults.slice(0, endIndex);

      setProducts(nextProducts);
      setCurrentPage(nextPage);
      setHasMore(endIndex < allResults.length);
    } finally {
      setIsLoadingMore(false);
    }
  }, [allResults, currentPage, hasMore, isLoadingMore]);

  return {
    products,
    isLoading,
    isError,
    errorMessage,
    hasMore,
    loadMore,
    isLoadingMore,
    totalLoaded: products.length,
    totalAvailable
  };
};

export default useSearchPagination;
