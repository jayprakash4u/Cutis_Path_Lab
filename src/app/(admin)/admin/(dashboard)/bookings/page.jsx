"use client";

import { useEffect, useMemo, useState } from "react";
import { adminFetch } from "@/lib/adminClient";
import AdminPagination, {
  ADMIN_PAGE_SIZE,
  paginate,
} from "@/components/admin/AdminPagination";
import {
  AdminCard,
  EmptyState,
  ErrorBox,
  Mono,
  PageHeader,
  StatusPill,
  SuccessBox,
  TableSkeleton,
  inputClass,
} from "@/components/admin/ui";

const STATUSES = ["pending", "confirmed", "done", "cancelled"];

const STATUS_LABEL = {
  pending: "Pending",
  confirmed: "Confirmed",
  done: "Done",
  cancelled: "Cancelled",
};

/** Only render a reference chip when the booking actually has one. */
function LinkedRefs({ booking }) {
  const refs = [
    booking.testId ? { kind: "Test", id: booking.testId } : null,
    booking.packageId ? { kind: "Package", id: booking.packageId } : null,
    booking.offerId ? { kind: "Offer", id: booking.offerId } : null,
  ].filter(Boolean);

  if (refs.length === 0) return null;

  return (
    <div className="mt-1.5 flex flex-wrap gap-1">
      {refs.map((r) => (
        <span
          key={`${r.kind}-${r.id}`}
          className="inline-flex items-center gap-1 rounded border border-[var(--admin-line)] bg-[var(--admin-subtle)] px-1.5 py-0.5 text-[0.65rem] text-slate-500"
        >
          {r.kind}
          <Mono className="text-slate-700">{r.id}</Mono>
        </span>
      ))}
    </div>
  );
}

function StatusSelect({ value, onChange, disabled }) {
  return (
    <select
      className={inputClass}
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Change booking status"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {STATUS_LABEL[s]}
        </option>
      ))}
    </select>
  );
}

export default function AdminBookingsPage() {
  const [rows, setRows] = useState([]);
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  // `loading` starts true, so the first load already shows a skeleton; only
  // explicit refreshes ask for another one.
  const load = async ({ showSkeleton = false } = {}) => {
    if (showSkeleton) setLoading(true);
    try {
      const json = await adminFetch("/api/bookings");
      setRows(json.data || []);
    } catch (err) {
      setError(err.message || "Couldn't load bookings. Refresh to try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [filter, query]);

  const updateStatus = async (booking, status) => {
    setBusyId(booking.id);
    setMessage("");
    setError("");
    try {
      await adminFetch(`/api/bookings/${encodeURIComponent(booking.id)}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      setMessage(`${booking.name} marked ${STATUS_LABEL[status].toLowerCase()}`);
      await load();
    } catch (err) {
      setError(err.message || "Couldn't update that booking. Try again.");
    } finally {
      setBusyId(null);
    }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (filter !== "all" && r.status !== filter) return false;
      if (!q) return true;
      return (
        String(r.name || "").toLowerCase().includes(q) ||
        String(r.phone || "").toLowerCase().includes(q) ||
        String(r.email || "").toLowerCase().includes(q)
      );
    });
  }, [rows, filter, query]);

  const { items, total, page: safePage } = paginate(filtered, page, ADMIN_PAGE_SIZE);
  const counts = useMemo(
    () => ({
      all: rows.length,
      ...Object.fromEntries(
        STATUSES.map((s) => [s, rows.filter((r) => r.status === s).length]),
      ),
    }),
    [rows],
  );

  return (
    <div className="space-y-5">
      <PageHeader
        title="Bookings"
        description="Call the patient, then move the booking forward."
        actions={
          <input
            type="search"
            className={inputClass}
            style={{ width: "auto", minWidth: 220 }}
            placeholder="Search name, phone, or email"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search bookings"
          />
        }
      />

      <ErrorBox message={error} />
      <SuccessBox message={message} />

      {/* Status filter — counts make the queue size visible before clicking. */}
      <div className="flex flex-wrap gap-1.5">
        {[{ key: "all", label: "All" }, ...STATUSES.map((s) => ({ key: s, label: STATUS_LABEL[s] }))].map(
          (tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setFilter(tab.key)}
              data-active={filter === tab.key}
              className="admin-nav-link !py-1.5 !text-[0.8rem]"
            >
              {tab.label}
              <Mono className="text-xs opacity-60">{counts[tab.key] ?? 0}</Mono>
            </button>
          ),
        )}
      </div>

      <AdminCard title={total === 1 ? "1 booking" : `${total} bookings`}>
        {loading ? (
          <TableSkeleton rows={5} cols={4} />
        ) : total === 0 ? (
          <EmptyState
            title={query || filter !== "all" ? "Nothing matches this view" : "No bookings yet"}
            body={
              query || filter !== "all"
                ? "Clear the search or pick another status to see more."
                : "Bookings made on the public site land here."
            }
          />
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Schedule</th>
                    <th>Notes</th>
                    <th className="w-44">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((b) => (
                    <tr key={b.id}>
                      <td>
                        <div className={`admin-rail admin-rail--${b.status || "pending"}`}>
                          <p className="font-semibold text-slate-900">{b.name}</p>
                          <a
                            href={`tel:${b.phone}`}
                            className="admin-mono text-sm font-medium text-[var(--admin-sky)] hover:underline"
                          >
                            {b.phone}
                          </a>
                          <p className="mt-0.5 text-xs text-slate-400">{b.email || "No email"}</p>
                        </div>
                      </td>
                      <td className="whitespace-nowrap">
                        <Mono className="block text-sm text-slate-700">
                          {b.preferredDate || "—"}
                        </Mono>
                        <Mono className="block text-xs text-slate-500">
                          {b.preferredTime || "—"}
                        </Mono>
                      </td>
                      <td className="max-w-xs">
                        <p className="leading-relaxed text-slate-600">{b.notes || "—"}</p>
                        <LinkedRefs booking={b} />
                      </td>
                      <td>
                        <div className="space-y-2">
                          <StatusPill status={b.status || "pending"} />
                          <StatusSelect
                            value={b.status || "pending"}
                            disabled={busyId === b.id}
                            onChange={(v) => updateStatus(b, v)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards — a 4-column table can't be read on a phone. */}
            <ul className="space-y-3 md:hidden">
              {items.map((b) => (
                <li
                  key={b.id}
                  className={`admin-rail admin-rail--${b.status || "pending"} rounded-lg border border-[var(--admin-line)] p-3.5`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-900">{b.name}</p>
                      <a
                        href={`tel:${b.phone}`}
                        className="admin-mono text-sm font-medium text-[var(--admin-sky)]"
                      >
                        {b.phone}
                      </a>
                    </div>
                    <StatusPill status={b.status || "pending"} />
                  </div>

                  <Mono className="mt-2 block text-xs text-slate-500">
                    {b.preferredDate || "—"} · {b.preferredTime || "—"}
                  </Mono>

                  {b.notes ? (
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{b.notes}</p>
                  ) : null}
                  <LinkedRefs booking={b} />

                  <div className="mt-3 flex items-center gap-2">
                    <a href={`tel:${b.phone}`} className="admin-btn-ghost">
                      Call
                    </a>
                    <div className="flex-1">
                      <StatusSelect
                        value={b.status || "pending"}
                        disabled={busyId === b.id}
                        onChange={(v) => updateStatus(b, v)}
                      />
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <AdminPagination
              page={safePage}
              pageSize={ADMIN_PAGE_SIZE}
              total={total}
              onPageChange={setPage}
            />
          </>
        )}
      </AdminCard>
    </div>
  );
}
