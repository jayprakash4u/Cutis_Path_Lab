import { getSiteUrl } from "@/lib/siteUrl";

export default function robots() {
  const base = getSiteUrl() || "http://localhost:3000";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
