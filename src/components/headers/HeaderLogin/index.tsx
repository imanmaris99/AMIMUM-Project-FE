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
    <header className="shrink-0 px-7 pb-2 pt-8">
      <div className="flex items-center gap-4">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center">
          <Image
            src="/logo_toko.svg"
            height={84}
            width={84}
            alt="Logo Toko Herbal AmImUm"
            className="h-20 w-20 object-contain"
            priority
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-800">
            {eyebrow}
          </p>
          <p className="text-[2.25rem] font-extrabold leading-none tracking-[-0.04em] text-[#0D0E09]">
            {title}
          </p>
          <p className="mt-1.5 text-sm leading-5 text-[#6B7C73]">
            {description}
          </p>
        </div>
      </div>
    </header>
  );
};

export default HeaderLogin;
