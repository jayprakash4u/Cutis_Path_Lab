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
  PageHeader,
  Skeleton,
  SuccessBox,
  inputClass,
} from "@/components/admin/ui";

const emptyForm = {
  name: "",
  role: "Patient",
  content: "",
  rating: "5",
  imageUrl: "",
  featured: true,
  isActive: true,
  sortOrder: "0",
};

function Stars({ rating }) {
  return (
    <span className="text-amber-500" aria-label={`${rating} out of 5`}>
      {"★".repeat(Math.max(0, Math.min(5, Number(rating) || 0)))}
      <span className="text-slate-200">
        {"★".repeat(5 - Math.max(0, Math.min(5, Number(rating) || 0)))}
      </span>
    </span>
  );
}

export default function AdminTestimonialsPage() {
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

  const load = async () => {
    setLoading(true);
    try {
      const json = await adminFetch("/api/testimonials?active=false");
      setRows(json.data || []);
    } catch (err) {
      setError(err.message || "Couldn't load testimonials. Refresh to try again.");
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
      name: t.name || "",
      role: t.role || "Patient",
      content: t.content || "",
      rating: String(t.rating ?? 5),
      imageUrl: t.image || t.imageUrl || "",
      featured: t.featured !== false,
      isActive: t.isActive !== false,
      sortOrder: String(t.sortOrder ?? 0),
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
        role: form.role,
        content: form.content,
        rating: Number(form.rating) || 5,
        imageUrl: form.imageUrl,
        featured: form.featured,
        isActive: form.isActive,
        sortOrder: Number(form.sortOrder) || 0,
      };
      if (editingId) {
        await adminFetch(`/api/testimonials/${encodeURIComponent(editingId)}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
        setMessage(`Updated ${payload.name}'s review`);
      } else {
        await adminFetch("/api/testimonials", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setMessage(`Added ${payload.name}'s review`);
      }
      closeForm();
      await load();
    } catch (err) {
      setError(err.message || "Couldn't save this testimonial. Check the fields and try again.");
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!confirming) return;
    setDeleting(true);
    setError("");
    try {
      await adminFetch(`/api/testimonials/${encodeURIComponent(confirming.id)}`, {
        method: "DELETE",
      });
      setMessage(`Deleted ${confirming.name}'s review`);
      if (editingId === confirming.id) closeForm();
      setConfirming(null);
      await load();
    } catch (err) {
      setError(err.message || "Couldn't delete this testimonial. Try again.");
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
        title="Testimonials"
        description="Patient reviews shown in the homepage feedback carousel."
        actions={
          <button type="button" className="admin-btn-primary" onClick={startCreate}>
            Add testimonial
          </button>
        }
      />

      <ErrorBox message={error} />
      <SuccessBox message={message} />

      <AdminCard title={total === 1 ? "1 testimonial" : `${total} testimonials`}>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2 border-b border-[var(--admin-line-soft)] pb-3">
                <Skeleton className="h-4 w-44" />
                <Skeleton className="h-3 w-full" />
              </div>
            ))}
          </div>
        ) : total === 0 ? (
          <EmptyState
            title="No testimonials yet"
            body="Add a patient review to show it on the homepage."
            action={
              <button type="button" className="admin-btn-primary" onClick={startCreate}>
                Add testimonial
              </button>
            }
          />
        ) : (
          <>
            <ul className="space-y-2.5">
              {items.map((t) => (
                <li
                  key={t.id}
                  className="flex flex-col justify-between gap-3 rounded-lg border border-[var(--admin-line)] p-3.5 sm:flex-row sm:items-start"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900">
                      {t.name}
                      {t.role ? (
                        <span className="ml-1.5 text-xs font-normal text-slate-500">
                          {t.role}
                        </span>
                      ) : null}
                    </p>
                    <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-slate-600">
                      {t.content}
                    </p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs">
                      <Stars rating={t.rating} />
                      {t.featured !== false ? (
                        <span className="admin-pill admin-pill--confirmed">Featured</span>
                      ) : null}
                      {t.isActive === false ? (
                        <span className="admin-pill admin-pill--cancelled">Hidden</span>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      className="admin-btn-ghost !px-2.5 !py-1 !text-xs"
                      onClick={() => startEdit(t)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="admin-btn-danger !px-2.5 !py-1 !text-xs"
                      onClick={() => setConfirming(t)}
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
        title={editingId ? "Edit testimonial" : "Add testimonial"}
        description="Fields marked * are required."
        footer={
          <>
            <button type="button" className="admin-btn-ghost" onClick={closeForm} disabled={busy}>
              Cancel
            </button>
            <BusyButton busy={busy} onClick={save}>
              {editingId ? "Save changes" : "Add testimonial"}
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
          <Field label="Role" hint="e.g. Patient, Physician">
            <input name="role" className={inputClass} value={form.role} onChange={onChange} />
          </Field>
          <Field label="Rating">
            <input
              name="rating"
              type="number"
              min="1"
              max="5"
              className={inputClass}
              value={form.rating}
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
            <Field label="Photo URL">
              <input
                name="imageUrl"
                className={inputClass}
                value={form.imageUrl}
                onChange={onChange}
              />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="Review *">
              <textarea
                name="content"
                rows={4}
                className={inputClass}
                value={form.content}
                onChange={onChange}
              />
            </Field>
          </div>
          <div className="flex flex-col gap-2.5 sm:col-span-2">
            <label className="flex items-center gap-2.5 text-sm text-slate-700">
              <input
                type="checkbox"
                name="featured"
                checked={form.featured}
                onChange={onChange}
              />
              Feature in the homepage carousel
            </label>
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
        title="Delete this testimonial?"
        body={
          confirming
            ? `${confirming.name}'s review will be removed from the site. This can't be undone.`
            : ""
        }
      />
    </div>
  );
}
