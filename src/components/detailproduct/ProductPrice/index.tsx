import { Button } from "@/components/ui/button";
import { DetailProductType, VariantType } from "@/types/detailProduct";
import Spinner from "@/components/ui/Spinner";

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
  return (
    <div className="p-4 mb-20">
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
          <p className="text-gray-700 font-semibold mb-2">Harga Produk :</p>
          <div className="flex items-center gap-3">
            <span className="bg-red-500 text-white text-sm font-semibold px-2 py-1 rounded">
              -{datavariant?.discount}%
            </span>
            <span className="text-gray-400 line-through text-lg">
              Rp {data?.price?.toLocaleString()}
            </span>
          </div>
          <p className="text-2xl font-bold text-green-600 mt-1">
            Rp {datavariant?.discounted_price?.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Hemat Rp {(data?.price - (datavariant?.discounted_price || 0)).toLocaleString()}
          </p>
        </div>
        <div>
          <Button variant="default" className="bg-[#006A47] hover:bg-[#005A3C] text-white">
            + Keranjang
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductPrice;
