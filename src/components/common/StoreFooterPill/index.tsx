import Link from "next/link";
import React from "react";

interface StoreFooterPillProps {
  className?: string;
}

const footerLinks = [
  { href: "/cara-belanja", label: "Cara Belanja" },
  { href: "/kebijakan-pembayaran", label: "Pembayaran" },
  { href: "/pengiriman-pickup", label: "Pengiriman" },
  { href: "/retur-komplain", label: "Retur/Komplain" },
  { href: "/kebijakan-privasi", label: "Privasi" },
  { href: "/syarat-ketentuan", label: "S&K" },
];

const StoreFooterPill: React.FC<StoreFooterPillProps> = ({ className = "" }) => {
  return (
    <footer
      aria-label="Footer toko"
      className={`flex flex-col items-center justify-center gap-3 px-4 py-6 text-center ${className}`}
    >
      <span className="rounded-full border border-emerald-100 bg-white/80 px-4 py-1.5 text-xs font-bold text-primary shadow-sm backdrop-blur">
        Toko Herbal AmImUm
      </span>
      <nav aria-label="Panduan toko" className="flex max-w-xs flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] font-semibold text-emerald-800/80">
        {footerLinks.map((link) => (
          <Link key={link.href} href={link.href} className="rounded-full px-1 py-0.5 transition hover:text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-200">
            {link.label}
          </Link>
        ))}
      </nav>
    </footer>
  );
};

export default StoreFooterPill;
