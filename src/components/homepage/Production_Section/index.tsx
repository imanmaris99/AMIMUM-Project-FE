"use client";

import Productions from "./Productions";
import LoadMoreButtonComponent from "./LoadMoreButtonComponent";
import LoadingMore from "./LoadingMore";
import useProductionLogic from "./useProductionLogic";
import { ProductionProps } from "@/types/apiTypes";
import PulseLoader from "react-spinners/PulseLoader";

const Production = ({
  selectedCategory,
}: {
  selectedCategory: number | null;
}) => {
  const {
    productions,
    isLoading,
    hasMore,
    remainingRecords,
    isLoadingMore,
    loadMoreItems,
    filteredProductions,
    showError,
    showLoading,
    filteredErrorMessage,
  } = useProductionLogic(selectedCategory);

  if (showError) {
    return (
      <>
        <div className="mx-6 mt-6">
          <h6 className="font-semibold font-jakarta">Produksi oleh</h6>
        </div>
        <div className="mx-6 mt-6 text-gray-500 text-sm flex justify-center items-center">
          {filteredErrorMessage}
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
        {showLoading ? (
          <div className="text-center text-sm">
            <PulseLoader color="hsl(var(--primary))" size={10} />
          </div>
        ) : null}
      </div>

      <div className="mx-6 mt-6 mb-6 grid grid-cols-3 gap-4 justify-items-center">
        <Productions
          isLoading={isLoading}
          productions={productions}
          filteredProductions={filteredProductions as ProductionProps[]}
        />
        <LoadMoreButtonComponent
          isLoading={isLoading}
          hasMore={hasMore}
          filteredProductions={filteredProductions as ProductionProps[]}
          limit={8}
          loadMoreItems={loadMoreItems}
          remainingRecords={remainingRecords}
        />
        <LoadingMore isLoadingMore={isLoadingMore} />
      </div>
    </>
  );
};

export default Production;
