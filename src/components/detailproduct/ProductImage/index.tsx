"use client";
import Image from "next/image";
import { DetailProductType } from "@/types/detailProduct";

interface ProductImageProps {
  detailProduct?: DetailProductType | null;
}

const ProductImage = ({ detailProduct }: ProductImageProps) => {
  const imageUrl = detailProduct?.variants_list?.[0]?.img || "/buyungupik_agr-1.svg";
  return (
    <div className="w-full h-48 relative bg-gray-50 rounded-lg overflow-hidden shadow-sm">
      <Image 
        src={imageUrl} 
        alt={detailProduct?.name || "Product Image"} 
        fill
        style={{ objectFit: "contain" }}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        priority={false}
        onError={(e) => {
          e.currentTarget.src = "/buyungupik_agr-1.svg";
        }}
      />
    </div>
  );
};

export default ProductImage;
