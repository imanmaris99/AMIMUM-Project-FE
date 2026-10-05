import React from "react";

interface StoreFooterPillProps {
  className?: string;
}

const StoreFooterPill: React.FC<StoreFooterPillProps> = ({ className = "" }) => {
  return (
    <footer
      aria-label="Footer toko"
      className={`flex items-center justify-center px-4 py-6 ${className}`}
    >
      <span className="rounded-full border border-emerald-100 bg-white/80 px-4 py-1.5 text-xs font-bold text-primary shadow-sm backdrop-blur">
        Toko Herbal AmImUm
      </span>
    </footer>
  );
};

export default StoreFooterPill;
