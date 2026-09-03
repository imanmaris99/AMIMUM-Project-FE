import React from "react";
import FormForgotPassword from "@/components/forms/FormForgotPassword";
import { HeaderLogin } from "@/components";
import Image from "next/image";

const ForgotPassword = () => {
  return (
    <div className="mx-auto min-h-screen w-full min-w-[360px] max-w-[440px] relative flex flex-col overflow-x-hidden bg-[#EEF9F4]">
      <HeaderLogin />
      
      {/* Konten utama */}
      <main className="px-6 pb-6 pt-5 flex-1 flex flex-col relative z-10">
        <div className="w-full max-w-sm mx-auto">
          <FormForgotPassword />
        </div>
      </main>

      {/* Logo brand dekoratif */}
      <div className="pointer-events-none absolute bottom-8 right-[-18px] w-[180px] h-[198px] rotate-[20deg] opacity-15 z-0">
        <div className="relative w-full h-full">
          <div className="absolute top-[40px] left-[1px] w-[164px] h-[164px] bg-[#B0D5C7] bg-opacity-25 rounded-full"></div>
          <div className="relative z-10 w-[144px] h-[164px] mx-auto mt-[-4px]">
            <Image
              src="/logo_toko.svg"
              alt="Logo Toko"
              width={144}
              height={164}
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
