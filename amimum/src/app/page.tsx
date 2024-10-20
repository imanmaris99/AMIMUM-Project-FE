"use client";

import React, { useState, useEffect } from "react";
import Icon from "@/components/Icon";
import Search from "@/components/Search";
import PromoCard from "@/components/PromoCard";

const SimpleCarousel = ({
  items,
  itemsToShow,
  interval = 4000,
}: {
  items: any[];
  itemsToShow: number;
  interval?: number;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + itemsToShow) % items.length);
    }, interval);

    return () => clearInterval(slideInterval);
  }, [itemsToShow, items.length, interval]);
  
  return (
    <div className="carousel">
      <div className="carousel-items" style={{ transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)` }}>
        {items.map((item, index) => (
          <div key={index} className="carousel-item">
            {item}
          </div>
        ))}
      </div>
      <div className="carousel-indicators flex justify-center mt-2">
        {Array.from({ length: Math.ceil(items.length / itemsToShow) }).map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full mx-1 mt-2 ${index === Math.floor(currentIndex / itemsToShow) ? 'bg-customGreen1' : 'bg-gray-300'}`}
            onClick={() => setCurrentIndex(index * itemsToShow)}
          />
        ))}
      </div>
    </div>
  );
};

const Home = () => {
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
  ];

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
          <h6 className="font-semibold font-jakarta">Promo Spesial</h6>
        </div>

        <div className="mx-6 mt-6">
          <SimpleCarousel items={promoItems} itemsToShow={3} />
        </div>
      </section>
    </main>
  );
};

export default Home;
