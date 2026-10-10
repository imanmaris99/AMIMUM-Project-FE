import Image from "next/image";
import React from "react";

const HeaderLogin = () => {
  return (
    <header className="shrink-0 px-6 pb-1 pt-6">
      <div className="flex items-center gap-3">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-50/80 ring-1 ring-emerald-100/80">
          <Image
            src="/logo_toko.svg"
            height={64}
            width={64}
            alt="Logo Toko Herbal AmImUm"
            className="h-11 w-11 object-contain"
            priority
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-700">
            Toko Herbal
          </p>
          <p className="text-2xl font-extrabold leading-tight text-[#0D0E09]">
            AmImUm
          </p>
          <p className="mt-0.5 text-[11px] leading-4 text-[#6B7C73]">
            Masuk untuk checkout dan pantau pesanan.
          </p>
        </div>
      </div>
    </header>
  );
};

export default HeaderLogin;
