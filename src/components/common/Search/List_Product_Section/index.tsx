import CardProduct from "../CardProduct";
import { CardProductProps } from "../CardProduct/types";

const ListProductSection = ({products}: {products: CardProductProps[]}) => {
  return (
    <>
      <div className="mt-5 flex items-center justify-between">
        <h1 className="font-jakarta text-base font-bold text-[#0D0E09]">Produk</h1>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700">
          Katalog toko
        </span>
      </div>
      <div className="my-4 grid grid-cols-2 gap-3 sm:gap-4">
        {products?.map((product, index) => (
          <CardProduct key={index} product={product} />
        ))}
      </div>
    </>
  );
};

export default ListProductSection;
