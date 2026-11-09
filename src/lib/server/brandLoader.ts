export async function collectBrandLoaderPages<T>(
  fetchPage: (skip: number, limit: number) => Promise<Response>,
): Promise<T[]> {
  const allBrands: T[] = [];
  const pageSize = 50;
  let skip = 0;
  let hasMore = true;

  while (hasMore) {
    const response = await fetchPage(skip, pageSize);

    // The API uses 404 to signal that the requested page has no records.
    if (response.status === 404) return allBrands;
    if (response.status === 409 || response.status === 500 || !response.ok) {
      throw new Error('Data brand belum bisa dimuat. Silakan coba lagi beberapa saat lagi.');
    }

    const payload = await response.json() as { data?: unknown; has_more?: unknown };
    const pageData = Array.isArray(payload?.data) ? payload.data as T[] : [];
    allBrands.push(...pageData);
    hasMore = Boolean(payload?.has_more) && pageData.length > 0;
    skip += pageData.length;

    if (pageData.length === 0) break;
  }

  return allBrands;
}
