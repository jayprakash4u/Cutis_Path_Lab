import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import "./admin.css";

/**
 * IBM Plex was drawn for technical and institutional interfaces, which is
 * the register this console needs — the public site keeps its own type.
 * Self-hosted through next/font so there's no render-blocking font request.
 */
const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex-sans",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata = {
  title: {
    default: "Admin · Cutis Path Lab",
    template: "%s · Admin · Cutis Path Lab",
  },
  description: "Cutis Path Lab staff operations panel",
  robots: {
    index: false,
    follow: false,
  },
};

/**
 * Dedicated admin tree — separate from the public site chrome.
 * Nested route groups:
 * - (auth) → login (no shell)
 * - (dashboard) → authenticated AdminShell
 */
export default function AdminRootLayout({ children }) {
  return (
    <div className={`admin-app ${plexSans.variable} ${plexMono.variable}`}>
      {children}
    </div>
  );
}
