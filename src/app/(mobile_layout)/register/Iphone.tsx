import React from "react";

interface IphoneProps {
  className?: string;
  homeIndicatorClassName?: string;
  library?: string;
}

export const Iphone: React.FC<IphoneProps> = ({ 
  className = "", 
  homeIndicatorClassName = ""
}) => {
  return (
    <div className={`relative ${className}`}>
      <div className="w-full h-full bg-black rounded-[40px] p-2">
        <div className="w-full h-full bg-white rounded-[32px] relative overflow-hidden">
          {/* Home indicator */}
          <div className={`absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gray-400 rounded-full ${homeIndicatorClassName}`} />
        </div>
      </div>
    </div>
  );
};
