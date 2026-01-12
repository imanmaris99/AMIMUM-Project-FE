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

const useSearchPagination = ({ 
  searchQuery, 
  brandFilter 
}: UseSearchPaginationProps): UseSearchPaginationReturn => {
  const [products, setProducts] = useState<CardProductProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalAvailable, setTotalAvailable] = useState(0);

  const ITEMS_PER_PAGE = 10; // Sesuai dengan backend limit default

  const fetchProducts = useCallback(async (
    query: string, 
    page: number, 
    isInitial: boolean = false
  ) => {
    try {
      if (isInitial) {
        setIsLoading(true);
        setIsError(false);
        setErrorMessage(null);
      } else {
        setIsLoadingMore(true);
      }

      const allProducts = await SearchGetProduct(query);
      
      // Apply brand filter if provided
      const filteredProducts = brandFilter
        ? allProducts.filter(product => 
            product.brand_info?.name?.toLowerCase().includes(brandFilter.toLowerCase())
          )
        : allProducts;

      // Client-side pagination (since API doesn't support pagination)
      const startIndex = (page - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      const pageProducts = filteredProducts.slice(startIndex, endIndex);

      if (isInitial) {
        setProducts(pageProducts);
        setTotalAvailable(filteredProducts.length);
      } else {
        setProducts(prev => [...prev, ...pageProducts]);
      }

      setHasMore(endIndex < filteredProducts.length);
      setCurrentPage(page);

    } catch (error) {
      setIsError(true);
      setErrorMessage(error instanceof Error ? error.message : 'Gagal mengambil data produk');
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [ITEMS_PER_PAGE, brandFilter]);

  // Reset state when search query changes
  useEffect(() => {
    if (searchQuery.trim()) {
      setProducts([]);
      setCurrentPage(1);
      setHasMore(true);
      setTotalAvailable(0);
      fetchProducts(searchQuery, 1, true);
    }
  }, [searchQuery, brandFilter, fetchProducts]);

  const loadMore = useCallback(() => {
    if (!isLoadingMore && hasMore && searchQuery.trim()) {
      fetchProducts(searchQuery, currentPage + 1, false);
    }
  }, [fetchProducts, isLoadingMore, hasMore, searchQuery, currentPage]);

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
