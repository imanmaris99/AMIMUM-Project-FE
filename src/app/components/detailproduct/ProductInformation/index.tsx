import { FiPackage, FiLayers, FiAlertCircle } from "react-icons/fi";
import { VariantType } from "@/types/detailProduct";

interface ProductInformationProps {
  data: VariantType | undefined;
  isError: number;
  isLoading: boolean;
}

const ProductInformation = ({
  isError,
  isLoading,
  data,
}: ProductInformationProps) => {
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
    <div className="mt-2 mx-4">
      <div className="space-y-2 text-gray-500 text-sm">
        <div className="flex items-center space-x-2">
          <FiPackage className="text-gray-500" />
          <span>Isi: 11 sachet | 6 gram/sachet</span>
        </div>
        <div className="flex items-center space-x-2">
          <FiLayers className="text-gray-500" />
          <span>Stock: {data?.stock} pack</span>
        </div>
        <div className="flex items-center space-x-2">
          <FiAlertCircle className="text-gray-500" />
          <span>Baik dikonsumsi hingga {data?.expiration}</span>
        </div>
      </div>
      <hr className="mt-4" />
    </div>
  );
};

export default ProductInformation;
