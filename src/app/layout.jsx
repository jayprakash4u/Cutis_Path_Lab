import localFont from "next/font/local";
import { getSiteUrl } from "@/lib/siteUrl";
import "./globals.css";

/* Three faces, three jobs: Archivo speaks, Public Sans explains,
   IBM Plex Mono reports the numbers. Self-hosted from public/fonts so the
   build never depends on a network round trip. */
const display = localFont({
  src: [{ path: "../../public/fonts/archivo.woff2", weight: "400 700", style: "normal" }],
  variable: "--font-display",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "Segoe UI", "sans-serif"],
});

const sans = localFont({
  src: [{ path: "../../public/fonts/public-sans.woff2", weight: "400 700", style: "normal" }],
  variable: "--font-sans",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "Segoe UI", "sans-serif"],
});

const mono = localFont({
  src: [
    { path: "../../public/fonts/plex-mono-400.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/plex-mono-500.woff2", weight: "500", style: "normal" },
    { path: "../../public/fonts/plex-mono-600.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-mono",
  display: "swap",
  fallback: ["ui-monospace", "Consolas", "monospace"],
});

const siteUrl = getSiteUrl();

export const metadata = {
  metadataBase: siteUrl ? new URL(siteUrl) : undefined,
  title: {
    default: "Cutis Path Lab",
    template: "%s · Cutis Path Lab",
  },
  description:
    "Cutis Path Lab — trusted diagnostic laboratory services. Book pathology tests, health packages, and home sample collection.",
  keywords: [
    "pathology lab",
    "diagnostic tests",
    "blood test",
    "health packages",
    "Cutis Path Lab",
  ],
  icons: {
    icon: "/cutis.png",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Cutis Path Lab",
    title: "Cutis Path Lab",
    description:
      "Trusted diagnostic laboratory services — book tests and health packages online.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cutis Path Lab",
    description:
      "Trusted diagnostic laboratory services — book tests and health packages online.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
    >
      <body className="antialiased">{children}</body>
    </html>
  );
}
