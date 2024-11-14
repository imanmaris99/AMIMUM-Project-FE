"use client";
import { useState, useEffect } from "react";

interface CarouselProps {
  items: React.ReactNode[];
  itemsToShow: number;
  interval?: number;
}

const Carousel = ({ items, itemsToShow, interval = 4000 }: CarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = prevIndex + itemsToShow;
        if (nextIndex >= items.length) {
          return 0;
        }
        return nextIndex;
      });
    }, interval);

    return () => clearInterval(slideInterval);
  }, [itemsToShow, items.length, interval]);

  const handleIndicatorClick = (index: number) => {
    setCurrentIndex(index * itemsToShow);
  };

  return (
    <div className="carousel">
      <div
        className="carousel-items"
        style={{
          transform: `translateX(-${(currentIndex / itemsToShow) * 100}%)`,
        }}
      >
        {items.map((item, index) => (
          <div key={index} className="carousel-item" style={{ flex: `0 0 ${100 / itemsToShow}%` }}>
            {item}
          </div>
        ))}
      </div>
      {items.length > itemsToShow && (
        <div className="carousel-indicators flex justify-center mt-2">
          {Array.from({ length: Math.ceil(items.length / itemsToShow) }).map(
            (_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full mx-1 mt-2 ${
                  index === Math.floor(currentIndex / itemsToShow)
                    ? "bg-primary"
                    : "bg-gray-300"
                }`}
                onClick={() => handleIndicatorClick(index)}
              />
            )
          )}
        </div>
      )}
    </div>
  );
};

export default Carousel;
