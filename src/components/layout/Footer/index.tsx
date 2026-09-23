const SHOPEE_MARKETPLACE_URL = "https://shopee.co.id/tokoherbalamimum";
const TOKOPEDIA_MARKETPLACE_URL = "https://www.tokopedia.com/herbalamimum";

const Footer = () => {
  return (
    <footer className="mx-6 mt-8 mb-8 flex flex-col items-center justify-center gap-2 text-center font-jakarta">
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
      <p className="text-sm text-gray-700">
        ©2025 <span className="text-gray-500">by</span>{" "}
        <span className="font-bold text-primary">AmImUm Team</span>.
      </p>
    </footer>
  );
};

export default Footer;
