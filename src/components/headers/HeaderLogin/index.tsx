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
    <header className="shrink-0 px-5 pb-5 pt-9">
      <div className="flex items-center gap-3">
        <div className="flex h-28 w-28 shrink-0 items-center justify-center">
          <Image
            src="/logo_toko.svg"
            height={116}
            width={116}
            alt="Logo Toko Herbal AmImUm"
            className="h-28 w-28 object-contain"
            priority
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-bold uppercase tracking-[0.22em] text-[#2F6F57]">
            {eyebrow}
          </p>
          <p className="text-[3rem] font-extrabold leading-none tracking-[-0.055em] text-[#0D0E09]">
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
