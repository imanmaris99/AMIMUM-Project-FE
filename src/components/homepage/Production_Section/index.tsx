"use client";

import { useState, useEffect } from "react";
import useBrandLoader from "@/hooks/useBrandLoader";
import ProductionCardSkeleton from "@/components/homepage/ProductionCard/ProductionCardSkeleton";
import getFilteredProductions from "@/utils/getFilteredProductions";
import LoadMoreButton from "./LoadMoreButton";
import ProductionList from "./ProductionList";
import { PulseLoader } from "react-spinners";
interface ProductionProps {
  selectedCategory: string | null;
}

const Production = ({ selectedCategory }: ProductionProps) => {
  const [skip, setSkip] = useState(0);
  const limit = 8;

  const {
    data: fetchedData,
    loading: isLoading,
    errorMessage,
    hasMore,
    remainingRecords
  } = useBrandLoader(skip, limit);

  const [productions, setProductions] = useState<any[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    setProductions([]);
  }, []);

  useEffect(() => {
    if (fetchedData.length > 0) {
      setProductions((prev) => [...prev, ...fetchedData]);
    }
  }, [fetchedData]);

  const loadMoreItems = () => {
    setIsLoadingMore(true);
    setSkip((prevSkip) => prevSkip + limit);
  };

  useEffect(() => {
    if (!isLoading && isLoadingMore) {
      setIsLoadingMore(false);
    }
  }, [isLoading, isLoadingMore]);

  const filteredProductions = getFilteredProductions(productions, selectedCategory);

  if (errorMessage) {
    return (
      <>
        <div className="mx-6 mt-6">
          <h6 className="font-semibold font-jakarta">Produksi oleh</h6>
        </div>
        <div className="mx-6 mt-6 text-red-500 font-semibold">
          {errorMessage}
        </div>
      </>
    );
  }

  return (
    <>
      <div className="mx-6 mt-6">
        <h6 className="font-semibold font-jakarta">Produksi oleh</h6>
      </div>

      <div className="mx-6 mt-6 mb-6 text-gray-500">
        {!isLoading && filteredProductions && filteredProductions.length === 0 && (
          <div className="text-center text-sm">
            Tidak ada merek yang sesuai dengan kategori ini.
          </div>
        )}
      </div>

      <div className="mx-6 mt-6 mb-6 grid grid-cols-3 gap-4 justify-items-center">
        {isLoading && productions.length === 0 ? (
          [...Array(9)].map((_, index) => (
            <ProductionCardSkeleton key={index} />
          ))
        ) : (
          <ProductionList
            productions={filteredProductions}
            visibleItems={filteredProductions?.length ?? 0} 
          />
        )}

        {!isLoading && hasMore && filteredProductions && filteredProductions.length >= limit && (
          <LoadMoreButton
            onClick={loadMoreItems}
            remainingItems={remainingRecords}
          />
        )}

        {isLoadingMore && (
          <div className="flex justify-center items-center">
            <PulseLoader size={10} color="hsl(var(--primary))" />
          </div>
        )}
      </div>
    </>
  );
};

export default Production;
