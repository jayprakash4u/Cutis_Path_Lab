"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { adminLogout, checkAdminSession } from "@/lib/adminClient";
import AdminLogo from "@/components/admin/AdminLogo";

const NAV = [
  { href: "/admin", label: "Overview", exact: true },
  { href: "/admin/bookings", label: "Bookings" },
  { href: "/admin/tests", label: "Tests" },
  { href: "/admin/packages", label: "Packages" },
  { href: "/admin/offers", label: "Offers" },
  { href: "/admin/testimonials", label: "Testimonials" },
  { href: "/admin/referrals", label: "Referral Network" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/gallery", label: "Gallery" },
];

function pageTitle(pathname) {
  const hit = NAV.find((item) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href)
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
      // ignore
    }
    router.replace("/admin/login");
  };

  if (checking) {
    return (
      <div className="admin-root flex min-h-screen items-center justify-center">
        <AdminLogo href={null} size="md" priority />
      </div>
    );
  }

  const navLinks = (
    <nav className="flex flex-col gap-0.5 px-3 py-2">
      {NAV.map((item) => {
        const active = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMenuOpen(false)}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
              active
                ? "bg-sky-50 text-sky-800"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <span
              className={`h-5 w-1 shrink-0 rounded-full ${
                active ? "bg-[#FF6B6B]" : "bg-transparent"
              }`}
            />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="admin-root min-h-screen">
      {/*
        Senior sketch layout:
        ┌────────┬─────────────────┐
        │ Logo   │ Header          │
        ├────────┼─────────────────┤
        │ Nav    │ Content         │
        └────────┴─────────────────┘
      */}
      <div className="lg:grid lg:grid-cols-[260px_1fr] lg:grid-rows-[4.25rem_1fr] lg:h-screen lg:overflow-hidden">
        {/* Logo — top-left */}
        <div className="hidden lg:flex items-center px-5 border-b border-r border-slate-200 bg-white">
          <AdminLogo size="md" priority />
        </div>

        {/* Header — top-right (full width on mobile) */}
        <header className="sticky top-0 z-30 flex h-16 lg:h-auto items-center justify-between gap-3 border-b border-slate-200 bg-white/95 backdrop-blur-md px-4 sm:px-6">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              className="lg:hidden shrink-0 flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className="lg:hidden shrink-0">
              <AdminLogo size="sm" priority />
            </div>

            <div className="min-w-0 hidden sm:block">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-700">
                Admin panel
              </p>
              <h1 className="admin-display text-lg sm:text-xl text-slate-900 truncate leading-tight">
                {title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="hidden md:flex flex-col items-end mr-1">
              <span className="text-xs font-semibold text-slate-800">{user?.username}</span>
              <span className="text-[10px] text-slate-400">Staff session</span>
            </div>
            <Link
              href="/"
              className="hidden sm:inline-flex px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:border-sky-300 hover:text-sky-700 transition-colors"
            >
              View site
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-white bg-[#FF6B6B] hover:bg-[#e55a5a] transition-colors"
            >
              Sign out
            </button>
          </div>
        </header>

        {/* Sidebar — under logo */}
        <aside className="hidden lg:flex flex-col border-r border-slate-200 bg-white overflow-hidden">
          <p className="px-6 pt-5 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            Menu
          </p>
          <div className="flex-1 overflow-y-auto">{navLinks}</div>
          <div className="mt-auto border-t border-slate-100 px-5 py-4">
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Cutis Path Lab · Operations
            </p>
          </div>
        </aside>

        {/* Content — under header */}
        <main className="min-w-0 overflow-y-auto bg-transparent">
          <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-6xl">{children}</div>
        </main>
      </div>

      {/* Mobile drawer */}
      <div
        className={`lg:hidden fixed inset-0 z-50 transition-opacity duration-300 ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
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
          className={`absolute inset-y-0 left-0 w-[min(100%,18rem)] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 h-16">
            <AdminLogo size="sm" />
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto pt-2">{navLinks}</div>
          <div className="border-t border-slate-100 px-4 py-4 space-y-2">
            <p className="px-1 text-xs text-slate-500 truncate">{user?.username}</p>
            <Link
              href="/"
              className="flex items-center justify-center w-full rounded-xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-700"
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
