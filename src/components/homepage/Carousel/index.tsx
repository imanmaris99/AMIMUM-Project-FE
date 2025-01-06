"use client";

import { useCallback } from "react";
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

  const handleIndicatorClick = useCallback(
    (index: number) => {
      setActiveIndex(index * itemsToShow);
    },
    [itemsToShow]
  );

  return (
    <div className={styles.carousel}>
      <div
        className={styles.carouselItems}
        style={{
          transform: `translateX(-${(activeIndex / itemsToShow) * 100}%)`,
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
