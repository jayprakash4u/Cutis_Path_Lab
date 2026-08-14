"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/adminClient";
import {
  AdminCard,
  EmptyState,
  ErrorBox,
  Mono,
  PageHeader,
  Skeleton,
  SuccessBox,
} from "@/components/admin/ui";

const EMPTY_STATS = {
  bookings: 0,
  pending: 0,
  confirmed: 0,
  done: 0,
  tests: 0,
  packages: 0,
  offers: 0,
};

function StatTile({ label, value, tone = "ink", loading }) {
  const toneClass = {
    urgent: "text-[var(--admin-pending)]",
    sky: "text-[var(--admin-sky)]",
    done: "text-[var(--admin-done)]",
    ink: "text-slate-900",
  }[tone];

  return (
    <div className="admin-panel px-4 py-3.5">
      <p className="admin-eyebrow">{label}</p>
      {loading ? (
        <Skeleton className="mt-2 h-7 w-12" />
      ) : (
        <p className={`admin-mono mt-1.5 text-2xl font-semibold ${toneClass}`}>{value}</p>
      )}
    </div>
  );
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(EMPTY_STATS);
  const [queue, setQueue] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  const load = async () => {
    try {
      setError("");
      const [bookings, tests, packages, offers] = await Promise.all([
        adminFetch("/api/bookings"),
        adminFetch("/api/tests"),
        adminFetch("/api/packages"),
        adminFetch("/api/offers?active=false"),
      ]);

      const list = bookings.data || [];
      setStats({
        bookings: list.length,
        pending: list.filter((b) => b.status === "pending").length,
        confirmed: list.filter((b) => b.status === "confirmed").length,
        done: list.filter((b) => b.status === "done").length,
        tests: (tests.data || []).length,
        packages: (packages.data || []).length,
        offers: (offers.data || []).length,
      });
      setQueue(list.filter((b) => b.status === "pending").slice(0, 6));
    } catch (err) {
      setError(err.message || "Couldn't load the dashboard. Refresh to try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const confirm = async (booking) => {
    setBusyId(booking.id);
    setError("");
    try {
      await adminFetch(`/api/bookings/${encodeURIComponent(booking.id)}`, {
        method: "PATCH",
        body: JSON.stringify({ status: "confirmed" }),
      });
      setMessage(`Confirmed ${booking.name}`);
      await load();
    } catch (err) {
      setError(err.message || "Couldn't update that booking. Try again.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Overview"
        description="Work the call queue first, then keep the catalog current."
        actions={
          <Link href="/admin/bookings" className="admin-btn-ghost">
            All bookings
          </Link>
        }
      />

      <ErrorBox message={error} />
      <SuccessBox message={message} />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile label="Needs a call" value={stats.pending} tone="urgent" loading={loading} />
        <StatTile label="Confirmed" value={stats.confirmed} tone="sky" loading={loading} />
        <StatTile label="Completed" value={stats.done} tone="done" loading={loading} />
        <StatTile label="All bookings" value={stats.bookings} loading={loading} />
      </div>

      <AdminCard
        title="Needs a call"
        subtitle="Pending bookings, oldest first"
        className="admin-panel--lead"
        actions={
          <Link href="/admin/bookings" className="text-xs font-semibold text-[var(--admin-sky)] hover:underline">
            View all
          </Link>
        }
      >
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-28" />
                </div>
                <Skeleton className="h-8 w-24" />
              </div>
            ))}
          </div>
        ) : queue.length === 0 ? (
          <EmptyState
            title="No calls waiting"
            body="Every booking has been confirmed or closed. New requests will appear here as they come in."
          />
        ) : (
          <ul className="divide-y divide-[var(--admin-line-soft)]">
            {queue.map((b) => (
              <li
                key={b.id}
                className="admin-rail admin-rail--pending flex flex-col gap-3 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-900">{b.name}</p>
                  <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm text-slate-500">
                    <a
                      href={`tel:${b.phone}`}
                      className="admin-mono font-medium text-[var(--admin-sky)] hover:underline"
                    >
                      {b.phone}
                    </a>
                    <span className="text-slate-300">·</span>
                    <Mono className="text-xs text-slate-500">
                      {b.preferredDate || "no date"} {b.preferredTime || ""}
                    </Mono>
                  </p>
                  {b.notes ? (
                    <p className="mt-1 line-clamp-1 text-xs text-slate-400">{b.notes}</p>
                  ) : null}
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <a href={`tel:${b.phone}`} className="admin-btn-ghost">
                    Call
                  </a>
                  <button
                    type="button"
                    onClick={() => confirm(b)}
                    disabled={busyId === b.id}
                    className="admin-btn-primary"
                  >
                    {busyId === b.id ? "Confirming…" : "Confirm"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </AdminCard>

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { label: "Tests", value: stats.tests, href: "/admin/tests" },
          { label: "Packages", value: stats.packages, href: "/admin/packages" },
          { label: "Offers", value: stats.offers, href: "/admin/offers" },
        ].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="admin-panel group flex items-center justify-between px-4 py-3.5 transition-colors hover:border-[#c6d9ea]"
          >
            <div>
              <p className="admin-eyebrow">{item.label}</p>
              {loading ? (
                <Skeleton className="mt-2 h-6 w-10" />
              ) : (
                <p className="admin-mono mt-1.5 text-xl font-semibold text-slate-900">
                  {item.value}
                </p>
              )}
            </div>
            <span className="text-xs font-semibold text-[var(--admin-sky)] group-hover:underline">
              Manage
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
