import CardProduct from "../CardProduct";
import { CardProductProps } from "../CardProduct/types";

const ListProductSection = ({products}: {products: CardProductProps[]}) => {
  const isSingleProduct = products?.length === 1;

  return (
    <>
      <div className="mt-5 flex items-center justify-between">
        <h1 className="font-jakarta text-base font-bold text-[#0D0E09]">Produk</h1>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700">
          Katalog toko
        </span>
      </div>
      <div className={isSingleProduct
        ? "my-4 grid grid-cols-1 justify-items-center"
        : "my-4 grid grid-cols-2 gap-3 sm:gap-4"
      }>
        {products?.map((product, index) => (
          <div key={index} className={isSingleProduct ? "w-[min(46vw,188px)]" : "w-full"}>
            <CardProduct product={product} />
          </div>
        ))}
      </div>
    </>
  );
};

export default ListProductSection;
