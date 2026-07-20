"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
  label: "",
  slug: "",
  imageUrl: "",
  isActive: true,
  sortOrder: "0",
};

export default function AdminCategoriesPage() {
  const [rows, setRows] = useState([]);
  const [allTests, setAllTests] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [selectedTestIds, setSelectedTestIds] = useState([]);
  const [testSearch, setTestSearch] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [page, setPage] = useState(1);
  const [pendingFile, setPendingFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const fileInputRef = useRef(null);

  const load = async () => {
    try {
      const [cats, tests] = await Promise.all([
        adminFetch("/api/categories?active=false"),
        adminFetch("/api/tests"),
      ]);
      setRows(cats.data || []);
      setAllTests(tests.data || []);
    } catch (err) {
      setError(err.message || "Failed to load categories");
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
    setSelectedTestIds([]);
    setTestSearch("");
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
      const uploaded = await adminUpload("/api/categories/upload", body);
      return uploaded.data?.url || "";
    }
    return form.imageUrl.trim();
  };

  const startEdit = async (c) => {
    clearPendingFile();
    setEditingId(c.id);
    setForm({
      label: c.label || "",
      slug: c.slug || "",
      imageUrl: c.image || c.imageUrl || "",
      isActive: c.isActive !== false,
      sortOrder: String(c.sortOrder ?? 0),
    });
    setPreviewUrl(c.image || c.imageUrl || "");
    setError("");
    try {
      const json = await adminFetch(
        `/api/categories/${encodeURIComponent(c.id)}?include=tests`,
      );
      setSelectedTestIds(json.data?.testIds || []);
    } catch {
      setSelectedTestIds([]);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleTest = (id) => {
    setSelectedTestIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const filteredTests = useMemo(() => {
    const q = testSearch.trim().toLowerCase();
    if (!q) return allTests;
    return allTests.filter(
      (t) =>
        t.name?.toLowerCase().includes(q) ||
        t.code?.toLowerCase().includes(q) ||
        t.category?.toLowerCase().includes(q),
    );
  }, [allTests, testSearch]);

  const save = async () => {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const imageUrl = await resolveImageUrl();
      const payload = {
        label: form.label,
        slug: form.slug,
        imageUrl: imageUrl || null,
        isActive: form.isActive,
        sortOrder: Number(form.sortOrder) || 0,
      };
      let id = editingId;
      if (editingId) {
        await adminFetch(`/api/categories/${encodeURIComponent(editingId)}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
      } else {
        const created = await adminFetch("/api/categories", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        id = created.data?.id;
      }

      if (id) {
        await adminFetch(`/api/categories/${encodeURIComponent(id)}/tests`, {
          method: "PUT",
          body: JSON.stringify({ testIds: selectedTestIds }),
        });
      }

      setMessage(editingId ? "Category & linked tests updated" : "Category created with linked tests");
      reset();
      await load();
    } catch (err) {
      setError(err.message || "Save failed");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this category and its test links?")) return;
    try {
      await adminFetch(`/api/categories/${encodeURIComponent(id)}`, { method: "DELETE" });
      setMessage("Category deleted");
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
        title="Categories"
        description="Disease categories on the homepage — link the tests that belong under each disease."
      />
      <ErrorBox message={error} />
      <SuccessBox message={message} />

      <AdminCard title={editingId ? `Edit category (${editingId})` : "Add category"}>
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Label *"><input name="label" className={inputClass} value={form.label} onChange={onChange} /></Field>
          <Field label="Slug (optional)"><input name="slug" className={inputClass} value={form.slug} onChange={onChange} placeholder="auto from label" /></Field>

          <Field label="Category image">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={onFileChange}
              className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-sky-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-sky-700"
            />
            <p className="mt-1.5 text-xs text-slate-500">JPG, PNG, WebP, or GIF · max 5 MB</p>
            {pendingFile && (
              <p className="mt-1 text-xs font-medium text-sky-700">Selected: {pendingFile.name}</p>
            )}
            {editingId && !pendingFile && form.imageUrl && (
              <p className="mt-1 text-xs text-slate-500">Current image kept unless you pick a new file.</p>
            )}
          </Field>

          <Field label="Sort order"><input name="sortOrder" type="number" className={inputClass} value={form.sortOrder} onChange={onChange} /></Field>
          <label className="flex items-center gap-2 text-sm text-slate-700 self-end">
            <input type="checkbox" name="isActive" checked={form.isActive} onChange={onChange} />
            Active
          </label>

          {displayPreview && (
            <div className="sm:col-span-2">
              <p className="mb-2 text-xs font-medium text-slate-500">Image preview</p>
              <div className="relative h-32 w-32 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                <Image
                  src={displayPreview}
                  alt={form.label || "Category preview"}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              {pendingFile && (
                <button
                  type="button"
                  onClick={clearPendingFile}
                  className="mt-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Clear selected file
                </button>
              )}
            </div>
          )}
        </div>

        <div className="mt-6 border-t border-slate-100 pt-5">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div>
              <p className="text-sm font-semibold text-slate-800">Linked tests</p>
              <p className="text-xs text-slate-500 mt-0.5">
                Selected tests appear when users open this disease from the homepage.
              </p>
            </div>
            <span className="text-xs font-semibold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-lg">
              {selectedTestIds.length} selected
            </span>
          </div>
          <input
            type="search"
            placeholder="Search tests by name, code, or lab category…"
            className={`${inputClass} mb-3`}
            value={testSearch}
            onChange={(e) => setTestSearch(e.target.value)}
          />
          <div className="max-h-64 overflow-y-auto rounded-xl border border-slate-200 divide-y divide-slate-100 bg-white">
            {filteredTests.length === 0 ? (
              <p className="px-3 py-6 text-sm text-slate-500 text-center">No tests match.</p>
            ) : (
              filteredTests.map((t) => {
                const checked = selectedTestIds.includes(t.id);
                return (
                  <label
                    key={t.id}
                    className={`flex items-start gap-3 px-3 py-2.5 cursor-pointer hover:bg-slate-50 ${
                      checked ? "bg-sky-50/60" : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="mt-1"
                      checked={checked}
                      onChange={() => toggleTest(t.id)}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium text-slate-800">{t.name}</span>
                      <span className="block text-xs text-slate-400 mt-0.5">
                        {t.category} · ₹{t.price}
                      </span>
                    </span>
                  </label>
                );
              })
            )}
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <BusyButton busy={busy} onClick={save}>
            {editingId ? "Update category" : "Create category"}
          </BusyButton>
          {editingId && (
            <button type="button" onClick={reset} className="px-4 py-2 rounded-lg text-sm border border-slate-200">
              Cancel
            </button>
          )}
        </div>
      </AdminCard>

      <AdminCard title={`All categories (${rows.length})`}>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase text-slate-500 border-b">
                <th className="py-2 pr-3">Order</th>
                <th className="py-2 pr-3">Label</th>
                <th className="py-2 pr-3">Slug</th>
                <th className="py-2 pr-3">Tests</th>
                <th className="py-2 pr-3">Active</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginate(rows, page, ADMIN_PAGE_SIZE).items.map((c) => (
                <tr key={c.id} className="border-b border-slate-100">
                  <td className="py-2 pr-3">{c.sortOrder}</td>
                  <td className="py-2 pr-3">{c.label}</td>
                  <td className="py-2 pr-3 font-mono text-xs">{c.slug}</td>
                  <td className="py-2 pr-3">{c.testCount ?? 0}</td>
                  <td className="py-2 pr-3">{c.isActive === false ? "No" : "Yes"}</td>
                  <td className="py-2 space-x-2 whitespace-nowrap">
                    <button type="button" className="text-sky-600 font-semibold" onClick={() => startEdit(c)}>
                      Edit
                    </button>
                    <button type="button" className="text-red-600 font-semibold" onClick={() => remove(c.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
