"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { adminLogout, checkAdminSession } from "@/lib/adminClient";
import AdminLogo from "@/components/admin/AdminLogo";

/* Line icons, 24px grid, 1.7 stroke — quiet enough to scan, distinct in shape. */
const icons = {
  overview: "M4 13h6V4H4v9zm0 7h6v-5H4v5zm10 0h6v-9h-6v9zm0-16v5h6V4h-6z",
  bookings: "M8 2v3M16 2v3M3.5 9h17M5 5h14a1.5 1.5 0 011.5 1.5v13A1.5 1.5 0 0119 21H5a1.5 1.5 0 01-1.5-1.5v-13A1.5 1.5 0 015 5z",
  tests: "M9 2v6.5L4.5 17A2.5 2.5 0 006.7 21h10.6a2.5 2.5 0 002.2-4L15 8.5V2M8 2h8M7.5 14h9",
  packages: "M12 2.8l8 4.2v10L12 21.2 4 17V7l8-4.2zM4 7l8 4.2L20 7M12 11.2V21",
  offers: "M3.5 12.5l8-8H20v8.5l-8 8-8.5-8.5zM16 8.5h.01",
  categories: "M4 5h7v7H4V5zm9 0h7v7h-7V5zM4 14h7v5H4v-5zm9 0h7v5h-7v-5z",
  testimonials: "M20 14a2 2 0 01-2 2H8l-4 4V6a2 2 0 012-2h12a2 2 0 012 2v8z",
  referrals: "M17 20v-1.5a3.5 3.5 0 00-3.5-3.5h-5A3.5 3.5 0 005 18.5V20M11 11a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM19 11h.01M17 8.5h4",
  gallery: "M4 5h16a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V6a1 1 0 011-1zM3 16l5-4 4 3 3-2 6 4M8.5 9.5h.01",
  contact: "M4 5h16a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V6a1 1 0 011-1zM3.5 7l8.5 6 8.5-6",
  about: "M12 21a9 9 0 100-18 9 9 0 000 18zM12 11v5M12 7.5h.01",
  blog: "M5 3.5h9l5 5V20a1.5 1.5 0 01-1.5 1.5h-11A1.5 1.5 0 015 20V3.5zM14 3.5V9h5M8.5 13h7M8.5 17h4.5",
};

function NavIcon({ name }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d={icons[name]} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* Grouped by the job being done, not alphabetically — staff either work the
   queue, price the catalog, or edit what the public site shows. */
const NAV_GROUPS = [
  {
    label: "Operations",
    items: [
      { href: "/admin", label: "Overview", icon: "overview", exact: true },
      { href: "/admin/bookings", label: "Bookings", icon: "bookings" },
    ],
  },
  {
    label: "Catalog",
    items: [
      { href: "/admin/tests", label: "Tests", icon: "tests" },
      { href: "/admin/packages", label: "Packages", icon: "packages" },
      { href: "/admin/offers", label: "Offers", icon: "offers" },
      { href: "/admin/categories", label: "Categories", icon: "categories" },
    ],
  },
  {
    label: "Site content",
    items: [
      { href: "/admin/testimonials", label: "Testimonials", icon: "testimonials" },
      { href: "/admin/referrals", label: "Referral network", icon: "referrals" },
      { href: "/admin/gallery", label: "Gallery", icon: "gallery" },
      { href: "/admin/blog", label: "Blog", icon: "blog" },
      { href: "/admin/about", label: "About page", icon: "about" },
      { href: "/admin/contact", label: "Contact page", icon: "contact" },
    ],
  },
];

const ALL_ITEMS = NAV_GROUPS.flatMap((g) => g.items);

function pageTitle(pathname) {
  const hit = ALL_ITEMS.find((item) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href),
  );
  return hit?.label || "Admin";
}

export default function AdminShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const title = useMemo(() => pageTitle(pathname), [pathname]);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      const session = await checkAdminSession();
      if (cancelled) return;
      if (!session) {
        router.replace("/admin/login");
        return;
      }
      setUser(session);
      setChecking(false);
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [router, pathname]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const handleLogout = async () => {
    try {
      await adminLogout();
    } catch {
      // Session is being discarded regardless.
    }
    router.replace("/admin/login");
  };

  if (checking) {
    return (
      <div className="admin-root flex min-h-screen flex-col items-center justify-center gap-4">
        <AdminLogo href={null} size="md" priority />
        <p className="text-xs text-slate-400">Checking your session…</p>
      </div>
    );
  }

  const navLinks = (
    <nav className="px-3 pb-3">
      {NAV_GROUPS.map((group) => (
        <div key={group.label}>
          <p className="admin-nav-group">{group.label}</p>
          <div className="flex flex-col gap-0.5">
            {group.items.map((item) => {
              const active = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  data-active={active}
                  aria-current={active ? "page" : undefined}
                  className="admin-nav-link"
                >
                  <NavIcon name={item.icon} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );

  return (
    <div className="admin-root min-h-screen">
      <div className="lg:grid lg:h-screen lg:grid-cols-[248px_1fr] lg:grid-rows-[3.75rem_1fr] lg:overflow-hidden">
        {/* Logo — top-left */}
        <div className="hidden items-center border-b border-r border-[var(--admin-line)] bg-white px-5 lg:flex">
          <AdminLogo size="md" priority />
        </div>

        {/* Header */}
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b border-[var(--admin-line)] bg-white px-4 sm:px-6 lg:h-auto">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--admin-line)] text-slate-600 lg:hidden"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>

            <div className="shrink-0 lg:hidden">
              <AdminLogo size="sm" priority />
            </div>

            <h1 className="admin-display hidden truncate text-base text-slate-900 sm:block">
              {title}
            </h1>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {user?.username ? (
              <span className="mr-1 hidden text-xs text-slate-500 md:inline">
                Signed in as{" "}
                <span className="font-semibold text-slate-700">{user.username}</span>
              </span>
            ) : null}
            <Link href="/" className="admin-btn-ghost hidden sm:inline-flex">
              View site
            </Link>
            <button type="button" onClick={handleLogout} className="admin-btn-ghost">
              Sign out
            </button>
          </div>
        </header>

        {/* Sidebar */}
        <aside className="hidden flex-col overflow-hidden border-r border-[var(--admin-line)] bg-white lg:flex">
          <div className="flex-1 overflow-y-auto pt-1">{navLinks}</div>
          <div className="mt-auto border-t border-[var(--admin-line-soft)] px-5 py-3.5">
            <p className="text-[11px] leading-relaxed text-slate-400">
              Cutis Path Lab · Operations
            </p>
          </div>
        </aside>

        {/* Content */}
        <main className="min-w-0 overflow-y-auto">
          <div className="max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</div>
        </main>
      </div>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-200 lg:hidden ${
          menuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!menuOpen}
      >
        <button
          type="button"
          className="absolute inset-0 bg-slate-900/40"
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
        />
        <aside
          className={`absolute inset-y-0 left-0 flex w-[min(100%,17rem)] flex-col bg-white shadow-xl transition-transform duration-200 ease-out ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-14 items-center justify-between gap-3 border-b border-[var(--admin-line)] px-4">
            <AdminLogo size="sm" />
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--admin-line)] text-slate-600"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto pt-1">{navLinks}</div>
          <div className="space-y-2 border-t border-[var(--admin-line-soft)] px-4 py-3.5">
            {user?.username ? (
              <p className="truncate px-1 text-xs text-slate-500">{user.username}</p>
            ) : null}
            <Link
              href="/"
              className="admin-btn-ghost w-full"
              onClick={() => setMenuOpen(false)}
            >
              View site
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
