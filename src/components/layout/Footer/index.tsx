const SHOPEE_MARKETPLACE_URL = "https://shopee.co.id/tokoherbalamimum";

const Footer = () => {
  return (
    <footer className="mx-6 mt-8 mb-8 flex flex-col items-center justify-center gap-2 text-center font-jakarta">
      <a
        href={SHOPEE_MARKETPLACE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-semibold text-primary transition hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/30"
        aria-label="Buka marketplace Shopee resmi Toko Herbal Amimum"
      >
        Marketplace Shopee: tokoherbalamimum
      </a>
      <p className="text-sm text-gray-700">
        ©2025 <span className="text-gray-500">by</span>{" "}
        <span className="font-bold text-primary">AmImUm Team</span>.
      </p>
    </footer>
  );
};

export default Footer;
