import type { MetadataRoute } from "next";

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.tokoherbalamimum.web.id";
const siteUrl = rawSiteUrl.replace(/\/$/, "");
const apiBaseUrl = (
  process.env.API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "https://amimumprojectbe-production.up.railway.app"
).replace(/\/$/, "");

const staticRoutes = [
  { path: "", priority: 1, changeFrequency: "daily" as const },
  { path: "/search", priority: 0.8, changeFrequency: "daily" as const },
  { path: "/cara-belanja", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/kebijakan-pembayaran", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/pengiriman-pickup", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/login", priority: 0.3, changeFrequency: "monthly" as const },
  { path: "/register", priority: 0.3, changeFrequency: "monthly" as const },
  { path: "/forgot-password", priority: 0.2, changeFrequency: "yearly" as const },
  { path: "/verify-account", priority: 0.2, changeFrequency: "yearly" as const },
];

type ApiListResponse<T> = {
  data?: T[];
  has_more?: boolean;
};

type BrandSitemapItem = {
  id?: number | string;
  updated_at?: string;
  created_at?: string;
};

type ProductSitemapItem = {
  id?: string;
  updated_at?: string;
  created_at?: string;
  is_active?: boolean;
};

const toDate = (value?: string) => {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
};

const fetchJson = async <T>(path: string): Promise<T | null> => {
  try {
    const response = await fetch(`${apiBaseUrl}${path}`, {
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(8_000),
    });

    if (!response.ok) return null;

    return (await response.json()) as T;
  } catch {
    return null;
  }
};

const fetchBrands = async (): Promise<BrandSitemapItem[]> => {
  const allBrands: BrandSitemapItem[] = [];
  const pageSize = 100;
  let skip = 0;

  for (let page = 0; page < 10; page += 1) {
    const payload = await fetchJson<ApiListResponse<BrandSitemapItem>>(`/brand/loader?skip=${skip}&limit=${pageSize}`);
    const pageData = Array.isArray(payload?.data) ? payload.data : [];

    allBrands.push(...pageData);

    if (!payload?.has_more || pageData.length === 0) break;
    skip += pageData.length;
  }

  return allBrands;
};

const fetchProducts = async (): Promise<ProductSitemapItem[]> => {
  const payload = await fetchJson<ApiListResponse<ProductSitemapItem>>("/product/all");
  return Array.isArray(payload?.data) ? payload.data : [];
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const routes = new Map<string, MetadataRoute.Sitemap[number]>();

  const addRoute = (entry: MetadataRoute.Sitemap[number]) => {
    routes.set(entry.url, entry);
  };

  staticRoutes.forEach((route) => {
    addRoute({
      url: `${siteUrl}${route.path}`,
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    });
  });

  const [brands, products] = await Promise.all([fetchBrands(), fetchProducts()]);

  brands
    .filter((brand) => brand.id !== undefined && brand.id !== null)
    .forEach((brand) => {
      addRoute({
        url: `${siteUrl}/brand/${encodeURIComponent(String(brand.id))}`,
        lastModified: toDate(brand.updated_at) || toDate(brand.created_at) || now,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    });

  products
    .filter((product) => product.id && product.is_active !== false)
    .forEach((product) => {
      addRoute({
        url: `${siteUrl}/detail-product/${encodeURIComponent(product.id as string)}`,
        lastModified: toDate(product.updated_at) || toDate(product.created_at) || now,
        changeFrequency: "weekly",
        priority: 0.8,
      });
    });

  return Array.from(routes.values());
}
