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
  imageUrl: "",
  reportsTime: "24-48 hrs",
  fasting: "10-12 hrs",
  sampleType: "Blood",
  includesText: "",
};

export default function AdminPackagesPage() {
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

  // `loading` starts true, so the first load already shows a skeleton; only
  // explicit refreshes ask for another one.
  const load = async ({ showSkeleton = false } = {}) => {
    if (showSkeleton) setLoading(true);
    try {
      const json = await adminFetch("/api/packages");
      setRows(json.data || []);
    } catch (err) {
      setError(err.message || "Couldn't load packages. Refresh to try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
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

  const startEdit = (p) => {
    setEditingId(p.id);
    setForm({
      code: p.code || "",
      name: p.name || "",
      category: p.category || "",
      price: p.price ?? "",
      originalPrice: p.originalPrice ?? "",
      description: p.description || "",
      imageUrl: p.imageUrl || p.image || "",
      reportsTime: p.reportsTime || "24-48 hrs",
      fasting: p.fasting || "10-12 hrs",
      sampleType: p.sampleType || "Blood",
      includesText: (p.includes || []).join("\n"),
    });
    setError("");
    setFormOpen(true);
  };

  const save = async () => {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const includes = form.includesText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);
      const payload = {
        code: form.code,
        name: form.name,
        category: form.category,
        price: Number(form.price),
        originalPrice: form.originalPrice === "" ? null : Number(form.originalPrice),
        description: form.description,
        imageUrl: form.imageUrl,
        reportsTime: form.reportsTime,
        fasting: form.fasting,
        sampleType: form.sampleType,
        includes,
      };
      if (editingId) {
        await adminFetch(`/api/packages/${encodeURIComponent(editingId)}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
        setMessage(`Updated ${payload.name}`);
      } else {
        await adminFetch("/api/packages", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setMessage(`Added ${payload.name}`);
      }
      closeForm();
      await load();
    } catch (err) {
      setError(err.message || "Couldn't save this package. Check the fields and try again.");
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!confirming) return;
    setDeleting(true);
    setError("");
    try {
      await adminFetch(`/api/packages/${encodeURIComponent(confirming.id)}`, {
        method: "DELETE",
      });
      setMessage(`Deleted ${confirming.name}`);
      if (editingId === confirming.id) closeForm();
      setConfirming(null);
      await load();
    } catch (err) {
      setError(err.message || "Couldn't delete this package. Try again.");
    } finally {
      setDeleting(false);
    }
  };

  const { items, total, page: safePage } = useMemo(
    () => paginate(rows, page, ADMIN_PAGE_SIZE),
    [rows, page],
  );

  const includeCount = form.includesText
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean).length;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Packages"
        description="Bundled tests shown on the public packages page."
        actions={
          <button type="button" className="admin-btn-primary" onClick={startCreate}>
            Add package
          </button>
        }
      />

      <ErrorBox message={error} />
      <SuccessBox message={message} />

      <AdminCard title={total === 1 ? "1 package" : `${total} packages`}>
        {loading ? (
          <TableSkeleton rows={5} cols={5} />
        ) : total === 0 ? (
          <EmptyState
            title="No packages yet"
            body="Bundle related tests into a package to sell them together."
            action={
              <button type="button" className="admin-btn-primary" onClick={startCreate}>
                Add package
              </button>
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
                    <th>Price</th>
                    <th>Tests</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <Mono className="text-xs text-slate-500">{p.code}</Mono>
                      </td>
                      <td>
                        <p className="font-medium text-slate-900">{p.name}</p>
                        <p className="text-xs text-slate-500">{p.category}</p>
                      </td>
                      <td>
                        <Mono>₹{p.price}</Mono>
                      </td>
                      <td>
                        <Mono className="text-slate-600">{(p.includes || []).length}</Mono>
                      </td>
                      <td className="whitespace-nowrap text-right">
                        <button
                          type="button"
                          className="admin-btn-ghost !px-2.5 !py-1 !text-xs"
                          onClick={() => startEdit(p)}
                        >
                          Edit
                        </button>{" "}
                        <button
                          type="button"
                          className="admin-btn-danger !px-2.5 !py-1 !text-xs"
                          onClick={() => setConfirming(p)}
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
        title={editingId ? "Edit package" : "Add package"}
        description="Fields marked * are required."
        footer={
          <>
            <button type="button" className="admin-btn-ghost" onClick={closeForm} disabled={busy}>
              Cancel
            </button>
            <BusyButton busy={busy} onClick={save}>
              {editingId ? "Save changes" : "Add package"}
            </BusyButton>
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Code *">
            <input
              name="code"
              className={inputClass}
              value={form.code}
              onChange={onChange}
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
          <Field label="Image URL">
            <input
              name="imageUrl"
              className={inputClass}
              value={form.imageUrl}
              onChange={onChange}
            />
          </Field>
          <Field label="Report time">
            <input
              name="reportsTime"
              className={inputClass}
              value={form.reportsTime}
              onChange={onChange}
            />
          </Field>
          <Field label="Fasting">
            <input
              name="fasting"
              className={inputClass}
              value={form.fasting}
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
          <div className="sm:col-span-2">
            <Field
              label="Included tests"
              hint={`One test name per line · ${includeCount} included`}
            >
              <textarea
                name="includesText"
                rows={6}
                className={inputClass}
                value={form.includesText}
                onChange={onChange}
                placeholder={"RBC Count\nWBC Count\nHemoglobin"}
              />
            </Field>
          </div>
        </div>
      </AdminModal>

      <ConfirmDialog
        open={Boolean(confirming)}
        onCancel={() => setConfirming(null)}
        onConfirm={remove}
        busy={deleting}
        title="Delete this package?"
        body={
          confirming
            ? `“${confirming.name}” and its included test list will be removed. This can't be undone.`
            : ""
        }
      />
    </div>
  );
}
