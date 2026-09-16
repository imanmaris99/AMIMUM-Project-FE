'use client';

import React, { useState } from "react";
import Productions from "./Productions";
import { ProductionProps } from "@/types/apiTypes";

interface ProductionSectionProps {
  productions: ProductionProps[] | null;
  errorMessage?: string | null;
  selectedCategoryName?: string | null;
}

const PAGE_SIZE = 8;

const Production = ({ productions, errorMessage, selectedCategoryName }: ProductionSectionProps) => {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  if (errorMessage) {
    return (
      <>
        <div className="mx-6 mt-6">
          <h6 className="font-semibold font-jakarta">Produksi oleh</h6>
        </div>
        <div className="mx-6 mt-4 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-center font-jakarta text-sm text-red-700">
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
          <div className="col-span-3 rounded-lg border border-dashed border-gray-200 bg-white px-4 py-8 text-center font-jakarta text-sm text-gray-600">
            {selectedCategoryName
              ? `Produk kategori ${selectedCategoryName} belum tersedia di katalog toko.`
              : "Produk belum tersedia di katalog toko."}
            <p className="mt-2 text-xs text-gray-500">
              Silakan pilih kategori lain atau hubungi admin jika membutuhkan rekomendasi produk.
            </p>
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

export default React.memo(Production);
