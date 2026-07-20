"use client";

import { useEffect, useMemo, useState } from "react";
import { adminFetch } from "@/lib/adminClient";
import AdminPagination, {
  ADMIN_PAGE_SIZE,
  paginate,
} from "@/components/admin/AdminPagination";
import {
  AdminCard,
  ErrorBox,
  PageHeader,
  StatusPill,
  SuccessBox,
  inputClass,
} from "@/components/admin/ui";

const STATUSES = ["pending", "confirmed", "done", "cancelled"];

export default function AdminBookingsPage() {
  const [rows, setRows] = useState([]);
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const json = await adminFetch("/api/bookings");
      setRows(json.data || []);
    } catch (err) {
      setError(err.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [filter]);

  const updateStatus = async (id, status) => {
    setMessage("");
    setError("");
    try {
      await adminFetch(`/api/bookings/${encodeURIComponent(id)}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      setMessage(`Marked as ${status}`);
      await load();
    } catch (err) {
      setError(err.message || "Failed to update status");
    }
  };

  const filtered = useMemo(
    () => (filter === "all" ? rows : rows.filter((r) => r.status === filter)),
    [rows, filter],
  );
  const { items, total, page: safePage } = paginate(filtered, page, ADMIN_PAGE_SIZE);

  return (
    <div className="space-y-4">
      <PageHeader
        title="Bookings"
        description="Call the patient from the list, then move the status forward."
        actions={
          <select
            className={inputClass}
            style={{ width: "auto", minWidth: 160 }}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        }
      />

      <ErrorBox message={error} />
      <SuccessBox message={message} />

      <AdminCard title={`${total} records`}>
        {loading ? (
          <p className="text-sm text-slate-500">Loading bookings…</p>
        ) : total === 0 ? (
          <p className="text-sm text-slate-500">No bookings in this filter.</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="admin-table min-w-full">
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Schedule</th>
                    <th>Notes</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((b) => (
                    <tr key={b.id}>
                      <td>
                        <p className="font-semibold text-slate-900">{b.name}</p>
                        <a
                          href={`tel:${b.phone}`}
                          className="text-sky-700 font-semibold hover:underline"
                        >
                          {b.phone}
                        </a>
                        <p className="text-xs text-slate-500 mt-1">{b.email || "No email"}</p>
                      </td>
                      <td className="whitespace-nowrap text-slate-700">
                        <p>{b.preferredDate || "—"}</p>
                        <p className="text-slate-500">{b.preferredTime || "—"}</p>
                      </td>
                      <td className="max-w-xs">
                        <p className="text-slate-700 leading-relaxed">{b.notes || "—"}</p>
                        <p className="text-[11px] text-slate-400 mt-2 tracking-wide">
                          TEST {b.testId || "—"} · PKG {b.packageId || "—"} · OFFER {b.offerId || "—"}
                        </p>
                      </td>
                      <td>
                        <div className="space-y-2">
                          <StatusPill status={b.status || "pending"} />
                          <select
                            className={inputClass}
                            value={b.status || "pending"}
                            onChange={(e) => updateStatus(b.id, e.target.value)}
                          >
                            {STATUSES.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
