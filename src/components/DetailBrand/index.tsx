import Image from "next/image";
import SkeletonLoader from "./SkeletonLoader";
import { BrandDetailType } from "@/types/detailProduct";

interface DetailBrandProps {
  brandDetail: BrandDetailType | null;
  errorMessage?: string | null;
}

const DetailBrand = ({ brandDetail, errorMessage }: DetailBrandProps) => {
  if (errorMessage) {
    return <div className="text-red-500 text-center mt-4">{errorMessage}</div>;
  }
  if (!brandDetail) {
    return <SkeletonLoader />;
  }
  // Gunakan fallback untuk description dan product_count
  const descriptionArr = Array.isArray(brandDetail.description)
    ? brandDetail.description
    : brandDetail.description_list || [];
  const productCount = brandDetail.product_count ?? brandDetail.total_product_with_promo ?? brandDetail.total_product ?? 0;
  return (
    <div className="mt-4 mx-6">
      <div>
        <h6 className="font-semibold font-jakarta">Produksi Oleh</h6>
      </div>
      <div className="bg-customGreen4 p-4 rounded-lg mt-4 min-h-24 flex items-center">
        <div className="flex items-center gap-4">
          <Image
            src={brandDetail.image_url || brandDetail.photo_url || "/default-image.jpg"}
            alt={brandDetail.name || "brand"}
            width={70}
            height={70}
          />
          <div>
            <h1 className="font-bold">{brandDetail.name || "Brand Name"}</h1>
            <p className="text-xs text-gray-500">{brandDetail.category || "Brand Category"}</p>
          </div>
        </div>
      </div>
      <div className="mt-4">
        {descriptionArr.length > 0 ? (
          descriptionArr.map((desc: string, idx: number) => (
            <p key={idx} className="text-xs px-2 mb-2">{desc}</p>
          ))
        ) : (
          <p className="text-xs px-2">Deskripsi brand belum tersedia.</p>
        )}
      </div>
      <div className="mt-4 pb-4 pt-4 flex flex-col gap-2">
        <div className="flex justify-between border-b border-t border-gray-300 py-3">
          <p className="text-gray-500">Jumlah Produk</p>
          <p>{productCount} Produk</p>
        </div>
      </div>
    </div>
  );
};
export default DetailBrand;
