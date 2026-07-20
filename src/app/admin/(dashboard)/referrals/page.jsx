"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { adminFetch, adminUpload } from "@/lib/adminClient";
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
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [page, setPage] = useState(1);
  const [pendingFile, setPendingFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const fileInputRef = useRef(null);

  const load = async () => {
    try {
      const json = await adminFetch("/api/referrals?active=false");
      setRows(json.data || []);
    } catch (err) {
      setError(err.message || "Failed to load referral doctors");
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

  const reset = () => {
    setForm(emptyForm);
    setEditingId(null);
    clearPendingFile();
  };

  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file (JPG, PNG, WebP, or GIF)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be 5 MB or smaller");
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
    window.scrollTo({ top: 0, behavior: "smooth" });
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
        setMessage("Referral doctor updated");
      } else {
        await adminFetch("/api/referrals", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setMessage("Referral doctor added");
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
    if (!confirm("Delete this referral doctor?")) return;
    try {
      await adminFetch(`/api/referrals/${encodeURIComponent(id)}`, { method: "DELETE" });
      setMessage("Referral doctor deleted");
      if (editingId === id) reset();
      await load();
    } catch (err) {
      setError(err.message || "Delete failed");
    }
  };

  const displayPreview = previewUrl || form.imageUrl;

  return (
    <div className="space-y-4">
      <PageHeader
        title="Referral Network"
        description="Doctors shown in the homepage Our Referral Network carousel."
      />
      <ErrorBox message={error} />
      <SuccessBox message={message} />

      <AdminCard title={editingId ? `Edit doctor (${editingId})` : "Add referral doctor"}>
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Doctor name *">
            <input name="name" className={inputClass} value={form.name} onChange={onChange} />
          </Field>
          <Field label="Specialization *">
            <input name="specialization" className={inputClass} value={form.specialization} onChange={onChange} />
          </Field>
          <Field label="Hospital / clinic">
            <input name="hospital" className={inputClass} value={form.hospital} onChange={onChange} />
          </Field>
          <Field label="Sort order">
            <input name="sortOrder" type="number" className={inputClass} value={form.sortOrder} onChange={onChange} />
          </Field>
          <Field label="Doctor photo">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={onFileChange}
              className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-sky-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-sky-700"
            />
            <p className="mt-1.5 text-xs text-slate-500">JPG, PNG, WebP, or GIF · max 5 MB</p>
          </Field>
          <Field label="Quote / testimonial *">
            <textarea name="quote" rows={4} className={inputClass} value={form.quote} onChange={onChange} />
          </Field>
          {displayPreview && (
            <div className="sm:col-span-2">
              <p className="mb-2 text-xs font-medium text-slate-500">Photo preview</p>
              <div className="relative h-24 w-24 overflow-hidden rounded-2xl border-2 border-[#FF6B6B] bg-slate-100">
                <Image src={displayPreview} alt="Preview" fill className="object-cover" unoptimized />
              </div>
            </div>
          )}
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" name="isActive" checked={form.isActive} onChange={onChange} />
            Active (visible on site)
          </label>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <BusyButton busy={busy} onClick={save}>
            {editingId ? "Update" : "Add doctor"}
          </BusyButton>
          {editingId && (
            <button type="button" onClick={reset} className="rounded-lg border border-slate-200 px-4 py-2 text-sm">
              Cancel
            </button>
          )}
        </div>
      </AdminCard>

      <AdminCard title={`All doctors (${rows.length})`}>
        <div className="space-y-3">
          {paginate(rows, page, ADMIN_PAGE_SIZE).items.map((d) => (
            <div
              key={d.id}
              className="flex flex-col gap-3 rounded-lg border border-slate-100 p-3 sm:flex-row sm:items-start sm:justify-between"
            >
              <div className="flex gap-3">
                {(d.image || d.imageUrl) && (
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-slate-200">
                    <Image
                      src={d.image || d.imageUrl}
                      alt={d.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                )}
                <div>
                  <p className="font-semibold text-slate-900">{d.name}</p>
                  <p className="text-sm text-sky-600">{d.specialization}</p>
                  <p className="text-xs text-slate-500">{d.hospital || "—"}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-slate-600">{d.quote}</p>
                  <p className="mt-1 text-xs text-slate-400">
                    order:{d.sortOrder} · active:{String(d.isActive !== false)}
                  </p>
                </div>
              </div>
              <div className="space-x-2 whitespace-nowrap">
                <button type="button" className="text-sm font-semibold text-sky-600" onClick={() => startEdit(d)}>
                  Edit
                </button>
                <button type="button" className="text-sm font-semibold text-red-600" onClick={() => remove(d.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        {!rows.length && (
          <p className="py-6 text-center text-sm text-slate-500">No referral doctors yet.</p>
        )}
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
