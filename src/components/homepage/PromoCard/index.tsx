"use client";

import Image from "next/image";
import { PromoProps } from "./types";
import styles from "./PromoCard.module.css";
import { useRouter } from "next/navigation";

const PromoCard = ({ promo }: { promo: PromoProps }) => {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/promo/${promo.id}`);
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className="bg-customGreen5 rounded-lg h-36 flex flex-col items-center justify-center w-24 cursor-pointer"
      >
        <div className="bg-white rounded-lg px-3 py-2 flex flex-col justify-center items-center w-20 h-20">
          <Image
            src={promo.photo_url || "/default-image.jpg"}
            alt="promo"
            width={50}
            height={50}
            style={{ width: "100%", height: "auto" }}
          />
        </div>

        <div className="flex flex-col justify-center items-center mt-2 gap-1">
          <div>
            <p
              className={`font-jakarta text-xs text-center ${styles.textEllipsis}`}
            >
              {promo.name}
            </p>
          </div>

          <div className="flex justify-center items-center bg-red-100 w-20 py-1 rounded-md">
            <p className="font-jakarta text-[8px]">
              up to{" "}
              <span className="text-red-500 font-extrabold">
                {promo.promo_special}%
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PromoCard;
