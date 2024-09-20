import Image from "next/image";

const CardProduct = () => {
  return (
    <div className="bg-fern w-fit p-2 rounded-2xl flex flex-col items-center justify-center gap-2">
      <div className="object-cover">
        <Image
          src="https://via.placeholder.com/150"
          alt="No Image Available"
          width={150}
          height={150}
          className="rounded-2xl"
        />
      </div>

      <div>
        <p className="text-md text-white">Nama Produk</p>
      </div>
    </div>
  );
};

export default CardProduct;
