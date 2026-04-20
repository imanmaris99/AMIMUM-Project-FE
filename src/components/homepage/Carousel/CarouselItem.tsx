import React from "react";
import styles from "./Carousel.module.css";

interface CarouselItemProps {
  item: React.ReactNode;
  itemsToShow: number;
}

const CarouselItem: React.FC<CarouselItemProps> = ({ item, itemsToShow }) => {
  const flexValue = 100 / itemsToShow;
  
  return (
    <div 
      className={styles.carouselItem} 
      style={{ 
        flex: `0 0 ${flexValue}%`,
        minWidth: 0, // Prevent flex item from growing
        maxWidth: `${flexValue}%` // Ensure it doesn't exceed calculated width
      }}
    >
      {item}
    </div>
  );
};

export default CarouselItem; 