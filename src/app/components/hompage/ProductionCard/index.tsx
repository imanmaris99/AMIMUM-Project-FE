import Image from "next/image";
import { ProductionProps } from "@/types/apiTypes";

const ProductionCard = ({ production }: { production: ProductionProps }) => {
  return (
    <div className="bg-white rounded-lg h-36 flex flex-col items-center justify-center w-24 shadow-md">
      <div className="bg-gray-100 rounded-lg px-3 py-2 flex flex-col justify-center items-center">
        <Image src={production.photo_url} alt={production.name} width={50} height={50} />
      </div>

      <div className="flex flex-col justify-center items-center mt-2 gap-1">
        <div>
          <p className="font-jakarta text-xs font-semibold">
            {production.name}
          </p>
        </div>

        <div>
          <p className="font-jakarta text-[8px] text-gray-500">
            {production.category}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductionCard;
