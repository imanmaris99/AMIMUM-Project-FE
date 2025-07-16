'use client';

import React, { useState } from "react";
import Productions from "./Productions";
import { ProductionProps } from "@/types/apiTypes";

interface ProductionSectionProps {
  productions: ProductionProps[] | null;
  errorMessage?: string | null;
}

const PAGE_SIZE = 8;

const Production = ({ productions, errorMessage }: ProductionSectionProps) => {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  if (errorMessage) {
    return (
      <>
        <div className="mx-6 mt-6">
          <h6 className="font-semibold font-jakarta">Produksi oleh</h6>
        </div>
        <div className="mx-6 mt-6 text-red-500 font-semibold flex justify-center items-center">
          {errorMessage}
        </div>
      </>
    );
  }

  const total = productions?.length ?? 0;
  const hasMore = total > visibleCount;
  const remaining = hasMore ? total - visibleCount : 0;

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, total));
  };

  return (
    <>
      <div className="mx-6 mt-6">
        <h6 className="font-semibold font-jakarta">Produksi oleh</h6>
      </div>

      <div className="mx-6 mt-6 mb-6 grid grid-cols-3 gap-4 justify-items-center">
        {(!productions || productions.length === 0) ? (
          <div className="col-span-3 text-center text-gray-500 font-jakarta text-sm py-8">
            Tidak ada produk yang tersedia untuk kategori ini.
          </div>
        ) : (
          <Productions
            isLoading={!productions}
            productions={productions.slice(0, visibleCount) || []}
            filteredProductions={productions.slice(0, visibleCount) || []}
            showLoadMoreCard={hasMore}
            onLoadMore={handleLoadMore}
            remainingItems={remaining}
          />
        )}
      </div>
    </>
  );
};

export default Production;
