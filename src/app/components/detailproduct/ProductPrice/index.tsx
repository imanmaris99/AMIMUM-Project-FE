import { Button } from "@/components/ui/button";
import { DetailProductType, VariantType } from "@/types/detailProduct";

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
const ProductPrice = ({
  isError,
  isLoading,
  data,
  datavariant,
}: ProductPriceProps) => {
  if (isLoading) {
    return <div>Loading...</div>;
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
