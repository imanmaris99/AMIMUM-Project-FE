"use client";

import { Button } from "@/components/ui/button";
import { DetailProductType, VariantProductType } from "@/types/detailProduct";
import Spinner from "@/components/ui/Spinner";
import ButtonSpinner from "@/components/ui/ButtonSpinner";
import { useState } from "react";
import { getProductRatingSummary } from "@/data/dummyData";
import RatingDisplay from "@/components/rating/RatingDisplay";
import { useCart } from "@/contexts/CartContext";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { SessionManager } from "@/lib/auth";
import LoginRequiredModal from "@/components/common/LoginRequiredModal";

interface ProductPriceProps {
  data: DetailProductType | undefined;
  datavariant: VariantProductType | undefined;
  isError: number;
  isLoading: boolean;
  isSticky?: boolean;
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
  isSticky = false,
}: ProductPriceProps) => {
  const [showFeedback, setShowFeedback] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isBuying, setIsBuying] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { addToCart, isInCart } = useCart();
  const router = useRouter();


  const handleAddToCart = async () => {
    
    if (!data || !datavariant) {
      return;
    }
    
    
    setIsAdding(true);
    
    try {
      // Add to cart using CartContext
      addToCart(data, datavariant);
      
      
      // Show feedback
      setShowFeedback(true);
      setTimeout(() => setShowFeedback(false), 3000);
      
    } catch (error) {
    } finally {
      setIsAdding(false);
    }
  };

  const handleBuyNow = async () => {
    
    if (!data || !datavariant) {
      return;
    }
    
    // Check if user is logged in using SessionManager
    const isLoggedIn = SessionManager.isAuthenticated();
    
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    
    setIsBuying(true);
    
    try {
      // Create temporary cart item for direct checkout
      const tempCartItem = {
        id: Date.now(), // Use number instead of string
        product_id: data.id,
        product_name: data.name,
        product_price: data.price,
        variant_id: datavariant.id,
        quantity: 1,
        is_active: true,
        created_at: new Date().toISOString(),
        variant_info: {
          id: datavariant.id,
          variant: datavariant.variant,
          name: datavariant.variant, // Add required name field
          img: datavariant.img,
          discount: datavariant.discount,
          discounted_price: datavariant.discounted_price
        }
      };
      
      // Store temporary item in localStorage for direct checkout
      localStorage.setItem('directCheckoutItem', JSON.stringify(tempCartItem));
      
      // Navigate to checkout page
      router.push('/order-1?direct=true');
      
    } catch (error) {
    } finally {
      setIsBuying(false);
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
  const originalPrice = hasDiscount ? Math.round(discountedPrice / (1 - discountPercentage / 100)) : (discountedPrice || 0);
  const savings = hasDiscount ? Math.max(0, originalPrice - discountedPrice) : 0;

  return (
    <div className={`${isSticky ? 'shadow-lg' : 'shadow-sm'} bg-white ${isSticky ? 'rounded-none' : 'rounded-lg'}`}>
      <div className={isSticky ? 'p-3' : 'p-4'}>
        {/* Rating Section - Only show in non-sticky mode */}
        {!isSticky && data?.id && (
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
        <div className={isSticky ? "space-y-2" : "flex items-center justify-between"}>
          <div className={isSticky ? "text-center" : "flex-1"}>
            {!isSticky && (
              <p className="text-gray-700 font-semibold text-sm mb-2">Harga Produk :</p>
            )}
            {isSticky && (
              <p className="text-gray-600 text-xs mb-1">Harga Terpilih</p>
            )}
            
            {/* Show price only when variant is selected */}
            {datavariant ? (
              hasDiscount ? (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 justify-center">
                    <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                      -{discountPercentage}%
                    </span>
                    <span className="text-gray-400 line-through text-sm">
                      Rp {originalPrice?.toLocaleString()}
                    </span>
                  </div>
                  <p className={`font-bold text-green-600 ${isSticky ? 'text-lg' : 'text-xl'} text-center`}>
                    Rp {discountedPrice?.toLocaleString()}
                  </p>
                  {!isSticky && (
                    <p className="text-xs text-gray-500">
                      Hemat Rp {savings.toLocaleString()}
                    </p>
                  )}
                </div>
              ) : (
                <div>
                  <p className={`font-bold text-gray-900 ${isSticky ? 'text-lg' : 'text-xl'} ${isSticky ? 'text-center' : ''}`}>
                    Rp {data?.price?.toLocaleString()}
                  </p>
                </div>
              )
            ) : (
              /* Show placeholder when no variant selected */
              <div className="text-center">
                <p className="text-gray-400 text-sm">-</p>
              </div>
            )}
          </div>
          
          <div className={`relative ${isSticky ? '' : 'ml-4'}`}>
            {isSticky ? (
              // Sticky mode - Show both buttons (only when variant is selected)
              <div className="space-y-2">
                <Button 
                  variant="default" 
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  className={`${
                    isItemInCart 
                      ? "bg-green-600 hover:bg-green-700" 
                      : "bg-[#006A47] hover:bg-[#005A3C]"
                  } text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 px-4 py-2 text-sm w-full`}
                >
                  {isAdding ? (
                    <ButtonSpinner size="sm" color="white" text="Menambah..." />
                  ) : isItemInCart ? (
                    "✓ Di Keranjang"
                  ) : (
                    "+ Keranjang"
                  )}
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={handleBuyNow}
                  disabled={isBuying}
                  className="w-full px-4 py-2 text-sm border-primary text-primary hover:bg-primary hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isBuying ? (
                    <ButtonSpinner size="sm" color="primary" text="Memproses..." />
                  ) : (
                    "🚀 Beli Langsung"
                  )}
                </Button>
              </div>
            ) : (
              // Non-sticky mode - Show single button
              <Button 
                variant="default" 
                onClick={handleAddToCart}
                disabled={isAdding || !datavariant}
                className={`${
                  isItemInCart 
                    ? "bg-green-600 hover:bg-green-700" 
                    : !datavariant
                    ? "bg-gray-400 hover:bg-gray-400"
                    : "bg-[#006A47] hover:bg-[#005A3C]"
                } text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 px-4 py-2`}
              >
                {isAdding ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Menambah...</span>
                  </div>
                ) : isItemInCart ? (
                  "✓ Di Keranjang"
                ) : !datavariant ? (
                  "Pilih Varian"
                ) : (
                  "+ Keranjang"
                )}
              </Button>
            )}
            
            {/* User Feedback Toast */}
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

            {/* Login Required Modal */}
            <LoginRequiredModal
              isOpen={showLoginModal}
              onClose={() => setShowLoginModal(false)}
              feature="checkout"
              title="Login Diperlukan untuk Pembelian"
              description="Silakan login terlebih dahulu untuk melanjutkan pembelian dan menyelesaikan checkout dengan aman."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPrice;
