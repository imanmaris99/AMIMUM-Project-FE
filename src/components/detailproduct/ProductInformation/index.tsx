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
    return null;
  }

  return (
    <div className="rounded-3xl bg-white/95 shadow-[0_8px_22px_rgba(15,23,42,0.08)] backdrop-blur">
      <div className="p-4 space-y-2 text-emerald-800 text-sm">
        <div className="flex items-center space-x-2">
          <FiTag className="text-emerald-600" />
          <span>Varian: {datavariant.variant || datavariant.name || "Belum tersedia"}</span>
        </div>
        <div className="flex items-center space-x-2">
          <FiLayers className="text-emerald-600" />
          <span>Stok katalog: {typeof datavariant.stock === "number" ? datavariant.stock : "Belum tersedia"}</span>
        </div>
        <div className="flex items-center space-x-2">
          <FiAlertCircle className="text-emerald-600" />
          <span>
            Masa berlaku: {datavariant.expiration || "Belum tersedia"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductInformation;
