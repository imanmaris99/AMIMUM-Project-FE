import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.tokoherbalamimum.web.id";

const staticRoutes = [
  "",
  "/search",
  "/cara-belanja",
  "/kebijakan-pembayaran",
  "/pengiriman-pickup",
  "/login",
  "/register",
  "/forgot-password",
  "/verify-account",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return staticRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.6,
  }));
}
