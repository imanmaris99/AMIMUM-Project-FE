import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import React from "react";

const HeaderRegister = () => {
  return (
    <div className="bg-customGreen4 shrink-0">
      <div className="flex justify-center items-center gap-3 px-5 pb-6 pt-10">
        <div className="w-24 shrink-0">
          <Image
            src="/logo_toko.svg"
            height={120}
            width={120}
            alt="header logo"
            className="h-auto w-full"
          />
        </div>
        <div className="flex flex-col justify-center min-w-0">
          <p className="text-lg font-bold leading-tight">Toko Herbal</p>
          <p className="text-3xl font-bold text-primary leading-tight">AmImUm</p>
        </div>
        <div className="hidden sm:block self-end mb-2 -ml-1">
          <div className="relative">
            <div className="w-16 h-0 border-b-4 border-primary"></div>
            <div className="absolute left-full top-1/2 transform -translate-y-1/2 -ml-3">
              <svg width="26" height="26" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 2L8 6L4 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
      <Separator className="bg-primary h-2 w-2/5 mx-auto rounded-xl"/>
    </div>
  );
};

export default HeaderRegister;
