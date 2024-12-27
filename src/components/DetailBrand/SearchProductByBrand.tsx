import { CiSearch } from 'react-icons/ci';
import { Button } from "@/components/ui/button";

const SearchProductByBrand = () => {
  return (
    <div className="flex flex-col gap-2 mt-2 mx-6">
      <div className="relative">
        <input
          type="text"
          placeholder="Cari produk dari merek Jamu Jago"
          className="w-full border border-gray-300 rounded-lg p-2 pl-6 outline-none placeholder:text-sm"
        />
        <CiSearch className="absolute w-6 h-6 text-gray-500 right-4 top-1/2 -translate-y-1/2" />
      </div>
      <div className="flex justify-center items-center gap-2">
        <p className="text-gray-500 text-sm font-jakarta font-semibold">
          Mau tau info produk yang sedang promo?
        </p>
        <Button variant="destructive" type="button">
          Cek Disini!
        </Button>
      </div>
    </div>
  );
};

export default SearchProductByBrand; 