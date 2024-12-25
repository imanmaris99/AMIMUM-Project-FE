import Image from "next/image";
import { GoHeart } from "react-icons/go";
import { CardProductProps } from "./types";
import rupiahFormater from "@/utils/rupiahFormater";
import useSearchLogic from '../useSearchLogic';

const CardProduct = ({product}: {product: CardProductProps}) => {
  const { handleSelectProduct } = useSearchLogic();

  return (
    <div onClick={() => handleSelectProduct(product.id)} className="w-40 h-56 rounded-lg shadow-md flex flex-col justify-center items-center gap-2 relative cursor-pointer">
      <div className="absolute top-2 right-2">
        <GoHeart size={25} className="bg-white rounded-full" />
      </div>
      <div className="flex flex-col justify-center items-center">
        <div className="bg-gray-100 w-32 h-28 rounded-lg flex justify-center items-center">
          {product.all_variants.map((variant) => (
            <div key={variant.id} className="flex justify-center items-center">
              <Image
                src={variant.img || "/default-image.jpg"}
                alt={`product variant ${variant.variant}`}
                width={100}
                height={100}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col justify-center w-32 min-h-20">
        <div className="space-y-1">
          <p className="font-bold text-xs whitespace-nowrap overflow-hidden text-ellipsis">{product.name}</p>
          {product.all_variants.map((variant) => (
            <div key={variant.id} className="space-y-1">
              <p className="text-gray-500 text-[10px]">{variant.variant}</p>
              <div className="flex items-center gap-2">
                {variant.discount > 0 ? (
                  <>
                    <p className="text-[10px] text-white bg-red-500 rounded-sm w-7 text-center">
                      {variant.discount}%
                    </p>
                    <p className="flex items-center text-[10px] text-gray-500 line-through">
                      {rupiahFormater(product.price)}
                    </p>
                  </>
                ) : (
                  <p className="text-[10px] text-gray-500">
                    {rupiahFormater(product.price)}
                  </p>
                )}
              </div>
              <p className="font-bold text-sm mt-2">
                {rupiahFormater(variant.discount > 0 ? variant.discounted_price : product.price)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CardProduct;
