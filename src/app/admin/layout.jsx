import "./admin.css";

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
  return <div className="admin-app">{children}</div>;
}
