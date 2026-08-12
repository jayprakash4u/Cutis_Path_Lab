"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { adminFetch, adminUpload } from "@/lib/adminClient";
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
  specialization: "",
  hospital: "",
  quote: "",
  imageUrl: "",
  isActive: true,
  sortOrder: "0",
};

export default function AdminReferralsPage() {
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
  const [pendingFile, setPendingFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const fileInputRef = useRef(null);

  // `loading` starts true, so the first load already shows a skeleton; only
  // explicit refreshes ask for another one.
  const load = async ({ showSkeleton = false } = {}) => {
    if (showSkeleton) setLoading(true);
    try {
      const json = await adminFetch("/api/referrals?active=false");
      setRows(json.data || []);
    } catch (err) {
      setError(err.message || "Couldn't load referral doctors. Refresh to try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const clearPendingFile = () => {
    if (previewUrl.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    setPendingFile(null);
    setPreviewUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const closeForm = () => {
    setFormOpen(false);
    setForm(emptyForm);
    setEditingId(null);
    clearPendingFile();
  };

  const startCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    clearPendingFile();
    setError("");
    setFormOpen(true);
  };

  const startEdit = (doctor) => {
    clearPendingFile();
    setEditingId(doctor.id);
    setForm({
      name: doctor.name || "",
      specialization: doctor.specialization || "",
      hospital: doctor.hospital || "",
      quote: doctor.quote || "",
      imageUrl: doctor.image || doctor.imageUrl || "",
      isActive: doctor.isActive !== false,
      sortOrder: String(doctor.sortOrder ?? 0),
    });
    setPreviewUrl(doctor.image || doctor.imageUrl || "");
    setError("");
    setFormOpen(true);
  };

  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Choose an image file — JPG, PNG, WebP, or GIF.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("That image is over 5 MB. Choose a smaller file.");
      return;
    }
    setError("");
    if (previewUrl.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    setPendingFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const resolveImageUrl = async () => {
    if (pendingFile) {
      const body = new FormData();
      body.append("file", pendingFile);
      const uploaded = await adminUpload("/api/referrals/upload", body);
      return uploaded.data?.url || "";
    }
    return form.imageUrl.trim();
  };

  const save = async () => {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const imageUrl = await resolveImageUrl();
      const payload = {
        name: form.name.trim(),
        specialization: form.specialization.trim(),
        hospital: form.hospital.trim() || null,
        quote: form.quote.trim(),
        imageUrl: imageUrl || null,
        isActive: form.isActive,
        sortOrder: Number(form.sortOrder) || 0,
      };

      if (editingId) {
        await adminFetch(`/api/referrals/${encodeURIComponent(editingId)}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
        setMessage(`Updated ${payload.name}`);
      } else {
        await adminFetch("/api/referrals", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setMessage(`Added ${payload.name}`);
      }
      closeForm();
      await load();
    } catch (err) {
      setError(err.message || "Couldn't save this doctor. Check the fields and try again.");
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!confirming) return;
    setDeleting(true);
    setError("");
    try {
      await adminFetch(`/api/referrals/${encodeURIComponent(confirming.id)}`, {
        method: "DELETE",
      });
      setMessage(`Deleted ${confirming.name}`);
      if (editingId === confirming.id) closeForm();
      setConfirming(null);
      await load();
    } catch (err) {
      setError(err.message || "Couldn't delete this doctor. Try again.");
    } finally {
      setDeleting(false);
    }
  };

  const { items, total, page: safePage } = useMemo(
    () => paginate(rows, page, ADMIN_PAGE_SIZE),
    [rows, page],
  );

  const displayPreview = previewUrl || form.imageUrl;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Referral network"
        description="Doctors shown in the homepage referral carousel."
        actions={
          <button type="button" className="admin-btn-primary" onClick={startCreate}>
            Add doctor
          </button>
        }
      />

      <ErrorBox message={error} />
      <SuccessBox message={message} />

      <AdminCard title={total === 1 ? "1 doctor" : `${total} doctors`}>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex gap-3 border-b border-[var(--admin-line-soft)] pb-3">
                <Skeleton className="h-14 w-14 shrink-0 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : total === 0 ? (
          <EmptyState
            title="No referring doctors yet"
            body="Add a doctor to show them in the homepage referral carousel."
            action={
              <button type="button" className="admin-btn-primary" onClick={startCreate}>
                Add doctor
              </button>
            }
          />
        ) : (
          <>
            <ul className="space-y-2.5">
              {items.map((d) => (
                <li
                  key={d.id}
                  className="flex flex-col gap-3 rounded-lg border border-[var(--admin-line)] p-3.5 sm:flex-row sm:items-start sm:justify-between"
                >
                  <div className="flex min-w-0 gap-3">
                    {d.image || d.imageUrl ? (
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-[var(--admin-line)]">
                        <Image
                          src={d.image || d.imageUrl}
                          alt={d.name}
                          fill
                          sizes="56px"
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    ) : null}
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900">{d.name}</p>
                      <p className="text-sm text-[var(--admin-sky)]">{d.specialization}</p>
                      {d.hospital ? (
                        <p className="text-xs text-slate-500">{d.hospital}</p>
                      ) : null}
                      <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-slate-600">
                        {d.quote}
                      </p>
                      {d.isActive === false ? (
                        <span className="admin-pill admin-pill--cancelled mt-1.5">Hidden</span>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      className="admin-btn-ghost !px-2.5 !py-1 !text-xs"
                      onClick={() => startEdit(d)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="admin-btn-danger !px-2.5 !py-1 !text-xs"
                      onClick={() => setConfirming(d)}
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
        title={editingId ? "Edit doctor" : "Add referring doctor"}
        description="Fields marked * are required."
        footer={
          <>
            <button type="button" className="admin-btn-ghost" onClick={closeForm} disabled={busy}>
              Cancel
            </button>
            <BusyButton busy={busy} onClick={save}>
              {editingId ? "Save changes" : "Add doctor"}
            </BusyButton>
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Doctor name *">
            <input
              name="name"
              className={inputClass}
              value={form.name}
              onChange={onChange}
              data-autofocus
            />
          </Field>
          <Field label="Specialization *">
            <input
              name="specialization"
              className={inputClass}
              value={form.specialization}
              onChange={onChange}
            />
          </Field>
          <Field label="Hospital or clinic">
            <input
              name="hospital"
              className={inputClass}
              value={form.hospital}
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
            <Field label="Quote *" hint="Shown in the carousel card">
              <textarea
                name="quote"
                rows={4}
                className={inputClass}
                value={form.quote}
                onChange={onChange}
              />
            </Field>
          </div>

          <div className="sm:col-span-2">
            <Field label="Photo" hint="JPG, PNG, WebP, or GIF · up to 5 MB">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={onFileChange}
                className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-[var(--admin-sky)] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[var(--admin-sky-deep)]"
              />
            </Field>
          </div>

          {displayPreview ? (
            <div className="sm:col-span-2">
              <p className="admin-eyebrow mb-2">Photo preview</p>
              <div className="relative h-24 w-24 overflow-hidden rounded-lg border border-[var(--admin-line)] bg-[var(--admin-subtle)]">
                <Image
                  src={displayPreview}
                  alt="Preview"
                  fill
                  sizes="96px"
                  className="object-cover"
                  unoptimized
                />
              </div>
            </div>
          ) : null}

          <label className="flex items-center gap-2.5 text-sm text-slate-700 sm:col-span-2">
            <input
              type="checkbox"
              name="isActive"
              checked={form.isActive}
              onChange={onChange}
            />
            Visible on the public site
          </label>
        </div>
      </AdminModal>

      <ConfirmDialog
        open={Boolean(confirming)}
        onCancel={() => setConfirming(null)}
        onConfirm={remove}
        busy={deleting}
        title="Delete this doctor?"
        body={
          confirming
            ? `${confirming.name} will be removed from the referral carousel. This can't be undone.`
            : ""
        }
      />
    </div>
  );
}
