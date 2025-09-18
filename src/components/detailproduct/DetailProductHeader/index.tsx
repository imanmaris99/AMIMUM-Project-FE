"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { GoChevronLeft } from "react-icons/go";

interface DetailProductHeaderProps {
  title?: string;
  showBackButton?: boolean;
  showQuestionButton?: boolean;
}

const DetailProductHeader: React.FC<DetailProductHeaderProps> = ({
  title = "Detail Item",
  showBackButton = true,
  showQuestionButton = true,
}) => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleQuestion = () => {
    // TODO: Implement help/FAQ functionality
    console.log("Help/FAQ clicked");
  };

  return (
    <div className="flex justify-center items-center relative mt-16 bg-white">
      {/* Back Button */}
      {showBackButton && (
        <div className="absolute left-10">
          <GoChevronLeft className="text-3xl cursor-pointer" onClick={handleBack} />
        </div>
      )}

      {/* Title */}
      <div className="text-center">
        <h1 className="text-[16px] font-semibold">{title}</h1>
      </div>

      {/* Question Button */}
      {showQuestionButton && (
        <div className="absolute right-10">
          <button
            onClick={handleQuestion}
            className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <img
              src="/message-question.svg"
              alt="Help"
              width="20"
              height="20"
              className="text-[#0D0E09]"
            />
          </button>
        </div>
      )}
    </div>
  );
};

export default DetailProductHeader;
