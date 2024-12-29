"use client";

import Productions from "./Productions";
import LoadMoreButtonComponent from "./LoadMoreButtonComponent";
import LoadingMore from "./LoadingMore";
import useProductionLogic from "./useProductionLogic";

const Production = ({
  selectedCategory,
}: {
  selectedCategory: string | null;
}) => {
  const {
    productions,
    isLoading,
    errorMessage,
    hasMore,
    remainingRecords,
    isLoadingMore,
    loadMoreItems,
    filteredProductions,
  } = useProductionLogic(selectedCategory);

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
        {!isLoading &&
          filteredProductions &&
          filteredProductions.length === 0 && (
            <div className="text-center text-sm">
              Tidak ada merek yang sesuai dengan kategori ini.
            </div>
          )}
      </div>

      <div className="mx-6 mt-6 mb-6 grid grid-cols-3 gap-4 justify-items-center">
        <Productions
          isLoading={isLoading}
          productions={productions}
          filteredProductions={filteredProductions || []}
        />
        <LoadMoreButtonComponent
          isLoading={isLoading}
          hasMore={hasMore}
          filteredProductions={filteredProductions || []}
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
