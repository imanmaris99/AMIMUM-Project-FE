import React from "react";
import { PulseLoader } from "react-spinners";

const LoadingMore = ({ isLoadingMore }: { isLoadingMore: boolean }) => {
  if (isLoadingMore) {
    return (
      <div className="flex justify-center items-center">
        <PulseLoader size={10} color="hsl(var(--primary))" />
      </div>
    );
  }
  return null;
};

export default LoadingMore;
