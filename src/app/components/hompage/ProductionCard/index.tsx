import Image from "next/image";
import { ProductionProps } from "@/API/types/apiTypes";
import styles from "./ProductionCard.module.css";

const ProductionCard = ({ production }: { production: ProductionProps }) => {
  return (
    <div className="bg-white rounded-lg h-36 flex flex-col items-center justify-center w-24 shadow-md">
      <div className="bg-gray-100 rounded-lg px-3 py-2 flex flex-col justify-center items-center w-20 h-20">
        <Image src={production.photo_url || "/default-image.jpg"} alt={production.name} width={50} height={50} />
      </div>

      <div className="flex flex-col justify-center items-center mt-2 gap-1">
        <div>
          <p className={`font-jakarta text-xs font-semibold text-center ${styles.textEllipsis}`}>
            {production.name}
          </p>
        </div>

        <div>
          <p className={`font-jakarta text-[8px] text-gray-500 text-center ${styles.textEllipsis}`}>
            {production.category}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductionCard;
