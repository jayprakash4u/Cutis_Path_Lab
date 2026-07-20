import { getSiteUrl } from "@/lib/siteUrl";

export default function sitemap() {
  const base = getSiteUrl() || "http://localhost:3000";
  const now = new Date();

  const staticRoutes = [
    "",
    "/about",
    "/contact",
    "/gallery",
    "/packages",
    "/services",
    "/tests",
    "/book",
  ];

  return staticRoutes.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.8,
  }));
}
