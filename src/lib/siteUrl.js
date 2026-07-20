/** Canonical public site URL for metadata, sitemap, and emails. */
export function getSiteUrl() {
  const url =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    (process.env.NODE_ENV === "production" ? "" : "http://localhost:3000");

  return url.replace(/\/$/, "");
}
