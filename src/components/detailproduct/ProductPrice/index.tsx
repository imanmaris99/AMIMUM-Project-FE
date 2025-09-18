import { Button } from "@/components/ui/button";
import { DetailProductType, VariantType } from "@/types/detailProduct";
import Spinner from "@/components/ui/Spinner";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";

interface ProductPriceProps {
  data: DetailProductType | undefined;
  isError: number;
  isLoading: boolean;
}

interface ProductPriceProps {
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
  const { addToCart, isInCart } = useCart();
  const [showFeedback, setShowFeedback] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    if (!data || !datavariant) return;
    
    setIsAdding(true);
    
    try {
      // Convert DetailProductType to format expected by CartContext
      const productForCart = {
        id: data.id,
        name: data.name,
        price: data.price,
        image_url: datavariant.img || "/buyungupik_agr-1.svg",
        brand_info: { name: data.company }
      };
      
      // Convert VariantType to format expected by CartContext
      const variantForCart = {
        id: datavariant.id,
        variant: datavariant.variant || datavariant.name,
        name: datavariant.name,
        img: datavariant.img,
        discount: datavariant.discount || 0
      };
      
      addToCart(productForCart, variantForCart);
      
      // Show feedback
      setShowFeedback(true);
      setTimeout(() => setShowFeedback(false), 3000);
      
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setIsAdding(false);
    }
  };

  // Check if item is already in cart
  const isItemInCart = data && datavariant ? isInCart(data.id, datavariant.id) : false;

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
  const originalPrice = hasDiscount ? Math.round(discountedPrice / (1 - discountPercentage / 100)) : discountedPrice;
  const savings = hasDiscount ? (originalPrice || 0) - discountedPrice : 0;

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4">
        {/* Rating Section */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg
              key={star}
              className={`w-4 h-4 ${
                star <= Math.floor(data?.avg_rating || 0)
                  ? "text-yellow-400"
                  : "text-gray-300"
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <span className="text-sm text-gray-600">
          {data?.avg_rating?.toFixed(1)} ({data?.total_rater} ulasan)
        </span>
      </div>

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
