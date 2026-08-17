import { getSiteUrl } from "@/lib/siteUrl";
import "./globals.css";
import BackToTop from "@/components/ui/BackToTop";

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
    <html lang="en">
      <body className="antialiased">
        {children}
        <BackToTop />
      </body>
    </html>
  );
}
