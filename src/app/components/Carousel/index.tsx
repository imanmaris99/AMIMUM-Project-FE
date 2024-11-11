"use client";
import { useState, useEffect } from "react";

interface CarouselProps {
    items: string[];
    itemsToShow: number;
    interval?: number;
}

const Carousel = ({
    items,
    itemsToShow,
    interval = 4000,
}: CarouselProps) => {
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
              className={`w-2 h-2 rounded-full mx-1 mt-2 ${index === Math.floor(currentIndex / itemsToShow) ? 'bg-primary' : 'bg-gray-300'}`}
              onClick={() => setCurrentIndex(index * itemsToShow)}
            />
          ))}
        </div>
      </div>
    );
  };

export default Carousel;
