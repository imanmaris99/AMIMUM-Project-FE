import { AiFillStar } from "react-icons/ai";

const TitleProduct = () => {
  return (
    <div className="flex items-center justify-between p-4 bg-white shadow-sm rounded-lg">
      <div>
        <p className="text-sm text-green-700">Produk : Jamu Jago</p>
        <h1 className="text-lg font-semibold text-gray-900">Buyung Upik </h1>
      </div>
      <div className="flex items-center gap-1 bg-orange-100 px-2 py-1 rounded-full">
        <AiFillStar className="text-orange-500" />
        <span className="text-orange-500 font-semibold text-sm">4.9</span>
      </div>
    </div>
  );
};

export default TitleProduct;
