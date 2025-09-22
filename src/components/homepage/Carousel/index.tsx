"use client";

import { useCallback, useRef, useEffect, useState } from "react";
import styles from "./Carousel.module.css";
import useCarousel from "./useCarousel";
import Indicator from "./Indicator";
import CarouselItem from "./CarouselItem";

interface CarouselProps {
  items: React.ReactNode[];
  itemsToShow: number;
  interval?: number;
}

const Carousel = ({ items, itemsToShow, interval = 4000 }: CarouselProps) => {
  const { activeIndex, setActiveIndex } = useCarousel(
    items,
    itemsToShow,
    interval
  );
  
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleIndicatorClick = useCallback(
    (index: number) => {
      setActiveIndex(index * itemsToShow);
    },
    [itemsToShow]
  );

  const transformValue = (activeIndex / itemsToShow) * 100;
  
  // Force transition to work
  useEffect(() => {
    if (carouselRef.current) {
      // Remove transition temporarily
      carouselRef.current.style.transition = 'none';
      
      // Force reflow
      carouselRef.current.offsetHeight;
      
      // Add transition back after a small delay
      setTimeout(() => {
        if (carouselRef.current) {
          carouselRef.current.style.transition = 'transform 1s ease-in-out';
        }
      }, 10);
    }
  }, [activeIndex]);
  
  
  
  return (
    <div className={styles.carousel}>
      
      <div
        ref={carouselRef}
        className={styles.carouselItems}
        style={{
          transform: `translateX(-${transformValue}%)`,
        }}
      >
        {items.map((item, index) => (
          <CarouselItem key={index} item={item} itemsToShow={itemsToShow} />
        ))}
      </div>
      {items.length > itemsToShow && (
        <Indicator
          totalItems={items.length}
          itemsToShow={itemsToShow}
          activeIndex={activeIndex}
          onIndicatorClick={handleIndicatorClick}
        />
      )}
    </div>
  );
};

export default Carousel;
