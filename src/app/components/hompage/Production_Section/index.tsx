"use client";

import { useState } from "react";
import { ProductionCard } from "@/app/components";
import { GoChevronDown } from "react-icons/go";

const Production = () => {
  const [visibleItems, setVisibleItems] = useState(8);
  const productionItems = Array.from({ length: 27 }, (_, index) => (
    <ProductionCard key={index} />
  ));

  const remainingItems = productionItems.length - visibleItems;
  const loadMoreItems = () => {
    setVisibleItems((prevVisibleItems) => prevVisibleItems + 9);
  };

  return (
    <>
      <div className="mx-6 mt-6">
        <h6 className="font-semibold font-jakarta">Produksi oleh</h6>
      </div>

      <div className="mx-6 mt-6 mb-6 grid grid-cols-3 gap-4">
        {productionItems.slice(0, visibleItems)}
        {visibleItems < productionItems.length && (
          <div
            className="flex flex-col justify-center items-center bg-customGreen5 rounded-lg gap-4 p-2"
            onClick={loadMoreItems}
          >
            <div className="flex justify-center items-center bg-white rounded-full w-12 h-12">
              <GoChevronDown size={32} />
            </div>

            <div>
              <button className="text-sm">
                Muat Lainnya ({remainingItems})
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Production;
