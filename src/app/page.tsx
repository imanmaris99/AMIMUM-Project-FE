"use client";

import { Search, AccordionExpandDefault, Carousel, ProductionCard, PromoCard, Tag } from "./components";
import { useState } from "react";
import { IoBagOutline } from "react-icons/io5";
import { IoNotificationsOutline } from "react-icons/io5";
import { GoChevronDown } from "react-icons/go";

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [visibleItems, setVisibleItems] = useState(8);

  const promoItems = Array.from({ length: 12 }, (_, index) => <PromoCard key={index} />);
  const categories = Array.from({ length: 5 }, (_, index) => `Kategori ${index + 1}`);
  const productionItems = Array.from({ length: 27 }, (_, index) => <ProductionCard key={index} />);
  const remainingItems = productionItems.length - visibleItems;

  const loadMoreItems = () => {
    setVisibleItems((prevVisibleItems) => prevVisibleItems + 9);
  };

  return (
    <main className="pb-20">
      {/* Header */}
      <header>
        <div className="flex justify-between items-center mt-14 mx-6">
          <div className="flex flex-col justify-center gap-2">
            <p>Selamat Datang,</p>
            <h4 className="font-bold text-xl font-jakarta">Nama User</h4>
          </div>

          <div className="flex justify-center items-center gap-3">
            <IoBagOutline size={32} />
            <IoNotificationsOutline size={32} />
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
            <Tag
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
      </section>

      {/* FAQ Section */}
      <section>
        <div className="mx-6 mt-6">
          <h6 className="font-semibold font-jakarta">FAQ</h6>
        </div>

        <div className="mx-6 mt-6 flex flex-col gap-2">
          {Array.from({ length: 4 }, (_, index) => (
            <AccordionExpandDefault
              key={index}
              title="Tentang aplikasi AmImUm herbal"
              content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget."
            />
          ))}
        </div>

        <div className="mx-6 mt-6 flex justify-center items-center">
          <p className="text-sm">
            ©2024 <span className="text-gray-500">by</span>{" "}
            <span className="font-bold text-primary">AmImUm Team</span>.
          </p>
        </div>
      </section>
    </main>
  );
};

export default Home;
