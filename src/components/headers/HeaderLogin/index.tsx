import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import React from "react";

const HeaderLogin = () => {
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
      </div>
      <Separator className="bg-primary h-2 w-2/5 mx-auto rounded-xl"/>
    </div>
  );
};

export default HeaderLogin;