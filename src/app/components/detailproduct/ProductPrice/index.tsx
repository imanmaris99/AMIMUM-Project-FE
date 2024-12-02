import { Button } from "@/components/ui/button";

const ProductPrice = () => {
  return (
    <div className="p-4 flex items-center justify-between mb-20">
      <div>
        <p className="text-gray-700 font-semibold">Harga Produk :</p>
        <div className="flex items-center mt-1">
          <span className="bg-red-500 text-white text-sm font-semibold px-2 py-0.5 rounded mr-2">
            10%
          </span>
          <span className="text-gray-400 line-through text-sm">Rp 17.500</span>
        </div>
        <p className="text-xl font-bold text-gray-800 mt-1">Rp 15.000</p>
      </div>
      <div>
        <Button variant="default"> + Keranjang </Button>
      </div>
    </div>
  );
};

export default ProductPrice;
