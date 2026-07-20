"use client";

import { useEffect, useMemo, useState } from "react";
import { adminFetch } from "@/lib/adminClient";
import AdminPagination, {
  ADMIN_PAGE_SIZE,
  paginate,
} from "@/components/admin/AdminPagination";
import {
  AdminCard,
  BusyButton,
  ErrorBox,
  Field,
  PageHeader,
  SuccessBox,
  inputClass,
} from "@/components/admin/ui";

const emptyForm = {
  code: "",
  name: "",
  category: "",
  price: "",
  originalPrice: "",
  description: "",
  sampleType: "Blood",
  reportTime: "24-48 hrs",
  fastingRequired: false,
  popular: false,
  iconUrl: "",
};

export default function AdminTestsPage() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const json = await adminFetch("/api/tests");
      setRows(json.data || []);
    } catch (err) {
      setError(err.message || "Failed to load tests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const reset = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const startEdit = (t) => {
    setEditingId(t.id);
    setForm({
      code: t.code || "",
      name: t.name || "",
      category: t.category || "",
      price: t.price ?? "",
      originalPrice: t.originalPrice ?? "",
      description: t.description || "",
      sampleType: t.sampleType || "Blood",
      reportTime: t.reportTime || "24-48 hrs",
      fastingRequired: Boolean(t.fastingRequired),
      popular: Boolean(t.popular),
      iconUrl: t.iconUrl || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const save = async () => {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        originalPrice: form.originalPrice === "" ? null : Number(form.originalPrice),
      };
      if (editingId) {
        await adminFetch(`/api/tests/${encodeURIComponent(editingId)}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
        setMessage("Test updated");
      } else {
        await adminFetch("/api/tests", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setMessage("Test created");
      }
      reset();
      await load();
    } catch (err) {
      setError(err.message || "Save failed");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this test?")) return;
    setError("");
    try {
      await adminFetch(`/api/tests/${encodeURIComponent(id)}`, { method: "DELETE" });
      setMessage("Test deleted");
      if (editingId === id) reset();
      await load();
    } catch (err) {
      setError(err.message || "Delete failed");
    }
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((t) => {
      const haystack = [t.code, t.name, t.category, t.id, t.description]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [rows, search]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const { items, total, page: safePage } = paginate(filtered, page, ADMIN_PAGE_SIZE);

  return (
    <div className="space-y-4">
      <PageHeader
        title="Tests"
        description="Catalog tests appear on the public site and booking flows."
      />

      <ErrorBox message={error} />
      <SuccessBox message={message} />

      <AdminCard title={editingId ? `Edit test (${editingId})` : "Add test"}>
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Code *">
            <input name="code" className={inputClass} value={form.code} onChange={onChange} disabled={Boolean(editingId)} />
          </Field>
          <Field label="Name *">
            <input name="name" className={inputClass} value={form.name} onChange={onChange} />
          </Field>
          <Field label="Category *">
            <input name="category" className={inputClass} value={form.category} onChange={onChange} />
          </Field>
          <Field label="Price *">
            <input name="price" type="number" className={inputClass} value={form.price} onChange={onChange} />
          </Field>
          <Field label="Original price">
            <input name="originalPrice" type="number" className={inputClass} value={form.originalPrice} onChange={onChange} />
          </Field>
          <Field label="Sample type">
            <input name="sampleType" className={inputClass} value={form.sampleType} onChange={onChange} />
          </Field>
          <Field label="Report time">
            <input name="reportTime" className={inputClass} value={form.reportTime} onChange={onChange} />
          </Field>
          <Field label="Icon URL">
            <input name="iconUrl" className={inputClass} value={form.iconUrl} onChange={onChange} />
          </Field>
          <Field label="Description">
            <textarea name="description" rows={3} className={inputClass} value={form.description} onChange={onChange} />
          </Field>
          <div className="flex flex-col gap-2 justify-end">
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" name="popular" checked={form.popular} onChange={onChange} />
              Popular (show on homepage)
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" name="fastingRequired" checked={form.fastingRequired} onChange={onChange} />
              Fasting required
            </label>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <BusyButton busy={busy} onClick={save}>
            {editingId ? "Update test" : "Create test"}
          </BusyButton>
          {editingId && (
            <button type="button" onClick={reset} className="px-4 py-2 rounded-lg text-sm border border-slate-200">
              Cancel
            </button>
          )}
        </div>
      </AdminCard>

      <AdminCard
        title={`All tests (${total}${search.trim() ? ` of ${rows.length}` : ""})`}
        actions={
          <div className="flex items-center gap-2 w-full sm:w-auto sm:min-w-[280px]">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, code, category…"
              className={inputClass}
              aria-label="Search tests"
            />
            {search.trim() ? (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="shrink-0 px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 bg-white hover:border-sky-300"
              >
                Clear
              </button>
            ) : null}
          </div>
        }
      >
        {loading ? (
          <p className="text-sm text-slate-500">Loading…</p>
        ) : total === 0 ? (
          <p className="text-sm text-slate-500">
            {search.trim()
              ? `No tests match “${search.trim()}”.`
              : "No tests found."}
          </p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="admin-table min-w-full">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Popular</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((t) => (
                    <tr key={t.id} className="border-b border-slate-100">
                      <td className="py-2 pr-3 font-mono text-xs">{t.code}</td>
                      <td className="py-2 pr-3">{t.name}</td>
                      <td className="py-2 pr-3">{t.category}</td>
                      <td className="py-2 pr-3">₹{t.price}</td>
                      <td className="py-2 pr-3">{t.popular ? "Yes" : "No"}</td>
                      <td className="py-2 space-x-2 whitespace-nowrap">
                        <button type="button" className="text-sky-600 font-semibold" onClick={() => startEdit(t)}>
                          Edit
                        </button>
                        <button type="button" className="text-red-600 font-semibold" onClick={() => remove(t.id)}>
                          Delete
                        </button>
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
