"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminFetch } from "@/lib/adminClient";
import {
  AdminCard,
  BusyButton,
  ErrorBox,
  PageHeader,
  Skeleton,
  SuccessBox,
} from "@/components/admin/ui";
import { getHomeSection } from "@/lib/homeSections";

/**
 * Running order of the landing page. Each row opens its own editor; this screen
 * only decides what appears and in what order.
 */
export default function AdminHomePage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const load = async () => {
    try {
      const json = await adminFetch("/api/home-sections?active=false");
      setRows(json.data || []);
      setDirty(false);
    } catch (err) {
      setError(err.message || "Couldn't load the home page sections.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const move = (index, delta) => {
    const target = index + delta;
    if (target < 0 || target >= rows.length) return;
    const next = [...rows];
    [next[index], next[target]] = [next[target], next[index]];
    setRows(next.map((row, i) => ({ ...row, sortOrder: i })));
    setDirty(true);
  };

  const toggle = (key) => {
    setRows((prev) =>
      prev.map((row) => (row.key === key ? { ...row, isActive: !row.isActive } : row)),
    );
    setDirty(true);
  };

  const save = async () => {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await adminFetch("/api/home-sections", {
        method: "PATCH",
        body: JSON.stringify({
          sections: rows.map((row, i) => ({
            key: row.key,
            sortOrder: i,
            isActive: row.isActive,
          })),
        }),
      });
      setMessage("Home page order saved");
      await load();
    } catch (err) {
      setError(err.message || "Couldn't save the order. Try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Home page"
        title="Sections"
        description="The running order of the landing page. Open a section to edit its copy and cards."
        actions={
          <>
            <Link href="/" className="admin-btn-ghost" target="_blank">
              View home page
            </Link>
            <BusyButton busy={busy} onClick={save} disabled={!dirty}>
              Save order
            </BusyButton>
          </>
        }
      />

      <ErrorBox message={error} />
      <SuccessBox message={message} />

      <AdminCard title={`${rows.length} sections`}>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : (
          <ol className="space-y-2.5">
            {rows.map((row, index) => {
              const config = getHomeSection(row.key);
              return (
                <li
                  key={row.key}
                  className="flex flex-col justify-between gap-3 rounded-lg border border-[var(--admin-line)] p-3.5 sm:flex-row sm:items-center"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <span className="admin-mono mt-0.5 w-6 shrink-0 text-xs text-slate-400">
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900">
                        {config?.label || row.label || row.key}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {config?.description || row.title}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-wrap items-center gap-2">
                    <label className="mr-1 flex items-center gap-2 text-xs text-slate-600">
                      <input
                        type="checkbox"
                        checked={row.isActive !== false}
                        onChange={() => toggle(row.key)}
                      />
                      Visible
                    </label>
                    <button
                      type="button"
                      className="admin-btn-ghost !px-2.5 !py-1 !text-xs"
                      onClick={() => move(index, -1)}
                      disabled={index === 0}
                      aria-label={`Move ${row.key} up`}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      className="admin-btn-ghost !px-2.5 !py-1 !text-xs"
                      onClick={() => move(index, 1)}
                      disabled={index === rows.length - 1}
                      aria-label={`Move ${row.key} down`}
                    >
                      ↓
                    </button>
                    <Link
                      href={`/admin/home/${row.key}`}
                      className="admin-btn-ghost !px-2.5 !py-1 !text-xs"
                    >
                      Edit
                    </Link>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </AdminCard>
    </div>
  );
}
