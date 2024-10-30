"use client";

import Icon from "@/components/Icon";
import Search from "@/components/Search";
import Carousel from "@/components/Carousel";
import PromoCard from "@/components/PromoCard";
import Label from "@/components/Label";
import ProductionCard from "@/components/ProductionCard";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Accordion, AccordionItem } from "@nextui-org/react";

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [visibleItems, setVisibleItems] = useState(8);

  const promoItems = [
    <PromoCard />,
    <PromoCard />,
    <PromoCard />,
    <PromoCard />,
    <PromoCard />,
    <PromoCard />,
    <PromoCard />,
    <PromoCard />,
    <PromoCard />,
    <PromoCard />,
    <PromoCard />,
    <PromoCard />,
  ];

  const categories = [
    "Kategori 1",
    "Kategori 2",
    "Kategori 3",
    "Kategori 4",
    "Kategori 5",
  ];

  const productionItems = [
    <ProductionCard />,
    <ProductionCard />,
    <ProductionCard />,
    <ProductionCard />,
    <ProductionCard />,
    <ProductionCard />,
    <ProductionCard />,
    <ProductionCard />,
    <ProductionCard />,
    <ProductionCard />,
    <ProductionCard />,
    <ProductionCard />,
    <ProductionCard />,
    <ProductionCard />,
    <ProductionCard />,
    <ProductionCard />,
    <ProductionCard />,
    <ProductionCard />,
  ];

  const remainingItems = productionItems.length - visibleItems;

  const loadMoreItems = () => {
    setVisibleItems((prevVisibleItems) => prevVisibleItems + 9);
  };

  return (
    <main>
      {/* Header */}
      <header>
        <div className="flex justify-between items-center mt-14 mx-6">
          <div className="flex flex-col justify-center gap-2">
            <p>Selamat Datang,</p>
            <h4 className="font-bold text-xl font-jakarta">Nama User</h4>
          </div>

          <div className="flex justify-center items-center gap-3">
            <Icon icon="bag2" />
            <Icon icon="notification" />
          </div>
        </div>

        <div className="mx-6 mt-6">
          <Search />
        </div>
      </header>

      {/* Promo Section */}
      <section>
        <div className="mx-6 mt-6">
          <h6 className="font-semibold font-jakarta">Promo spesial</h6>
        </div>

        <div className="mx-6 mt-6">
          <Carousel items={promoItems} itemsToShow={3} />
        </div>
      </section>

      {/* Kategori Section */}
      <section>
        <div className="mx-6 mt-6">
          <h6 className="font-semibold font-jakarta">Kategori</h6>
        </div>

        <div className="mx-6 mt-6 flex gap-2 overflow-x-auto hide-scrollbar whitespace-nowrap">
          {categories.map((category, index) => (
            <Label
              key={index}
              title={category}
              isSelected={selectedCategory === category}
              onClick={() => setSelectedCategory(category)}
            />
          ))}
        </div>
      </section>

      {/* Produksi Section */}
      <section>
        <div className="mx-6 mt-6">
          <h6 className="font-semibold font-jakarta">Produksi oleh</h6>
        </div>

        <div className="mx-6 mt-6 mb-6 grid grid-cols-3 gap-4">
          {productionItems.slice(0, visibleItems).map((_, index) => (
            <ProductionCard key={index} />
          ))}
          {visibleItems < productionItems.length && (
            <div
              className="flex flex-col justify-center items-center bg-customGreen5 rounded-lg gap-4 p-2"
              onClick={loadMoreItems}
            >
              <div className="flex justify-center items-center bg-white rounded-full w-12 h-12">
                <Icon icon="arrowDown" />
              </div>

              <div>
                <button className="text-sm">
                  Muat Lainnya ({remainingItems})
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Home;
