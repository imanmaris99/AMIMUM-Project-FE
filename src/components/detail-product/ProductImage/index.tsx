"use client";
import Image from "next/image";
import { DetailProductType } from "@/types/detailProduct";
import { useMemo, useState } from "react";

interface ProductImageProps {
  detailProduct?: DetailProductType | null;
}

const ProductImage = ({ detailProduct }: ProductImageProps) => {
  const [imageError, setImageError] = useState(false);
  const imageUrl = detailProduct?.variants_list?.[0]?.img || "/buyungupik_agr-1.svg";

  const handleImageError = () => {
    setImageError(true);
  };

  // Check if URL is external (http/https) - simple string check
  // Use regular img tag for ALL external images to prevent Next.js Image optimizer retry loops
  const isExternalUrl = useMemo(() => {
    if (!imageUrl || imageError || imageUrl.startsWith('/')) {
      return false; // Use Next.js Image for local images
    }
    
    // Simple check: if URL starts with http:// or https://, it's external
    const url = imageUrl.trim();
    return url.startsWith('http://') || url.startsWith('https://');
  }, [imageUrl, imageError]);

  return (
    <div className="w-full h-48 relative bg-gray-50 rounded-lg overflow-hidden shadow-sm">
      {!isExternalUrl ? (
        // Use Next.js Image ONLY for local images (no server-side fetch issues)
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
          unoptimized
        />
      ) : (
        // Use regular img tag for ALL external images (http/https) to prevent Next.js Image optimizer retry loops
        // This completely avoids server-side fetch attempts that cause infinite retry loops
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt={detailProduct?.name || "Product Image"}
          style={{ 
            width: "100%", 
            height: "100%", 
            objectFit: "contain" 
          }}
          onError={handleImageError}
          loading="lazy"
        />
      )}
    </div>
  );
};

export default ProductImage;
