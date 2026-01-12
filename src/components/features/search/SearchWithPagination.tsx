"use client";

import { useState, useEffect } from 'react';
import SearchResults from './SearchResults';
import { CardProductProps } from './CardProduct/types';
import { searchProducts } from '@/data/dataUtils';

interface SearchWithPaginationProps {
  searchQuery: string;
  brandFilter?: string;
}

const SearchWithPagination = ({ searchQuery, brandFilter }: SearchWithPaginationProps) => {
  const [displayedProducts, setDisplayedProducts] = useState<CardProductProps[]>([]);
  const [allProducts, setAllProducts] = useState<CardProductProps[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  const ITEMS_PER_PAGE = 10; // Sesuai dengan backend limit default
  
  // Load initial data
  useEffect(() => {
    const products = searchProducts(searchQuery, brandFilter);
    setAllProducts(products);
    setDisplayedProducts(products.slice(0, ITEMS_PER_PAGE));
    setCurrentPage(1);
  }, [searchQuery, brandFilter]);

  const hasMore = displayedProducts.length < allProducts.length;
  const totalLoaded = displayedProducts.length;
  const totalAvailable = allProducts.length;

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    
    // Simulate loading delay
    setTimeout(() => {
      const nextPage = currentPage + 1;
      const startIndex = (nextPage - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      const newProducts = allProducts.slice(0, endIndex);
      
      setDisplayedProducts(newProducts);
      setCurrentPage(nextPage);
      setIsLoadingMore(false);
    }, 500);
  };

  return (
    <SearchResults
      searchQuery={searchQuery}
      searchResults={displayedProducts}
      errorMessage={null}
      brandFilter={brandFilter}
      hasMore={hasMore}
      onLoadMore={handleLoadMore}
      isLoadingMore={isLoadingMore}
      totalLoaded={totalLoaded}
      totalAvailable={totalAvailable}
    />
  );
};

export default SearchWithPagination;
