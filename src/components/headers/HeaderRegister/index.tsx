import Image from "next/image";
import React from "react";

const HeaderRegister = () => {
  return (
    <header className="shrink-0 px-5 pt-8">
      <div className="rounded-b-[2rem] rounded-t-[2rem] bg-white/95 px-4 py-5 shadow-[0_8px_22px_rgba(15,23,42,0.08)] ring-1 ring-emerald-100">
        <div className="flex items-center gap-3">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-emerald-50 ring-1 ring-emerald-100">
            <Image
              src="/logo_toko.svg"
              height={88}
              width={88}
              alt="Logo Toko Herbal AmImUm"
              className="h-16 w-16 object-contain"
              priority
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
              Akun Customer
            </p>
            <p className="text-3xl font-extrabold leading-tight text-[#0D0E09]">
              AmImUm
            </p>
            <p className="mt-1 text-xs leading-5 text-[#6B7C73]">
              Daftar sekali untuk checkout lebih cepat dan pantau pesanan.
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderRegister;
