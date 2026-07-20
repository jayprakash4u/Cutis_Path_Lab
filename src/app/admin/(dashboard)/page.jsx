"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/adminClient";
import { AdminCard, ErrorBox, PageHeader, StatusPill } from "@/components/admin/ui";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    bookings: 0,
    pending: 0,
    confirmed: 0,
    tests: 0,
    packages: 0,
    offers: 0,
  });
  const [recent, setRecent] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [bookings, tests, packages, offers] = await Promise.all([
          adminFetch("/api/bookings"),
          adminFetch("/api/tests"),
          adminFetch("/api/packages"),
          adminFetch("/api/offers?active=false"),
        ]);
        if (cancelled) return;
        const bookingList = bookings.data || [];
        setStats({
          bookings: bookingList.length,
          pending: bookingList.filter((b) => b.status === "pending").length,
          confirmed: bookingList.filter((b) => b.status === "confirmed").length,
          tests: (tests.data || []).length,
          packages: (packages.data || []).length,
          offers: (offers.data || []).length,
        });
        setRecent(bookingList.slice(0, 5));
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to load dashboard");
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Overview"
        description="Start with what needs a phone call, then keep the catalog current."
        actions={
          <Link href="/admin/bookings" className="admin-btn-primary">
            Open bookings
          </Link>
        }
      />

      <ErrorBox message={error} />

      <section className="admin-panel admin-animate p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-sky-200/40 blur-2xl pointer-events-none" />
        <div className="relative grid md:grid-cols-[1.2fr_0.8fr] gap-8 items-end">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#FF6B6B] mb-3">
              Needs attention
            </p>
            <p className="admin-display text-5xl sm:text-6xl text-slate-900 leading-none">
              {stats.pending}
            </p>
            <p className="mt-3 text-slate-600 text-sm sm:text-base max-w-md leading-relaxed">
              Pending bookings waiting for confirmation. Call the patient, then mark status.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-white/80 border border-slate-200/80 p-4">
              <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500 font-semibold">
                Confirmed
              </p>
              <p className="admin-display text-3xl mt-2 text-sky-700">{stats.confirmed}</p>
            </div>
            <div className="rounded-2xl bg-white/80 border border-slate-200/80 p-4">
              <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500 font-semibold">
                All bookings
              </p>
              <p className="admin-display text-3xl mt-2 text-slate-800">{stats.bookings}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: "Tests in catalog", value: stats.tests, href: "/admin/tests" },
          { label: "Packages", value: stats.packages, href: "/admin/packages" },
          { label: "Active offers", value: stats.offers, href: "/admin/offers" },
        ].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="admin-panel admin-animate px-5 py-5 hover:-translate-y-0.5 transition-transform duration-200 block"
          >
            <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500 font-semibold">
              {item.label}
            </p>
            <p className="admin-display text-3xl text-slate-900 mt-3">{item.value}</p>
            <p className="text-xs text-sky-700 font-semibold mt-3">Manage →</p>
          </Link>
        ))}
      </div>

      <AdminCard
        title="Latest bookings"
        actions={
          <Link href="/admin/bookings" className="text-sm font-semibold text-sky-700 hover:underline">
            View all
          </Link>
        }
      >
        {recent.length === 0 ? (
          <p className="text-sm text-slate-500">No bookings yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="admin-table min-w-full">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Phone</th>
                  <th>When</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((b) => (
                  <tr key={b.id}>
                    <td className="font-semibold text-slate-900">{b.name}</td>
                    <td>
                      <a href={`tel:${b.phone}`} className="text-sky-700 font-medium hover:underline">
                        {b.phone}
                      </a>
                    </td>
                    <td className="text-slate-600">
                      {b.preferredDate || "—"}
                      <span className="text-slate-400"> · </span>
                      {b.preferredTime || "—"}
                    </td>
                    <td>
                      <StatusPill status={b.status || "pending"} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminCard>
    </div>
  );
}
