const SHOPEE_MARKETPLACE_URL = "https://shopee.co.id/tokoherbalamimum";
const TOKOPEDIA_MARKETPLACE_URL = "https://www.tokopedia.com/herbalamimum";

const Footer = () => {
  return (
    <footer className="mx-6 mt-8 mb-8 flex flex-col items-center justify-center gap-3 text-center font-jakarta">
      <div className="max-w-md rounded-2xl border border-primary/10 bg-primary/5 px-4 py-3 text-xs leading-relaxed text-gray-700">
        Kanal resmi Toko Herbal Amimum. Panduan belanja, pembayaran, pengiriman, dan pickup tersedia di bagian Panduan Resmi Toko pada homepage.
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <a
          href={SHOPEE_MARKETPLACE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-orange-300/70 bg-orange-50 px-4 py-2 text-xs font-semibold text-orange-700 shadow-[0_4px_12px_rgba(251,146,60,0.12)] transition hover:border-orange-400/80 hover:bg-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-300/50"
          aria-label="Buka marketplace Shopee Toko Herbal Amimum"
        >
          Marketplace Shopee: tokoherbalamimum
        </a>
        <a
          href={TOKOPEDIA_MARKETPLACE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-green-300/70 bg-green-50 px-4 py-2 text-xs font-semibold text-green-700 shadow-[0_4px_12px_rgba(34,197,94,0.10)] transition hover:border-green-400/80 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-300/50"
          aria-label="Buka marketplace Tokopedia Toko Herbal Amimum"
        >
          Marketplace Tokopedia: herbalamimum
        </a>
      </div>
    </footer>
  );
};

export default Footer;
