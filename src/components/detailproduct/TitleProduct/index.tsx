import { AiFillStar } from "react-icons/ai";
// import { RatingProps } from "./types";
import { DetailProductType } from "@/types/detailProduct";
import Spinner from "@/components/ui/Spinner";

interface TitleProductProps {
  data: DetailProductType | null | undefined;
  isError: number | string | null;
  isLoading: boolean;
}
const TitleProductSkeleton = () => (
  <div className="flex items-center justify-between p-4 bg-white shadow-sm rounded-lg animate-pulse">
    <div>
      <div className="h-4 w-24 bg-gray-300 rounded mb-2" />
      <div className="h-6 w-40 bg-gray-300 rounded" />
    </div>
    <div className="flex items-center gap-1 bg-orange-100 px-2 py-1 rounded-full">
      <div className="h-6 w-6 bg-gray-300 rounded-full" />
      <div className="h-4 w-8 bg-gray-300 rounded" />
    </div>
  </div>
);

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
    return <div className="text-gray-500">Data produk tidak tersedia.</div>;
  }
  return (
    <div className="flex items-center justify-between p-4 bg-white shadow-sm rounded-lg">
      <div>
        <p className="text-sm text-green-700">Produk : {data.company}</p>
        <h1 className="text-lg font-semibold text-gray-900">{data.name}</h1>
      </div>
      <div className="flex items-center gap-1 bg-orange-100 px-2 py-1 rounded-full">
        <AiFillStar className="text-orange-500" />
        <span className="text-orange-500 font-semibold text-sm">
          {data.avg_rating}
        </span>
      </div>
    </div>
  );
};

export default TitleProduct;
