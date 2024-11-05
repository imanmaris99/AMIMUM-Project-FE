import Image from "next/image";

const PromoCard = () => {
  return (
    <div className="bg-customGreen5 rounded-lg h-36 flex flex-col items-center justify-center w-24">
      <div className="bg-white rounded-lg px-3 py-2 flex flex-col justify-center items-center">
        <Image src="/jamu_jago_1.png" alt="promo" width={50} height={50} />
      </div>

      <div className="flex flex-col justify-center items-center mt-2 gap-1">
        <div>
          <p className="font-jakarta text-xs">Jamu Jago</p>
        </div>

        <div className="flex justify-center items-center bg-red-100 w-20 py-1 rounded-md">
          <p className="font-jakarta text-[8px]">
            up to <span className="text-red-500 font-extrabold">50%</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PromoCard;
