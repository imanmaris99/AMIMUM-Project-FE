import React from "react";
import { ProductionCard } from "@/components";
import { ProductionProps } from "./types";
import LoadMoreButton from "./LoadMoreButton";

interface ProductionListProps {
  productions: ProductionProps[] | undefined;
  visibleItems: number;
  showLoadMoreCard?: boolean;
  onLoadMore?: () => void;
  remainingItems?: number;
}

const ProductionList = ({
  productions,
  visibleItems,
  showLoadMoreCard = false,
  onLoadMore,
  remainingItems = 0,
}: ProductionListProps) => (
  <>
    {productions?.slice(0, visibleItems).map((production, index) => (
      <ProductionCard key={index} production={production} />
    ))}
    {showLoadMoreCard && onLoadMore && (
      <LoadMoreButton onClick={onLoadMore} remainingItems={remainingItems} />
    )}
  </>
);

export default ProductionList;
