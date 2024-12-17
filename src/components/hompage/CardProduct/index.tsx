import Image from "next/image";
import { GoHeart } from "react-icons/go";

const CardProduct = () => {
  return (
    <>
      <div className="w-40 h-56 rounded-lg shadow-md flex flex-col justify-center items-center gap-2 relative">
        <div className="absolute top-2 right-2">
          <GoHeart size={25} className="bg-white rounded-full" />
        </div>
        <div className="flex flex-col justify-center items-center">
          <div className="bg-gray-100 w-32 h-28 rounded-lg flex justify-center items-center">
            <div>
              <Image
                src="/default-image.jpg"
                alt="product"
                width={100}
                height={100}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center w-32 gap-2 min-h-20">
          <div>
            <p className="font-bold text-xs">Buyung Upik</p>
            <p className="text-gray-500 text-[10px]">Cokelat</p>
            <div className="flex items-center gap-2">
              <p className="text-[10px] text-white bg-red-500 rounded-sm w-7 text-center">
                10%
              </p>
              <p className="flex items-center text-[10px] text-gray-500 line-through">
                Rp. 17.500
              </p>
            </div>
          </div>
          <div>
            <p className="font-bold text-sm">Rp. 100.000</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default CardProduct;
