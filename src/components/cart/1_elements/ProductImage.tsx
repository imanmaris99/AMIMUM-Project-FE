import React from "react";
import Image from "next/image";

interface ProductImageProps {
  src: string;
}

const ProductImage = ({ src }: ProductImageProps) => {
  return (
    <div className="w-[100px]">
      <Image src={src} alt="" width={100} height={100} />
    </div>
  );
};

export default ProductImage;
