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
    <div className="p-4 flex items-center justify-between mb-20">
      <div>
        <p className="text-gray-700 font-semibold">Harga Produk :</p>
        <div className="flex items-center mt-1">
          <span className="bg-red-500 text-white text-sm font-semibold px-2 py-0.5 rounded mr-2">
            {datavariant?.discount}%
          </span>
          <span className="text-gray-400 line-through text-sm">
            Rp {data?.price}
          </span>
        </div>
        <p className="text-xl font-bold text-gray-800 mt-1">
          Rp {datavariant?.discounted_price}
        </p>
      </div>
      <div>
        <Button variant="default"> + Keranjang </Button>
      </div>
    </div>
  );
};

export default ProductPrice;
