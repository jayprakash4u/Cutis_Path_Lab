import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: __dirname,
  turbopack: {
    root: __dirname,
  },
  poweredByHeader: false,
  async headers() {
    const securityHeaders = [
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=()",
      },
      { key: "X-DNS-Prefetch-Control", value: "on" },
    ];

    if (process.env.NODE_ENV === "production") {
      securityHeaders.push({
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains; preload",
      });
    }

    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  async rewrites() {
    // Uploaded files live in MySQL. If the file is not in public/, serve it
    // from /api/media so live and local both show the same gallery images.
    const folders = [
      "about",
      "banners",
      "blogs",
      "categories",
      "gallery",
      "home",
      "packages",
      "referrals",
      "services",
      "team",
      "testimonials",
      "tests",
    ];
    return folders.map((folder) => ({
      source: `/images/${folder}/:filename`,
      destination: `/api/media/${folder}/:filename`,
    }));
  },
  images: {
    localPatterns: [
      { pathname: "/images/**" },
      { pathname: "/api/media/**" },
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
    ],
    // Next 16 only honours qualities listed here — anything else silently
    // falls back to 75. 90 is used by the blog cards.
    qualities: [75, 90],
  },
};

export default nextConfig;
