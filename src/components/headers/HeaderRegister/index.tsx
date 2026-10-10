import Image from "next/image";
import React from "react";

const HeaderRegister = () => {
  return (
    <header className="shrink-0 px-4 pt-4">
      <div className="rounded-3xl bg-white/95 px-4 py-4 shadow-[0_8px_22px_rgba(15,23,42,0.08)] ring-1 ring-emerald-100">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 ring-1 ring-emerald-100">
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
              Akun Customer
            </p>
            <p className="text-2xl font-extrabold leading-tight text-[#0D0E09]">
              AmImUm
            </p>
            <p className="mt-0.5 text-[11px] leading-4 text-[#6B7C73]">
              Daftar untuk checkout lebih cepat.
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderRegister;
