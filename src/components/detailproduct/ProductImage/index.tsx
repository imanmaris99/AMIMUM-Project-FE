"use client";
import Image from "next/image";
import { DetailProductType } from "@/types/detailProduct";

interface ProductImageProps {
  detailProduct?: DetailProductType | null;
}

const ProductImage = ({ detailProduct }: ProductImageProps) => {
  const imageUrl = detailProduct?.image_url || "/default-image.jpg";
  return (
    <div className="w-full h-64 relative">
      <Image src={imageUrl} alt={detailProduct?.name || "Product Image"} layout="fill" objectFit="cover" />
    </div>
  );
};

export default ProductImage;
