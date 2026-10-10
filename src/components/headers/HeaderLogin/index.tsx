import Image from "next/image";
import React from "react";

type HeaderLoginProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
};

const HeaderLogin = ({
  eyebrow = "Toko Herbal",
  title = "AmImUm",
  description = "Masuk untuk checkout dan pantau pesanan.",
}: HeaderLoginProps) => {
  return (
    <header className="shrink-0 px-6 pb-4 pt-9">
      <div className="flex items-center gap-4">
        <div className="flex h-24 w-24 shrink-0 items-center justify-center">
          <Image
            src="/logo_toko.svg"
            height={100}
            width={100}
            alt="Logo Toko Herbal AmImUm"
            className="h-24 w-24 object-contain"
            priority
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-bold uppercase tracking-[0.22em] text-[#2F6F57]">
            {eyebrow}
          </p>
          <p className="text-[2.625rem] font-extrabold leading-none tracking-[-0.045em] text-[#0D0E09]">
            {title}
          </p>
          <p className="mt-2 text-[15px] leading-6 text-[#5F6F67]">
            {description}
          </p>
        </div>
      </div>
    </header>
  );
};

export default HeaderLogin;
