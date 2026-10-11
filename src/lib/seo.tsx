import type { Metadata } from "next";
import type { DetailProductType } from "@/types/detailProduct";
import type { AllProductInfoType } from "@/types/apiTypes";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.tokoherbalamimum.web.id";
export const SITE_NAME = "Toko Herbal Amimum";
export const SITE_LEGAL_NAME = "Toko Herbal Amimum";
export const SITE_DESCRIPTION =
  "Katalog produk herbal dan jamu Toko Herbal Amimum. Lihat produk, promo, metode pembayaran resmi, pickup, pengiriman, dan status pesanan dari katalog toko.";
export const STORE_PHONE = "+6285296708577";
export const STORE_ADDRESS = "Ds. Bakaran Kulon RT02/Rw01, Bakaran, Pati, Jawa Tengah, Indonesia";

const absoluteUrl = (pathOrUrl?: string | null) => {
  if (!pathOrUrl) return `${SITE_URL}/logo_toko.svg`;

  try {
    return new URL(pathOrUrl, SITE_URL).toString();
  } catch {
    return `${SITE_URL}/logo_toko.svg`;
  }
};

export const toCanonicalPath = (path: string) => {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
};

export const cleanText = (value?: string | null, fallback = "") =>
  (value || fallback)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export const truncateText = (value: string, maxLength = 155) => {
  const text = cleanText(value);
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1).trim()}…`;
};

export const getProductImage = (product?: DetailProductType | null) =>
  absoluteUrl(
    product?.primary_image_url ||
      product?.gallery_images?.find((image) => image.is_primary)?.url ||
      product?.gallery_images?.[0]?.url ||
      product?.variants_list?.find((variant) => Boolean(variant.img))?.img ||
      "/logo_toko.svg"
  );

export const getListProductImage = (product?: AllProductInfoType | null) =>
  absoluteUrl(product?.image || product?.all_variants?.find((variant) => Boolean(variant.img))?.img || "/logo_toko.svg");

export const formatRupiah = (value?: number | null) => {
  if (typeof value !== "number" || Number.isNaN(value)) return undefined;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
};

export const productDescription = (product: DetailProductType) => {
  const description = [
    product.info,
    product.description_list?.[0],
    product.instructions_list?.[0],
  ]
    .map((item) => cleanText(item))
    .filter(Boolean)
    .join(" ");

  const priceLabel = formatRupiah(product.price);
  const stock = product.variants_list?.reduce(
    (total, variant) => total + Math.max(Number(variant.stock || 0), 0),
    0
  );

  return truncateText(
    [
      description || `${product.name} tersedia di katalog resmi ${SITE_NAME}.`,
      product.company ? `Brand/produksi: ${product.company}.` : "",
      priceLabel ? `Harga mulai ${priceLabel}.` : "",
      typeof stock === "number" ? `Stok katalog ${stock}.` : "",
    ]
      .filter(Boolean)
      .join(" ")
  );
};

export const buildOpenGraphMetadata = ({
  title,
  description,
  path,
  image,
  type = "website",
}: {
  title: string;
  description: string;
  path: string;
  image?: string | null;
  type?: "website" | "article";
}): Metadata => {
  const canonical = toCanonicalPath(path);
  const imageUrl = absoluteUrl(image || "/logo_toko.svg");

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      type,
      locale: "id_ID",
      url: canonical,
      siteName: SITE_NAME,
      title,
      description,
      images: [
        {
          url: imageUrl,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
};

export const organizationJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "Store",
  "@id": `${SITE_URL}/#store`,
  name: SITE_NAME,
  legalName: SITE_LEGAL_NAME,
  url: SITE_URL,
  logo: absoluteUrl("/logo_toko.svg"),
  image: absoluteUrl("/logo_toko.svg"),
  telephone: STORE_PHONE,
  address: {
    "@type": "PostalAddress",
    streetAddress: STORE_ADDRESS,
    addressCountry: "ID",
    addressRegion: "Jawa Tengah",
  },
  sameAs: [
    "https://shopee.co.id/tokoherbalamimum",
    "https://www.tokopedia.com/herbalamimum",
  ],
});

export const websiteJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/search?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
});

export const productJsonLd = (product: DetailProductType) => {
  const image = getProductImage(product);
  const inStock = product.variants_list?.some((variant) => Number(variant.stock || 0) > 0);
  const price = typeof product.price === "number" ? product.price : product.variants_list?.[0]?.discounted_price;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${toCanonicalPath(`/detail-product/${product.id}`)}#product`,
    name: product.name,
    description: productDescription(product),
    image: [image],
    brand: {
      "@type": "Brand",
      name: product.company || SITE_NAME,
    },
    sku: product.id,
    aggregateRating:
      product.avg_rating && product.total_rater
        ? {
            "@type": "AggregateRating",
            ratingValue: product.avg_rating,
            reviewCount: product.total_rater,
          }
        : undefined,
    offers: {
      "@type": "Offer",
      url: toCanonicalPath(`/detail-product/${product.id}`),
      priceCurrency: "IDR",
      price: typeof price === "number" ? price : undefined,
      availability: inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@id": `${SITE_URL}/#store`,
      },
    },
  };
};

export const itemListJsonLd = ({
  name,
  path,
  products,
}: {
  name: string;
  path: string;
  products: AllProductInfoType[];
}) => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  "@id": `${toCanonicalPath(path)}#itemlist`,
  name,
  itemListElement: products.slice(0, 24).map((product, index) => ({
    "@type": "ListItem",
    position: index + 1,
    url: toCanonicalPath(`/detail-product/${product.id}`),
    name: product.name,
    image: getListProductImage(product),
  })),
});

export const JsonLd = ({ data }: { data: Record<string, unknown> | Array<Record<string, unknown>> }) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify(data).replace(/</g, "\\u003c"),
    }}
  />
);
