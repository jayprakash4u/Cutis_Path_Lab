import { sqlQuery } from "@/lib/mysql";
import { getSiteUrl } from "@/lib/siteUrl";

export default async function sitemap() {
  const base = getSiteUrl() || "http://localhost:3000";
  const now = new Date();

  const staticRoutes = [
    "",
    "/about",
    "/blog",
    "/contact",
    "/gallery",
    "/packages",
    "/services",
    "/tests",
    "/book",
  ];

  const entries = staticRoutes.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.8,
  }));

  /*
    Articles are the only routes here that come and go without a deploy, so
    they are read from the table rather than hardcoded. A database that is down
    must not take the whole sitemap with it — the static routes are still worth
    serving on their own.
  */
  try {
    const posts = await sqlQuery(
      `SELECT \`slug\`, \`updatedAt\`, \`publishedAt\`
         FROM \`BlogPost\`
        WHERE \`isActive\` = 1
        ORDER BY \`publishedAt\` DESC`,
    );

    for (const post of posts) {
      if (!post.slug) continue;
      const stamp = post.updatedAt || post.publishedAt;
      entries.push({
        url: `${base}/blog/${post.slug}`,
        lastModified: stamp ? new Date(stamp) : now,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  } catch {
    // Static routes above are still returned.
  }

  return entries;
}
