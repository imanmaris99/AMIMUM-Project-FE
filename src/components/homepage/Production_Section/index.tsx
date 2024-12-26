"use client";

import { useState } from "react";
import useBrandLoader from "@/hooks/useBrandLoader";
import ProductionCardSkeleton from "@/components/homepage/ProductionCard/ProductionCardSkeleton";
import getFilteredProductions from "@/utils/getFilteredProductions";
import LoadMoreButton from "./LoadMoreButton";
import ProductionList from "./ProductionList";

const Production = ({ selectedCategory }: { selectedCategory: string | null }) => {
  const { data: productions, loading: isLoading, errorMessage } = useBrandLoader();
  const [visibleItems, setVisibleItems] = useState(5);

  const filteredProductions = getFilteredProductions(productions || [], selectedCategory);

  const loadMoreItems = () => {
    setVisibleItems((prevVisibleItems) => prevVisibleItems + 6);
  };

  if (errorMessage) {
    return (
      <>
        <div className="mx-6 mt-6">
          <h6 className="font-semibold font-jakarta">Produksi oleh</h6>
        </div>
        <div className="mx-6 mt-6 text-red-500 font-semibold">{errorMessage}</div>
      </>
    );
  }

  return (
    <>
      <div className="mx-6 mt-6">
        <h6 className="font-semibold font-jakarta">Produksi oleh</h6>
      </div>

      <div className="mx-6 mt-6 mb-6 text-gray-500">{!isLoading && filteredProductions?.length === 0 && <div className="text-center text-sm">Tidak ada produksi yang sesuai dengan kategori ini.</div>}</div>

      <div className="mx-6 mt-6 mb-6 grid grid-cols-3 gap-4 justify-items-center">
        {isLoading ? [...Array(9)].map((_, index) => <ProductionCardSkeleton key={index} />) : <ProductionList productions={filteredProductions} visibleItems={visibleItems} />}
        {productions && productions.length > 6 && visibleItems < productions.length && <LoadMoreButton onClick={loadMoreItems} remainingItems={filteredProductions ? filteredProductions.length - visibleItems : 0} />}
      </div>
    </>
  );
};

export default Production;
