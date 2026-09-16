import { AiFillStar } from "react-icons/ai";
import { DetailProductType } from "@/types/detailProduct";
import Spinner from "@/components/ui/Spinner";

interface TitleProductProps {
  data: DetailProductType | null | undefined;
  isError: number | string | null;
  isLoading: boolean;
}

const TitleProduct = ({ isError, isLoading, data }: TitleProductProps) => {
  if (isError && typeof isError === "string") {
    return <div className="text-red-500 text-center mt-4">{isError}</div>;
  }
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80px]">
        <Spinner className="mb-2" size={32} label="Memuat judul produk..." />
        <p className="text-gray-600 text-sm">Memuat judul produk...</p>
      </div>
    );
  }
  if (!data) {
    return <div className="text-gray-500">Data produk belum tersedia.</div>;
  }

  const productName = data.name?.trim() || "Produk katalog";
  const brandName = data.company?.trim() || "Brand belum tersedia";
  const rating = Number(data.avg_rating);
  const hasRating = Number.isFinite(rating) && rating > 0;

  return (
    <div className="bg-white shadow-sm rounded-lg">
      <div className="p-4 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-green-700">Brand: {brandName}</p>
          <h1 className="text-lg font-semibold text-gray-900">{productName}</h1>
        </div>
        {hasRating ? (
          <div className="flex items-center gap-1 bg-orange-100 px-2 py-1 rounded-full shrink-0">
            <AiFillStar className="text-orange-500" />
            <span className="text-orange-500 font-semibold text-sm">
              {rating.toFixed(1)}
            </span>
          </div>
        ) : (
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full shrink-0">
            Belum ada rating
          </span>
        )}
      </div>
    </div>
  );
};

export default TitleProduct;
