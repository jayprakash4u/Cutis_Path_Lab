/** Cache-Control for public catalog GET responses (browser + dev reload). */
export function publicCatalogCache(init = {}) {
  const maxAge = Number(process.env.PUBLIC_API_CACHE_SECONDS || "60");
  return {
    ...init,
    headers: {
      ...(init.headers || {}),
      "Cache-Control": `public, max-age=${maxAge}, stale-while-revalidate=300`,
    },
  };
}
