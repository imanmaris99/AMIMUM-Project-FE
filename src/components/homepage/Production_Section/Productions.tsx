import React from "react";
import ProductionCardSkeleton from "@/components/homepage/ProductionCard/ProductionCardSkeleton";
import ProductionList from "./ProductionList";
import { ProductionProps } from "./types";

const Productions = ({
  isLoading,
  productions,
  filteredProductions,
}: {
  isLoading: boolean;
  productions: ProductionProps[];
  filteredProductions: ProductionProps[];
}) => {
  if (isLoading && productions.length === 0) {
    return [...Array(9)].map((_, index) => (
      <ProductionCardSkeleton key={index} />
    ));
  }
  return (
    <ProductionList
      productions={filteredProductions}
      visibleItems={productions?.length ?? 0}
    />
  );
};

export default Productions;
