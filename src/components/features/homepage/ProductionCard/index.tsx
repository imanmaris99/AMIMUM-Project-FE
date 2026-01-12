"use client";

import Image from "next/image";
import { ProductionProps } from "./types";
import styles from "./ProductionCard.module.css";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";

const ProductionCard = ({ production }: { production: ProductionProps }) => {
  const router = useRouter();
  const [imageError, setImageError] = useState(false);

  const handleCardClick = () => {
    router.push(`/brand/${production.id}`);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  // Check if URL is external (http/https) - simple string check
  // Use regular img tag for ALL external images to prevent Next.js Image optimizer retry loops
  const isExternalUrl = useMemo(() => {
    if (!production.photo_url || imageError) {
      return false; // Use fallback (local image)
    }
    
    // Simple check: if URL starts with http:// or https://, it's external
    const url = production.photo_url.trim();
    return url.startsWith('http://') || url.startsWith('https://');
  }, [production.photo_url, imageError]);

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-lg h-36 flex flex-col items-center justify-center w-24 shadow-md cursor-pointer"
    >
      <div className="bg-gray-100 rounded-lg px-3 py-2 flex flex-col justify-center items-center w-20 h-20">
        {!isExternalUrl ? (
          // Use Next.js Image ONLY for local images (no server-side fetch issues)
          <Image
            src="/default-image.jpg"
            alt={production.name}
            width={50}
            height={50}
            style={{ width: "auto", height: "auto" }}
            className="object-contain"
            unoptimized
            priority={false}
          />
        ) : (
          // Use regular img tag for ALL external images (http/https) to prevent Next.js Image optimizer retry loops
          // This completely avoids server-side fetch attempts that cause infinite retry loops
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={production.photo_url || "/default-image.jpg"}
            alt={production.name}
            width={50}
            height={50}
            style={{ width: "auto", height: "auto", maxWidth: "50px", maxHeight: "50px" }}
            className="object-contain"
            onError={handleImageError}
            loading="lazy"
          />
        )}
      </div>

      <div className="flex flex-col justify-center items-center mt-2 gap-1">
        <div>
          <p
            className={`font-jakarta text-xs font-semibold text-center ${styles.textEllipsis}`}
          >
            {production.name}
          </p>
        </div>

        <div>
          <p
            className={`font-jakarta text-[8px] text-gray-500 text-center ${styles.textEllipsis}`}
          >
            {production.category}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductionCard;
