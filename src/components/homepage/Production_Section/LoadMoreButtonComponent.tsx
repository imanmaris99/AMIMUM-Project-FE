import React from "react";
import LoadMoreButton from "./LoadMoreButton";
import { ProductionProps } from "./types";

const LoadMoreButtonComponent = ({
  isLoading,
  hasMore,
  filteredProductions,
  limit,
  loadMoreItems,
  remainingRecords,
}: {
  isLoading: boolean;
  hasMore: boolean;
  filteredProductions: ProductionProps[];
  limit: number;
  loadMoreItems: () => void;
  remainingRecords: number;
}) => {
  if (
    !isLoading &&
    hasMore &&
    filteredProductions &&
    filteredProductions.length >= limit
  ) {
    return (
      <LoadMoreButton
        onClick={loadMoreItems}
        remainingItems={remainingRecords}
      />
    );
  }
  return null;
};

export default LoadMoreButtonComponent;
