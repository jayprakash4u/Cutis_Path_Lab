"use client";

import { useEffect, useMemo, useState } from "react";
import { adminFetch } from "@/lib/adminClient";
import AdminModal, { ConfirmDialog } from "@/components/admin/AdminModal";
import ImageField from "@/components/admin/ImageField";
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
  PageHeader,
  Skeleton,
  SuccessBox,
  inputClass,
} from "@/components/admin/ui";
import {
  SERVICE_CATEGORIES,
  resolveServiceCategory,
  serviceCategoryLabel,
} from "@/lib/serviceCategories";

const emptyForm = {
  name: "",
  category: "pathology",
  description: "",
  longDescription: "",
  iconKey: "",
  imageUrl: "",
  isActive: true,
  sortOrder: "0",
};

/* The icon resolver matches these words against the name + key, so the hint
   lists what actually maps to artwork in src/lib/serviceIcons.jsx. */
const ICON_HINT =
  "dna, baby, testTube, microscope, ribbon, blood, microbe, allergy, heart, chart";

export default function AdminServicesPage() {
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

  const load = async ({ showSkeleton = false } = {}) => {
    if (showSkeleton) setLoading(true);
    try {
      const json = await adminFetch("/api/services?active=false&limit=200");
      setRows(json.data || []);
    } catch (err) {
      setError(err.message || "Couldn't load services. Refresh to try again.");
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
    // New rows land at the end of the grid unless the admin changes it.
    const nextOrder = rows.reduce((max, r) => Math.max(max, Number(r.sortOrder) || 0), -1) + 1;
    setForm({ ...emptyForm, sortOrder: String(nextOrder) });
    setEditingId(null);
    setError("");
    setFormOpen(true);
  };

  const startEdit = (s) => {
    setEditingId(s.id);
    setForm({
      name: s.name || "",
      category: resolveServiceCategory(s),
      description: s.description || "",
      longDescription: s.longDescription || "",
      iconKey: s.iconKey || s.icon || "",
      imageUrl: s.imageUrl || s.image || "",
      isActive: s.isActive !== false,
      sortOrder: String(s.sortOrder ?? 0),
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
        name: form.name,
        category: form.category,
        description: form.description,
        longDescription: form.longDescription,
        iconKey: form.iconKey,
        imageUrl: form.imageUrl,
        isActive: form.isActive,
        sortOrder: Number(form.sortOrder) || 0,
      };
      if (editingId) {
        await adminFetch(`/api/services/${encodeURIComponent(editingId)}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
        setMessage(`Updated ${payload.name}`);
      } else {
        await adminFetch("/api/services", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setMessage(`Added ${payload.name}`);
      }
      closeForm();
      await load();
    } catch (err) {
      setError(err.message || "Couldn't save this service. Check the fields and try again.");
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!confirming) return;
    setDeleting(true);
    setError("");
    try {
      await adminFetch(`/api/services/${encodeURIComponent(confirming.id)}`, {
        method: "DELETE",
      });
      setMessage(`Deleted ${confirming.name}`);
      if (editingId === confirming.id) closeForm();
      setConfirming(null);
      await load();
    } catch (err) {
      setError(err.message || "Couldn't delete this service. Try again.");
    } finally {
      setDeleting(false);
    }
  };

  const { items, total, page: safePage } = useMemo(
    () => paginate(rows, page, ADMIN_PAGE_SIZE),
    [rows, page],
  );

  return (
    <div className="space-y-5">
      <PageHeader
        title="Services"
        description="The diagnostic disciplines listed on the public /services page."
        actions={
          <button type="button" className="admin-btn-primary" onClick={startCreate}>
            Add service
          </button>
        }
      />

      <ErrorBox message={error} />
      <SuccessBox message={message} />

      <AdminCard title={total === 1 ? "1 service" : `${total} services`}>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="space-y-2 border-b border-[var(--admin-line-soft)] pb-3">
                <Skeleton className="h-4 w-44" />
                <Skeleton className="h-3 w-full" />
              </div>
            ))}
          </div>
        ) : total === 0 ? (
          <EmptyState
            title="No services yet"
            body="Add a service to show it on the public services page."
            action={
              <button type="button" className="admin-btn-primary" onClick={startCreate}>
                Add service
              </button>
            }
          />
        ) : (
          <>
            <ul className="space-y-2.5">
              {items.map((s) => (
                <li
                  key={s.id}
                  className="flex flex-col justify-between gap-3 rounded-lg border border-[var(--admin-line)] p-3.5 sm:flex-row sm:items-start"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900">{s.name}</p>
                    <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-slate-600">
                      {s.description}
                    </p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span className="admin-pill admin-pill--confirmed">
                        {serviceCategoryLabel(resolveServiceCategory(s))}
                      </span>
                      <span>Order {s.sortOrder ?? 0}</span>
                      {s.iconKey ? <span>Icon: {s.iconKey}</span> : null}
                      {s.isActive === false ? (
                        <span className="admin-pill admin-pill--cancelled">Hidden</span>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      className="admin-btn-ghost !px-2.5 !py-1 !text-xs"
                      onClick={() => startEdit(s)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="admin-btn-danger !px-2.5 !py-1 !text-xs"
                      onClick={() => setConfirming(s)}
                    >
                      Delete
                    </button>
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

      <AdminModal
        open={formOpen}
        onClose={busy ? () => {} : closeForm}
        title={editingId ? "Edit service" : "Add service"}
        description="Fields marked * are required."
        footer={
          <>
            <button type="button" className="admin-btn-ghost" onClick={closeForm} disabled={busy}>
              Cancel
            </button>
            <BusyButton busy={busy} onClick={save}>
              {editingId ? "Save changes" : "Add service"}
            </BusyButton>
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name *">
            <input
              name="name"
              className={inputClass}
              value={form.name}
              onChange={onChange}
              data-autofocus
            />
          </Field>
          <Field label="Category" hint="Drives the filter chips on /services">
            <select
              name="category"
              className={inputClass}
              value={form.category}
              onChange={onChange}
            >
              {SERVICE_CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Icon key" hint={ICON_HINT}>
            <input
              name="iconKey"
              className={inputClass}
              value={form.iconKey}
              onChange={onChange}
            />
          </Field>
          <Field label="Sort order" hint="Lower numbers show first">
            <input
              name="sortOrder"
              type="number"
              className={inputClass}
              value={form.sortOrder}
              onChange={onChange}
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Short description" hint="Shown on the services grid card">
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
              label="Detail page copy"
              hint="Replaces the default 'About this service' paragraph. Leave blank for the generic text."
            >
              <textarea
                name="longDescription"
                rows={5}
                className={inputClass}
                value={form.longDescription}
                onChange={onChange}
              />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <ImageField
              label="Image"
              hint="Optional — the services grid uses the icon artwork."
              folder="services"
              value={form.imageUrl}
              onChange={(url) => setForm((f) => ({ ...f, imageUrl: url }))}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="flex items-center gap-2.5 text-sm text-slate-700">
              <input
                type="checkbox"
                name="isActive"
                checked={form.isActive}
                onChange={onChange}
              />
              Visible on the public site
            </label>
          </div>
        </div>
      </AdminModal>

      <ConfirmDialog
        open={Boolean(confirming)}
        onCancel={() => setConfirming(null)}
        onConfirm={remove}
        busy={deleting}
        title="Delete this service?"
        body={
          confirming
            ? `${confirming.name} will be removed from the services page. This can't be undone.`
            : ""
        }
      />
    </div>
  );
}
