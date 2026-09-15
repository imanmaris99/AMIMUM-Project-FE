import { FiLayers, FiAlertCircle, FiTag } from "react-icons/fi";
import { VariantProductType } from "@/types/detailProduct";
import Spinner from "@/components/ui/Spinner";

interface ProductInformationProps {
  datavariant: VariantProductType | undefined;
  isError: number;
  isLoading: boolean;
}

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
    return <div>Informasi produk belum dapat dimuat. Silakan coba lagi nanti.</div>;
  }

  if (!datavariant) {
    return (
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 text-center text-gray-500 text-sm">
          <p>Pilih varian produk untuk melihat stok dan masa berlaku dari data katalog.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4 space-y-2 text-gray-500 text-sm">
        <div className="flex items-center space-x-2">
          <FiTag className="text-gray-500" />
          <span>Varian: {datavariant.variant || datavariant.name || "Belum tersedia"}</span>
        </div>
        <div className="flex items-center space-x-2">
          <FiLayers className="text-gray-500" />
          <span>Stok katalog: {typeof datavariant.stock === "number" ? datavariant.stock : "Belum tersedia"}</span>
        </div>
        <div className="flex items-center space-x-2">
          <FiAlertCircle className="text-gray-500" />
          <span>
            Masa berlaku: {datavariant.expiration || "Belum tersedia"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductInformation;
