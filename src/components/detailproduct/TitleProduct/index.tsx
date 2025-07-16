import { AiFillStar } from "react-icons/ai";
// import { RatingProps } from "./types";
import { DetailProductType } from "@/types/detailProduct";

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
    return <div>Loading...</div>;
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
