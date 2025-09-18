import { Button } from "@/components/ui/button";
import { DetailProductType, VariantType } from "@/types/detailProduct";
import Spinner from "@/components/ui/Spinner";
import { useState } from "react";
import { getProductRatingSummary } from "@/data/dummyData";
import RatingDisplay from "@/components/rating/RatingDisplay";

interface ProductPriceProps {
  data: DetailProductType | undefined;
  datavariant: VariantType | undefined;
  isError: number;
  isLoading: boolean;
}
const ProductPriceSkeleton = () => (
  <div className="p-4 flex items-center justify-between mb-20 animate-pulse">
    <div>
      <div className="h-4 w-32 bg-gray-300 rounded mb-2" />
      <div className="flex items-center mt-1 space-x-2">
        <div className="h-4 w-10 bg-gray-300 rounded" />
        <div className="h-4 w-16 bg-gray-300 rounded" />
      </div>
      <div className="h-6 w-24 bg-gray-300 rounded mt-1" />
    </div>
    <div>
      <div className="h-10 w-32 bg-gray-300 rounded" />
    </div>
  </div>
);

const ProductPrice = ({
  isError,
  isLoading,
  data,
  datavariant,
}: ProductPriceProps) => {
  const [showFeedback, setShowFeedback] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    console.log("🛒 Add to cart clicked");
    console.log("📦 Data:", data);
    console.log("🎯 Variant:", datavariant);
    
    if (!data || !datavariant) {
      console.warn("❌ Missing data or variant");
      return;
    }
    
    setIsAdding(true);
    
    try {
      // TODO: Implement add to cart functionality
      console.log(`✅ Would add to cart: ${data.name} ${datavariant.variant}`);
      
      // Show feedback
      setShowFeedback(true);
      setTimeout(() => setShowFeedback(false), 3000);
      
    } catch (error) {
      console.error("❌ Error adding to cart:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const isItemInCart = false; // TODO: Implement cart check

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[120px]">
        <Spinner className="mb-2" size={32} label="Memuat harga produk..." />
        <p className="text-gray-600 text-sm">Memuat harga produk...</p>
      </div>
    );
  }

  if (isError) {
    switch (isError) {
      case 403:
        return (
          <div>
            Token tidak valid atau pengguna tidak terautentikasi. Silakan coba
            lagi nanti.
          </div>
        );
      case 404:
        return (
          <div>
            Pengguna tidak ditemukan atau tidak memiliki rating produk. Silakan
            coba lagi nanti.
          </div>
        );
      case 409:
        return (
          <div>
            Terjadi konflik saat mengakses data. Silakan coba lagi nanti.
          </div>
        );
      case 500:
        return <div>Terjadi kesalahan server. Silakan coba lagi nanti.</div>;
      default:
        break;
    }
  }
  // Check if variant has discount
  const hasDiscount = datavariant?.discount && datavariant.discount > 0;
  const discountPercentage = datavariant?.discount || 0;
  const discountedPrice = datavariant?.discounted_price || data?.price || 0;
  const originalPrice = hasDiscount ? Math.round(discountedPrice / (1 - discountPercentage / 100)) : (discountedPrice || 0);
  const savings = hasDiscount ? Math.max(0, originalPrice - discountedPrice) : 0;

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4">
        {/* Rating Section */}
        {data?.id && (
          <RatingDisplay
            ratingData={getProductRatingSummary(data.id) || {
              avg_rating: data.avg_rating || 0,
              total_rater: data.total_rater || 0,
              rating_distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
              recent_reviews: []
            }}
            className="mb-4"
          />
        )}

      {/* Price Section */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-700 font-semibold">Harga Produk :</p>
          {hasDiscount ? (
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="bg-red-500 text-white text-sm font-semibold px-2 py-1 rounded">
                  -{discountPercentage}%
                </span>
                <span className="text-gray-400 line-through text-lg">
                  Rp {originalPrice?.toLocaleString()}
                </span>
              </div>
              <p className="text-2xl font-bold text-green-600">
                Rp {discountedPrice?.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">
                Hemat Rp {savings.toLocaleString()}
              </p>
            </div>
          ) : (
            <div>
              <p className="text-2xl font-bold text-gray-900">
                Rp {data?.price?.toLocaleString()}
              </p>
            </div>
          )}
        </div>
        <div className="relative">
          <Button 
            variant="default" 
            onClick={handleAddToCart}
            disabled={isAdding || !datavariant}
            className={`${
              isItemInCart 
                ? "bg-green-600 hover:bg-green-700" 
                : "bg-[#006A47] hover:bg-[#005A3C]"
            } text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200`}
          >
            {isAdding ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Menambah...</span>
              </div>
            ) : isItemInCart ? (
              "✓ Di Keranjang"
            ) : (
              "+ Keranjang"
            )}
          </Button>
          
          {/* User Feedback Toast - Higher up and slightly to the left */}
          {showFeedback && (
            <div className="fixed top-7 left-[49%] transform -translate-x-1/2 bg-primary text-white px-4 py-2 rounded-lg shadow-lg z-50 max-w-[280px] mx-4">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">Ditambahkan ke keranjang!</span>
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
};

export default ProductPrice;
