import React from "react";
import ProductionCardSkeleton from "@/components/homepage/ProductionCard/ProductionCardSkeleton";
import ProductionList from "./ProductionList";
import { ProductionProps } from "./types";

interface ProductionsProps {
  isLoading: boolean;
  productions: ProductionProps[];
  filteredProductions: ProductionProps[];
  showLoadMoreCard?: boolean;
  onLoadMore?: () => void;
  remainingItems?: number;
}

const Productions = ({
  isLoading,
  productions,
  filteredProductions,
  showLoadMoreCard = false,
  onLoadMore,
  remainingItems = 0,
}: ProductionsProps) => {
  if (isLoading && productions.length === 0) {
    return [...Array(9)].map((_, index) => (
      <ProductionCardSkeleton key={index} />
    ));
  }
  return (
    <ProductionList
      productions={filteredProductions}
      visibleItems={productions?.length ?? 0}
      showLoadMoreCard={showLoadMoreCard}
      onLoadMore={onLoadMore}
      remainingItems={remainingItems}
    />
  );
};

export default React.memo(Productions);
