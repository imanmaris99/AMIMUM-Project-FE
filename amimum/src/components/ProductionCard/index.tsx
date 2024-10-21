import Image from "next/image";
import jamuJago from "../../../public/assets/images/jamu_jago_1.png";

const ProductionCard = () => {
  return (
    <div className="bg-white rounded-lg h-36 flex flex-col items-center justify-center w-24 shadow-md">
      <div className="bg-gray-100 rounded-lg px-3 py-2 flex flex-col justify-center items-center">
        <Image src={jamuJago} alt="promo" width={50} height={50} />
      </div>

      <div className="flex flex-col justify-center items-center mt-2 gap-1">
        <div>
          <p className="font-jakarta text-xs font-semibold">Jamu Jago</p>
        </div>

        <div>
          <p className="font-jakarta text-[8px] text-gray-500">
            Herbal olahan pabrik
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductionCard;
