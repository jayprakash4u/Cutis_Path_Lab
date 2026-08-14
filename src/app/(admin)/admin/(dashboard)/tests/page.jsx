"use client";

import { useEffect, useMemo, useState } from "react";
import { adminFetch } from "@/lib/adminClient";
import AdminModal, { ConfirmDialog } from "@/components/admin/AdminModal";
import AdminPagination, {
  ADMIN_PAGE_SIZE,
  paginate,
} from "@/components/admin/AdminPagination";
import {
  AdminCard,
  BusyButton,
  EmptyState,
  ErrorBox,
  Field,
  Mono,
  PageHeader,
  SuccessBox,
  TableSkeleton,
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
  const [formOpen, setFormOpen] = useState(false);
  const [confirming, setConfirming] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  // `loading` starts true, so the first load already shows a skeleton; only
  // explicit refreshes ask for another one.
  const load = async ({ showSkeleton = false } = {}) => {
    if (showSkeleton) setLoading(true);
    try {
      const json = await adminFetch("/api/tests");
      setRows(json.data || []);
    } catch (err) {
      setError(err.message || "Couldn't load tests. Refresh to try again.");
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

  const closeForm = () => {
    setFormOpen(false);
    setForm(emptyForm);
    setEditingId(null);
  };

  const startCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setError("");
    setFormOpen(true);
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
    setError("");
    setFormOpen(true);
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
        setMessage(`Updated ${payload.name}`);
      } else {
        await adminFetch("/api/tests", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setMessage(`Added ${payload.name}`);
      }
      closeForm();
      await load();
    } catch (err) {
      setError(err.message || "Couldn't save this test. Check the fields and try again.");
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!confirming) return;
    setDeleting(true);
    setError("");
    try {
      await adminFetch(`/api/tests/${encodeURIComponent(confirming.id)}`, {
        method: "DELETE",
      });
      setMessage(`Deleted ${confirming.name}`);
      if (editingId === confirming.id) closeForm();
      setConfirming(null);
      await load();
    } catch (err) {
      setError(err.message || "Couldn't delete this test. Try again.");
    } finally {
      setDeleting(false);
    }
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((t) =>
      [t.code, t.name, t.category, t.id, t.description]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [rows, search]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const { items, total, page: safePage } = paginate(filtered, page, ADMIN_PAGE_SIZE);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Tests"
        description="These appear on the public site and in the booking flow."
        actions={
          <>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, code, category"
              className={inputClass}
              style={{ width: "auto", minWidth: 220 }}
              aria-label="Search tests"
            />
            <button type="button" className="admin-btn-primary" onClick={startCreate}>
              Add test
            </button>
          </>
        }
      />

      <ErrorBox message={error} />
      <SuccessBox message={message} />

      <AdminCard
        title={total === 1 ? "1 test" : `${total} tests`}
        subtitle={search.trim() ? `Filtered from ${rows.length}` : undefined}
      >
        {loading ? (
          <TableSkeleton rows={6} cols={5} />
        ) : total === 0 ? (
          <EmptyState
            title={search.trim() ? "No tests match that search" : "No tests yet"}
            body={
              search.trim()
                ? "Try a different name, code, or category."
                : "Add your first test to show it on the public catalog."
            }
            action={
              !search.trim() ? (
                <button type="button" className="admin-btn-primary" onClick={startCreate}>
                  Add test
                </button>
              ) : null
            }
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Popular</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((t) => (
                    <tr key={t.id}>
                      <td>
                        <Mono className="text-xs text-slate-500">{t.code}</Mono>
                      </td>
                      <td className="font-medium text-slate-900">{t.name}</td>
                      <td className="text-slate-600">{t.category}</td>
                      <td>
                        <Mono>₹{t.price}</Mono>
                      </td>
                      <td>
                        {t.popular ? (
                          <span className="admin-pill admin-pill--confirmed">Popular</span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="whitespace-nowrap text-right">
                        <button
                          type="button"
                          className="admin-btn-ghost !px-2.5 !py-1 !text-xs"
                          onClick={() => startEdit(t)}
                        >
                          Edit
                        </button>{" "}
                        <button
                          type="button"
                          className="admin-btn-danger !px-2.5 !py-1 !text-xs"
                          onClick={() => setConfirming(t)}
                        >
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

      <AdminModal
        open={formOpen}
        onClose={busy ? () => {} : closeForm}
        title={editingId ? "Edit test" : "Add test"}
        description={editingId ? `Code ${form.code}` : "Fields marked * are required."}
        footer={
          <>
            <button type="button" className="admin-btn-ghost" onClick={closeForm} disabled={busy}>
              Cancel
            </button>
            <BusyButton busy={busy} onClick={save}>
              {editingId ? "Save changes" : "Add test"}
            </BusyButton>
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Code *" hint={editingId ? "Code can't be changed" : undefined}>
            <input
              name="code"
              className={inputClass}
              value={form.code}
              onChange={onChange}
              disabled={Boolean(editingId)}
              data-autofocus
            />
          </Field>
          <Field label="Name *">
            <input name="name" className={inputClass} value={form.name} onChange={onChange} />
          </Field>
          <Field label="Category *">
            <input
              name="category"
              className={inputClass}
              value={form.category}
              onChange={onChange}
            />
          </Field>
          <Field label="Price *">
            <input
              name="price"
              type="number"
              className={inputClass}
              value={form.price}
              onChange={onChange}
            />
          </Field>
          <Field label="Original price" hint="Shown struck through when higher">
            <input
              name="originalPrice"
              type="number"
              className={inputClass}
              value={form.originalPrice}
              onChange={onChange}
            />
          </Field>
          <Field label="Sample type">
            <input
              name="sampleType"
              className={inputClass}
              value={form.sampleType}
              onChange={onChange}
            />
          </Field>
          <Field label="Report time">
            <input
              name="reportTime"
              className={inputClass}
              value={form.reportTime}
              onChange={onChange}
            />
          </Field>
          <Field label="Icon URL">
            <input
              name="iconUrl"
              className={inputClass}
              value={form.iconUrl}
              onChange={onChange}
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Description">
              <textarea
                name="description"
                rows={3}
                className={inputClass}
                value={form.description}
                onChange={onChange}
              />
            </Field>
          </div>
          <div className="flex flex-col gap-2.5 sm:col-span-2">
            <label className="flex items-center gap-2.5 text-sm text-slate-700">
              <input
                type="checkbox"
                name="popular"
                checked={form.popular}
                onChange={onChange}
              />
              Show on the homepage as a popular test
            </label>
            <label className="flex items-center gap-2.5 text-sm text-slate-700">
              <input
                type="checkbox"
                name="fastingRequired"
                checked={form.fastingRequired}
                onChange={onChange}
              />
              Fasting required before sample collection
            </label>
          </div>
        </div>
      </AdminModal>

      <ConfirmDialog
        open={Boolean(confirming)}
        onCancel={() => setConfirming(null)}
        onConfirm={remove}
        busy={deleting}
        title="Delete this test?"
        body={
          confirming
            ? `“${confirming.name}” will be removed from the public catalog. This can't be undone.`
            : ""
        }
      />
    </div>
  );
}
