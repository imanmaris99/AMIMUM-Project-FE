import { useState, useEffect } from "react";

const useCarousel = (items: React.ReactNode[], itemsToShow: number, interval: number) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    
    const slideInterval = setInterval(() => {
      setActiveIndex((prevIndex) => {
        const nextIndex = prevIndex + itemsToShow;
        return nextIndex >= items.length ? 0 : nextIndex;
      });
    }, interval);

    return () => clearInterval(slideInterval);
  }, [itemsToShow, items.length, interval, isMounted]);

  return { activeIndex, setActiveIndex };
};

export default useCarousel; 