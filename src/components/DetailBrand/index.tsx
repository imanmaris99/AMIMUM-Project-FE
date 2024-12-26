import Image from "next/image";
import { useBrandDetailById } from "@/hooks/useBrandDetailById";
import SkeletonLoader from "./SkeletonLoader";

const DetailBrand = ({ brandDetailId }: { brandDetailId: number }) => {
  const { brandDetailById, isLoading } = useBrandDetailById(brandDetailId);
  if (isLoading) return <SkeletonLoader />;
  return (
    <div className="mt-4 mx-6">
      <div>
        <h6 className="font-semibold font-jakarta">Produksi Oleh</h6>
      </div>
      <div className="bg-customGreen4 p-4 rounded-lg mt-4 min-h-24 flex items-center">
        <div className="flex items-center gap-4">
          <Image
            src={brandDetailById?.photo_url || "/default-image.jpg"}
            alt="brand"
            width={70}
            height={70}
          />
          <div>
            <h1 className="font-bold">
              {brandDetailById?.name || "Brand Name"}
            </h1>
            <p className="text-xs text-gray-500">
              {brandDetailById?.category || "Brand Category"}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <p
          className="text-xs px-2"
          dangerouslySetInnerHTML={{
            __html: brandDetailById?.description_list?.join("<br><br>"),
          }}
        />
      </div>
      <div className="mt-4 pb-4 pt-4 flex flex-col gap-2">
        <div className="flex justify-between border-b border-t border-gray-300 py-3">
          <p className="text-gray-500">Jumlah Produk</p>
          <p>{brandDetailById?.total_product} Produk</p>
        </div>
      </div>
    </div>
  );
};
export default DetailBrand;
