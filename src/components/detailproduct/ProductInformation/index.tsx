import { FiPackage, FiLayers, FiAlertCircle } from "react-icons/fi";
import { VariantType } from "@/types/detailProduct";
import Spinner from "@/components/ui/Spinner";

interface ProductInformationProps {
  datavariant: VariantType | undefined;
  isError: number;
  isLoading: boolean;
}

const ProductInformationSkeleton = () => (
  <div className="mt-2 mx-4 animate-pulse">
    <div className="space-y-2 text-gray-500 text-sm">
      <div className="flex items-center space-x-2">
        <div className="w-5 h-5 bg-gray-300 rounded-full" />
        <div className="h-4 w-32 bg-gray-300 rounded" />
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-5 h-5 bg-gray-300 rounded-full" />
        <div className="h-4 w-24 bg-gray-300 rounded" />
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-5 h-5 bg-gray-300 rounded-full" />
        <div className="h-4 w-40 bg-gray-300 rounded" />
      </div>
    </div>
    <hr className="mt-4" />
  </div>
);

const ProductInformation = ({
  isError,
  isLoading,
  datavariant,
}: ProductInformationProps) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[120px]">
        <Spinner className="mb-2" size={32} label="Memuat informasi produk..." />
        <p className="text-gray-600 text-sm">Memuat informasi produk...</p>
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
    <div className="mt-2 mx-4">
      <div className="space-y-2 text-gray-500 text-sm">
        <div className="flex items-center space-x-2">
          <FiPackage className="text-gray-500" />
          <span>Isi: 11 sachet | 6 gram/sachet</span>
        </div>
        <div className="flex items-center space-x-2">
          <FiLayers className="text-gray-500" />
          <span>Stock: {datavariant?.stock} pack</span>
        </div>
        <div className="flex items-center space-x-2">
          <FiAlertCircle className="text-gray-500" />
          <span>Baik dikonsumsi hingga {datavariant?.expiration}</span>
        </div>
      </div>
      <hr className="mt-4" />
    </div>
  );
};

export default ProductInformation;
