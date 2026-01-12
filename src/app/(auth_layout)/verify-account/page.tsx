import React from "react";
import FormVerifyAccount from "@/components/forms/FormVerifyAccount";
import { HeaderLogin } from "@/components";
import Image from "next/image";

const VerifyAccount = () => {
  return (
    <div className="mx-auto max-w-[440px] min-w-[360px] h-screen relative flex flex-col overflow-hidden">
      <HeaderLogin />
      
      {/* Konten utama */}
      <div className="px-6 py-4 h-full flex flex-col">
        <div className="w-full max-w-sm mx-auto mt-8">
          <FormVerifyAccount />
        </div>
      </div>

      {/* Logo brand di bagian bawah */}
      <div className="absolute bottom-0 right-0 w-[220px] h-[242px] transform rotate-[20deg] opacity-25">
        <div className="relative w-full h-full">
          <div className="absolute top-[49px] left-[1.75px] w-[200px] h-[200px] bg-[#B0D5C7] bg-opacity-25 rounded-full"></div>
          <div className="relative z-10 w-[175px] h-[200px] mx-auto mt-[-4px]">
            <Image
              src="/logo_toko.svg"
              alt="Logo Toko"
              width={175}
              height={200}
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyAccount;
