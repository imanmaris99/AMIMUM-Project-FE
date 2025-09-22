"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface OrderHeaderProps {
  title?: string;
  showBackButton?: boolean;
  showFavouriteButton?: boolean;
}

const OrderHeader: React.FC<OrderHeaderProps> = ({
  title = "Home",
  showBackButton = true,
  showFavouriteButton = true,
}) => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleFavourite = () => {
    // Navigate to wishlist
    router.push("/wishlist");
  };

  return (
    <div className="flex items-center justify-between px-6 py-4">
      {/* Back Button */}
      {showBackButton && (
        <button
          onClick={handleBack}
          className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 18L9 12L15 6"
              stroke="#2A2A2A"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}

      {/* Title */}
      <h1 className="text-[#242424] text-lg font-medium flex-1 text-center">
        {title}
      </h1>

      {/* Favourite Button */}
      {showFavouriteButton && (
        <button
          onClick={handleFavourite}
          className="w-11 h-11 flex items-center justify-center hover:bg-gray-100 rounded-xl transition-colors"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20.84 4.61C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.5783 8.50903 2.9987 7.05 2.9987C5.59096 2.9987 4.19169 3.5783 3.16 4.61C2.1283 5.6417 1.5487 7.04097 1.5487 8.5C1.5487 9.95903 2.1283 11.3583 3.16 12.39L12 21.23L20.84 12.39C21.351 11.8792 21.7563 11.2728 22.0329 10.6053C22.3095 9.93789 22.4518 9.22248 22.4518 8.5C22.4518 7.77752 22.3095 7.06211 22.0329 6.39467C21.7563 5.72723 21.351 5.1208 20.84 4.61Z"
              stroke="#2A2A2A"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default OrderHeader;
