import { FiPackage, FiLayers, FiAlertCircle } from "react-icons/fi";
import { VariantProductType } from "@/types/detailProduct";
import Spinner from "@/components/ui/Spinner";

interface ProductInformationProps {
  datavariant: VariantProductType | undefined;
  isError: number;
  isLoading: boolean;
}

// ProductInformationSkeleton component removed - not used

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

  // Show message if variant is not selected
  if (!datavariant) {
    return (
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 text-center text-gray-500 text-sm">
          <p>Pilih varian produk untuk melihat informasi lengkap</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4 space-y-2 text-gray-500 text-sm">
        <div className="flex items-center space-x-2">
          <FiPackage className="text-gray-500" />
          <span>Isi: 11 sachet | 6 gram/sachet</span>
        </div>
        <div className="flex items-center space-x-2">
          <FiLayers className="text-gray-500" />
          <span>Stock: {datavariant.stock} pack</span>
        </div>
        <div className="flex items-center space-x-2">
          <FiAlertCircle className="text-gray-500" />
          <span>
            Baik dikonsumsi hingga {datavariant.expiration || "Tidak tersedia"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductInformation;
