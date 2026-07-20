"use client";

import { useEffect, useState } from "react";
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
  name: "",
  role: "Patient",
  content: "",
  rating: "5",
  imageUrl: "",
  featured: true,
  isActive: true,
  sortOrder: "0",
};

export default function AdminTestimonialsPage() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [page, setPage] = useState(1);

  const load = async () => {
    try {
      const json = await adminFetch("/api/testimonials?active=false");
      setRows(json.data || []);
    } catch (err) {
      setError(err.message || "Failed to load testimonials");
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
      name: t.name || "",
      role: t.role || "Patient",
      content: t.content || "",
      rating: String(t.rating ?? 5),
      imageUrl: t.image || t.imageUrl || "",
      featured: t.featured !== false,
      isActive: t.isActive !== false,
      sortOrder: String(t.sortOrder ?? 0),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
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
        setMessage("Testimonial updated");
      } else {
        await adminFetch("/api/testimonials", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setMessage("Testimonial created");
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
    if (!confirm("Delete this testimonial?")) return;
    try {
      await adminFetch(`/api/testimonials/${encodeURIComponent(id)}`, { method: "DELETE" });
      setMessage("Testimonial deleted");
      if (editingId === id) reset();
      await load();
    } catch (err) {
      setError(err.message || "Delete failed");
    }
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Testimonials"
        description="Patient voices shown on the homepage feedback section."
      />
      <ErrorBox message={error} />
      <SuccessBox message={message} />

      <AdminCard title={editingId ? `Edit testimonial (${editingId})` : "Add testimonial"}>
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Name *"><input name="name" className={inputClass} value={form.name} onChange={onChange} /></Field>
          <Field label="Role"><input name="role" className={inputClass} value={form.role} onChange={onChange} /></Field>
          <Field label="Rating (1-5)"><input name="rating" type="number" min="1" max="5" className={inputClass} value={form.rating} onChange={onChange} /></Field>
          <Field label="Sort order"><input name="sortOrder" type="number" className={inputClass} value={form.sortOrder} onChange={onChange} /></Field>
          <Field label="Image URL"><input name="imageUrl" className={inputClass} value={form.imageUrl} onChange={onChange} /></Field>
          <Field label="Content *"><textarea name="content" rows={4} className={inputClass} value={form.content} onChange={onChange} /></Field>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" name="featured" checked={form.featured} onChange={onChange} /> Featured
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" name="isActive" checked={form.isActive} onChange={onChange} /> Active
          </label>
        </div>
        <div className="mt-4 flex gap-2">
          <BusyButton busy={busy} onClick={save}>{editingId ? "Update" : "Create"}</BusyButton>
          {editingId && (
            <button type="button" onClick={reset} className="px-4 py-2 rounded-lg text-sm border border-slate-200">Cancel</button>
          )}
        </div>
      </AdminCard>

      <AdminCard title={`All testimonials (${rows.length})`}>
        <div className="space-y-3">
          {paginate(rows, page, ADMIN_PAGE_SIZE).items.map((t) => (
            <div key={t.id} className="border border-slate-100 rounded-lg p-3 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-slate-900">{t.name} <span className="text-xs text-slate-500">· {t.role}</span></p>
                <p className="text-sm text-slate-600 mt-1 line-clamp-2">{t.content}</p>
                <p className="text-xs text-slate-400 mt-1">★ {t.rating} · featured:{String(t.featured)} · active:{String(t.isActive !== false)}</p>
              </div>
              <div className="space-x-2 whitespace-nowrap">
                <button type="button" className="text-sky-600 font-semibold text-sm" onClick={() => startEdit(t)}>Edit</button>
                <button type="button" className="text-red-600 font-semibold text-sm" onClick={() => remove(t.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
        <AdminPagination
          page={paginate(rows, page, ADMIN_PAGE_SIZE).page}
          pageSize={ADMIN_PAGE_SIZE}
          total={rows.length}
          onPageChange={setPage}
        />
      </AdminCard>
    </div>
  );
}
