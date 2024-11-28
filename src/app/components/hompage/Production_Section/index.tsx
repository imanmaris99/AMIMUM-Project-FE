"use client";

import { useState } from "react";
import { ProductionCard } from "@/app/components";
import { GoChevronDown } from "react-icons/go";
import { useProductions } from "@/app/hooks/useProductions";
import { ProductionProps } from "@/app/components/hompage/ProductionCard/types";
import ProductionCardSkeleton from "@/app/components/hompage/ProductionCard/ProductionCardSkeleton";

const Production = () => {
  const { productions, isLoading, isError } = useProductions();
  const [visibleItems, setVisibleItems] = useState(8);

  const loadMoreItems = () => {
    setVisibleItems((prevVisibleItems) => prevVisibleItems + 9);
  };

  switch (isError) {
    case 404:
      return <div>Data tidak ditemukan. Silakan coba lagi nanti.</div>;
    case 409:
      return <div>Terjadi konflik data. Silakan coba lagi nanti.</div>;
    case 500:
      return <div>Terjadi kesalahan server. Silakan coba lagi nanti.</div>;
    default:
      break;
  }

  return (
    <>
      <div className="mx-6 mt-6">
        <h6 className="font-semibold font-jakarta">Produksi oleh</h6>
      </div>

      <div className="mx-6 mt-6 mb-6 grid grid-cols-3 gap-4">
        {isLoading ? (
          [...Array(9)].map((_, index) => <ProductionCardSkeleton key={index} />)
        ) : (
          productions?.slice(0, visibleItems).map((production: ProductionProps, index: number) => (
            <ProductionCard key={index} production={production} />
          ))
        )}
        {productions && productions.length > 9 && visibleItems < productions.length && (
          <div
            className="flex flex-col justify-center items-center bg-customGreen5 rounded-lg gap-4 p-2"
            onClick={loadMoreItems}
          >
            <div className="flex justify-center items-center bg-white rounded-full w-12 h-12">
              <GoChevronDown size={32} />
            </div>

            <div>
              <button className="text-sm">
                Muat Lainnya ({productions.length - visibleItems})
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Production;
