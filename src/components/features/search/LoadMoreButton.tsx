"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface LoadMoreButtonProps {
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  totalLoaded: number;
  totalAvailable?: number;
}

const LoadMoreButton = ({ 
  isLoading, 
  hasMore, 
  onLoadMore, 
  totalLoaded, 
  totalAvailable 
}: LoadMoreButtonProps) => {
  if (!hasMore) return null;

  return (
    <div className="flex flex-col items-center gap-4 py-6">
      <div className="text-sm text-gray-600 text-center">
        Menampilkan {totalLoaded} dari {totalAvailable || "banyak"} produk
      </div>
      
      <Button
        onClick={onLoadMore}
        disabled={isLoading}
        variant="outline"
        className="w-full max-w-xs"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Memuat...
          </>
        ) : (
          "Muat Lainnya"
        )}
      </Button>
    </div>
  );
};

export default LoadMoreButton;
