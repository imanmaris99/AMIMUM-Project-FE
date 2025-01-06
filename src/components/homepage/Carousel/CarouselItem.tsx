import React from "react";
import styles from "./Carousel.module.css";

interface CarouselItemProps {
  item: React.ReactNode;
  itemsToShow: number;
}

const CarouselItem: React.FC<CarouselItemProps> = ({ item, itemsToShow }) => {
  return (
    <div className={styles.carouselItem} style={{ flex: `0 0 ${100 / itemsToShow}%` }}>
      {item}
    </div>
  );
};

export default CarouselItem; 