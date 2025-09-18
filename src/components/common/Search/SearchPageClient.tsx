"use client";

import { useSearchPagination } from '@/hooks/useSearchPagination';
import SearchResults from './SearchResults';

interface SearchPageClientProps {
  searchQuery: string;
  brandFilter?: string;
}

const SearchPageClient = ({ searchQuery, brandFilter }: SearchPageClientProps) => {
  const {
    products,
    isLoading,
    isError,
    errorMessage,
    hasMore,
    loadMore,
    isLoadingMore,
    totalLoaded,
    totalAvailable
  } = useSearchPagination({ 
    searchQuery, 
    brandFilter 
  });

  return (
    <SearchResults
      searchQuery={searchQuery}
      searchResults={products}
      errorMessage={errorMessage}
      brandFilter={brandFilter}
      isLoading={isLoading}
      hasMore={hasMore}
      onLoadMore={loadMore}
      isLoadingMore={isLoadingMore}
      totalLoaded={totalLoaded}
      totalAvailable={totalAvailable}
    />
  );
};

export default SearchPageClient;
