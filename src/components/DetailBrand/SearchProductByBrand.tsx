"use client";

import { useState } from 'react';
import { CiSearch } from 'react-icons/ci';
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface SearchProductByBrandProps {
  brandId: number;
  brandName?: string;
}

const SearchProductByBrand = ({ brandId, brandName }: SearchProductByBrandProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Search produk dari brand tertentu
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}&brand=${encodeURIComponent(brandName || `ID ${brandId}`)}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleCheckPromo = () => {
    // Navigate to specific promo page (using brandId as promoId for now)
    router.push(`/promo/${brandId}`);
  };

  return (
    <div className="flex flex-col gap-2 mt-2 mx-6">
      <div className="relative">
        <input
          type="text"
          placeholder={`Cari produk dari merek ${brandName || `ID ${brandId}`}`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          className="w-full border border-gray-300 rounded-lg p-2 pl-6 outline-none placeholder:text-sm focus:border-[#006A47] focus:ring-1 focus:ring-[#006A47]"
        />
        <CiSearch 
          className="absolute w-6 h-6 text-gray-500 right-4 top-1/2 -translate-y-1/2 cursor-pointer hover:text-[#006A47] transition-colors" 
          onClick={handleSearch}
        />
      </div>
      <div className="flex justify-center items-center gap-2">
        <p className="text-gray-500 text-sm font-jakarta font-semibold">
          Mau tau info produk yang sedang promo?
        </p>
        <Button 
          variant="destructive" 
          type="button"
          onClick={handleCheckPromo}
          className="bg-red-500 hover:bg-red-600 text-white transition-colors"
        >
          Cek Disini!
        </Button>
      </div>
    </div>
  );
};

export default SearchProductByBrand; 