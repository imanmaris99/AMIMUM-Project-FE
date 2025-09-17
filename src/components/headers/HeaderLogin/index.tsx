import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import React from "react";

const HeaderLogin = () => {
  return (
    <div className="bg-customGreen4 h-1/4">
      <div className="flex justify-center items-center gap-2 py-10">
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
          <p className="text-5xl font-bold text-[#00764f]">AmImUm</p>
        </div>
      </div>
      <Separator className="bg-[#00764f] mt-4 mb-1 py-1 w-2/5 mx-auto rounded-xl"/>
    </div>
  );
};

export default HeaderLogin;