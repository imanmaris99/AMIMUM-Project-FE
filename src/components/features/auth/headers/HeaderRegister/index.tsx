import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import React from "react";

const HeaderRegister = () => {
  return (
    <div className="bg-customGreen4 h-1/4">
      <div className="flex justify-center items-center gap-2 py-14 px-4">
        <div className="w-1/4">
          <Image
            src="/logo_toko.svg"
            height={500}
            width={500}
            alt="header logo"
          />
        </div>
        <div className="flex flex-col justify-center">
          <p className="text-xl font-bold">Toko Herbal</p>
          <p className="text-4xl font-bold text-primary">AmImUm</p>
        </div>
        <div className="self-end mb-4 -ml-4">
          <div className="relative">
            <div className="w-40 h-0 border-b-4 border-primary"></div>
            <div className="absolute left-full top-1/2 transform -translate-y-1/2 -ml-5">
              <svg width="30" height="30" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 2L8 6L4 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
      <Separator className="bg-primary mt-3 mb-1 py-1 w-2/5 mx-auto rounded-xl"/>
    </div>
  );
};

export default HeaderRegister;
