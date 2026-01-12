import React from "react";

interface IndicatorProps {
  totalItems: number;
  itemsToShow: number;
  activeIndex: number;
  onIndicatorClick: (index: number) => void;
}

const Indicator: React.FC<IndicatorProps> = ({
  totalItems,
  itemsToShow,
  activeIndex,
  onIndicatorClick,
}) => {
  return (
    <div className="flex justify-center mt-2">
      {Array.from({ length: Math.ceil(totalItems / itemsToShow) }).map(
        (_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full mx-1 mt-2 ${
              index === Math.floor(activeIndex / itemsToShow)
                ? "bg-primary"
                : "bg-gray-300"
            }`}
            onClick={() => onIndicatorClick(index)}
          />
        )
      )}
    </div>
  );
};

export default Indicator; 