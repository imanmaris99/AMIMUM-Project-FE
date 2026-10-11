import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.tokoherbalamimum.web.id";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/profile",
        "/saved-addresses",
        "/shipment",
        "/wishlist",
        "/transaction",
        "/track-order",
        "/order-1",
        "/order-confirmation",
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
