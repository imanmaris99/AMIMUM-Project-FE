const SHOPEE_MARKETPLACE_URL = "https://shopee.co.id/tokoherbalamimum";
const TOKOPEDIA_MARKETPLACE_URL = "https://www.tokopedia.com/herbalamimum";

const Footer = () => {
  return (
    <footer className="mx-6 mt-8 mb-8 flex flex-col items-center justify-center gap-3 text-center font-jakarta">
      <div className="max-w-md rounded-2xl border border-primary/10 bg-primary/5 px-4 py-3 text-xs leading-relaxed text-gray-700">
        Informasi produk, harga, promo, ongkir, dan pembayaran mengikuti data katalog toko saat checkout. Jika ragu sebelum membeli, silakan cek detail produk atau hubungi admin melalui halaman transaksi.
      </div>
      <nav
        className="flex flex-wrap items-center justify-center gap-2"
        aria-label="Panduan toko"
      >
        <a
          href="/cara-belanja"
          className="rounded-full border border-emerald-700/20 bg-white px-4 py-2 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
        >
          Cara Belanja
        </a>
        <a
          href="/kebijakan-pembayaran"
          className="rounded-full border border-emerald-700/20 bg-white px-4 py-2 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
        >
          Kebijakan Pembayaran
        </a>
        <a
          href="/pengiriman-pickup"
          className="rounded-full border border-emerald-700/20 bg-white px-4 py-2 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
        >
          Pengiriman & Pickup
        </a>
      </nav>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <a
          href={SHOPEE_MARKETPLACE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-semibold text-primary transition hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/30"
          aria-label="Buka marketplace Shopee Toko Herbal Amimum"
        >
          Marketplace Shopee: tokoherbalamimum
        </a>
        <a
          href={TOKOPEDIA_MARKETPLACE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-green-600/20 bg-green-50 px-4 py-2 text-xs font-semibold text-green-700 transition hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600/30"
          aria-label="Buka marketplace Tokopedia Toko Herbal Amimum"
        >
          Marketplace Tokopedia: herbalamimum
        </a>
      </div>
    </footer>
  );
};

export default Footer;
