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
  Mono,
  PageHeader,
  SuccessBox,
  TableSkeleton,
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
  const [formOpen, setFormOpen] = useState(false);
  const [confirming, setConfirming] = useState(null);
  const [selectedTestIds, setSelectedTestIds] = useState([]);
  const [testSearch, setTestSearch] = useState("");
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
      const [cats, tests] = await Promise.all([
        adminFetch("/api/categories?active=false"),
        adminFetch("/api/tests"),
      ]);
      setRows(cats.data || []);
      setAllTests(tests.data || []);
    } catch (err) {
      setError(err.message || "Couldn't load categories. Refresh to try again.");
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
    setSelectedTestIds([]);
    setTestSearch("");
    clearPendingFile();
  };

  const startCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setSelectedTestIds([]);
    setTestSearch("");
    clearPendingFile();
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
    setTestSearch("");
    setError("");
    setFormOpen(true);
    try {
      const json = await adminFetch(
        `/api/categories/${encodeURIComponent(c.id)}?include=tests`,
      );
      setSelectedTestIds(json.data?.testIds || []);
    } catch {
      setSelectedTestIds([]);
    }
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

      setMessage(
        `${editingId ? "Updated" : "Added"} ${payload.label} with ${selectedTestIds.length} linked test${
          selectedTestIds.length === 1 ? "" : "s"
        }`,
      );
      closeForm();
      await load();
    } catch (err) {
      setError(err.message || "Couldn't save this category. Check the fields and try again.");
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!confirming) return;
    setDeleting(true);
    setError("");
    try {
      await adminFetch(`/api/categories/${encodeURIComponent(confirming.id)}`, {
        method: "DELETE",
      });
      setMessage(`Deleted ${confirming.label}`);
      if (editingId === confirming.id) closeForm();
      setConfirming(null);
      await load();
    } catch (err) {
      setError(err.message || "Couldn't delete this category. Try again.");
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
        title="Categories"
        description="Disease categories on the homepage, and the tests filed under each one."
        actions={
          <button type="button" className="admin-btn-primary" onClick={startCreate}>
            Add category
          </button>
        }
      />

      <ErrorBox message={error} />
      <SuccessBox message={message} />

      <AdminCard title={total === 1 ? "1 category" : `${total} categories`}>
        {loading ? (
          <TableSkeleton rows={5} cols={5} />
        ) : total === 0 ? (
          <EmptyState
            title="No categories yet"
            body="Add a disease category to group related tests on the homepage."
            action={
              <button type="button" className="admin-btn-primary" onClick={startCreate}>
                Add category
              </button>
            }
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Label</th>
                    <th>Slug</th>
                    <th>Tests</th>
                    <th>Status</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((c) => (
                    <tr key={c.id}>
                      <td>
                        <Mono className="text-slate-500">{c.sortOrder}</Mono>
                      </td>
                      <td className="font-medium text-slate-900">{c.label}</td>
                      <td>
                        <Mono className="text-xs text-slate-500">{c.slug}</Mono>
                      </td>
                      <td>
                        <Mono className="text-slate-600">{c.testCount ?? 0}</Mono>
                      </td>
                      <td>
                        {c.isActive === false ? (
                          <span className="admin-pill admin-pill--cancelled">Hidden</span>
                        ) : (
                          <span className="admin-pill admin-pill--done">Live</span>
                        )}
                      </td>
                      <td className="whitespace-nowrap text-right">
                        <button
                          type="button"
                          className="admin-btn-ghost !px-2.5 !py-1 !text-xs"
                          onClick={() => startEdit(c)}
                        >
                          Edit
                        </button>{" "}
                        <button
                          type="button"
                          className="admin-btn-danger !px-2.5 !py-1 !text-xs"
                          onClick={() => setConfirming(c)}
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
        title={editingId ? "Edit category" : "Add category"}
        description="Fields marked * are required."
        size="xl"
        footer={
          <>
            <button type="button" className="admin-btn-ghost" onClick={closeForm} disabled={busy}>
              Cancel
            </button>
            <BusyButton busy={busy} onClick={save}>
              {editingId ? "Save changes" : "Add category"}
            </BusyButton>
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Label *">
            <input
              name="label"
              className={inputClass}
              value={form.label}
              onChange={onChange}
              data-autofocus
            />
          </Field>
          <Field label="Slug" hint="Leave blank to build it from the label">
            <input
              name="slug"
              className={inputClass}
              value={form.slug}
              onChange={onChange}
              placeholder="auto from label"
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
          <label className="flex items-center gap-2.5 self-end pb-2 text-sm text-slate-700">
            <input
              type="checkbox"
              name="isActive"
              checked={form.isActive}
              onChange={onChange}
            />
            Show on the homepage
          </label>

          <div className="sm:col-span-2">
            <Field
              label="Category image"
              hint={
                editingId && !pendingFile && form.imageUrl
                  ? "The current image is kept unless you pick a new file."
                  : "JPG, PNG, WebP, or GIF · up to 5 MB"
              }
            >
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
              <p className="admin-eyebrow mb-2">Image preview</p>
              <div className="relative h-28 w-28 overflow-hidden rounded-lg border border-[var(--admin-line)] bg-[var(--admin-subtle)]">
                <Image
                  src={displayPreview}
                  alt={form.label || "Category preview"}
                  fill
                  sizes="112px"
                  className="object-cover"
                  unoptimized
                />
              </div>
              {pendingFile ? (
                <button
                  type="button"
                  onClick={clearPendingFile}
                  className="admin-btn-ghost mt-2.5 !px-2.5 !py-1 !text-xs"
                >
                  Choose a different image
                </button>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="mt-6 border-t border-[var(--admin-line-soft)] pt-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-slate-800">Linked tests</p>
              <p className="mt-0.5 text-xs text-slate-500">
                These show when someone opens this category from the homepage.
              </p>
            </div>
            <span className="admin-pill admin-pill--confirmed">
              <Mono>{selectedTestIds.length}</Mono> selected
            </span>
          </div>

          <input
            type="search"
            placeholder="Search tests by name, code, or lab category"
            className={`${inputClass} mb-3`}
            value={testSearch}
            onChange={(e) => setTestSearch(e.target.value)}
            aria-label="Search tests"
          />

          <div className="max-h-64 divide-y divide-[var(--admin-line-soft)] overflow-y-auto rounded-lg border border-[var(--admin-line)]">
            {filteredTests.length === 0 ? (
              <p className="px-3 py-6 text-center text-sm text-slate-500">
                No tests match that search.
              </p>
            ) : (
              filteredTests.map((t) => {
                const checked = selectedTestIds.includes(t.id);
                return (
                  <label
                    key={t.id}
                    className={`flex cursor-pointer items-start gap-3 px-3 py-2.5 transition-colors hover:bg-[var(--admin-subtle)] ${
                      checked ? "bg-[var(--admin-sky-wash)]" : ""
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
                      <span className="mt-0.5 block text-xs text-slate-400">
                        {t.category} · <Mono>₹{t.price}</Mono>
                      </span>
                    </span>
                  </label>
                );
              })
            )}
          </div>
        </div>
      </AdminModal>

      <ConfirmDialog
        open={Boolean(confirming)}
        onCancel={() => setConfirming(null)}
        onConfirm={remove}
        busy={deleting}
        title="Delete this category?"
        body={
          confirming
            ? `“${confirming.label}” and its ${confirming.testCount ?? 0} test link${
                (confirming.testCount ?? 0) === 1 ? "" : "s"
              } will be removed. The tests themselves stay in the catalog.`
            : ""
        }
      />
    </div>
  );
}
