"use client";

import SearchResults from './SearchResults';
import useSearchPagination from '@/hooks/useSearchPagination';

interface SearchWithPaginationProps {
  searchQuery: string;
  brandFilter?: string;
}

const SearchWithPagination = ({ searchQuery, brandFilter }: SearchWithPaginationProps) => {
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
      errorMessage={isError ? errorMessage : null}
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

export default SearchWithPagination;
