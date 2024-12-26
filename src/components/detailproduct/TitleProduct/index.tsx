import { AiFillStar } from "react-icons/ai";
// import { RatingProps } from "./types";
import { DetailProductType } from "@/types/detailProduct";

interface TitleProductProps {
  data: DetailProductType | undefined;
  isError: number;
  isLoading: boolean;
}
const TitleProduct = ({ isError, isLoading, data }: TitleProductProps) => {
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
        <div>Terjadi konflik saat mengakses data. Silakan coba lagi nanti.</div>
      );
    case 500:
      return <div>Terjadi kesalahan server. Silakan coba lagi nanti.</div>;
    default:
      break;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // const averageRating =
  //   ratings?.reduce(
  //     (acc: number, rating: RatingProps) => acc + rating.rate,
  //     0
  //   ) / ratings?.length || 0;

  return (
    <div className="flex items-center justify-between p-4 bg-white shadow-sm rounded-lg">
      <div>
        <p className="text-sm text-green-700">Produk : {data?.company}</p>
        <h1 className="text-lg font-semibold text-gray-900">{data?.name}</h1>
      </div>
      <div className="flex items-center gap-1 bg-orange-100 px-2 py-1 rounded-full">
        <AiFillStar className="text-orange-500" />
        <span className="text-orange-500 font-semibold text-sm">
          {/* {averageRating.toFixed(1)} */}
          {data?.avg_rating}
        </span>
      </div>
    </div>
  );
};

export default TitleProduct;
