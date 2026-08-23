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

const CATEGORIES = ["Blog", "Health"];

const emptyForm = {
  title: "",
  slug: "",
  category: "Blog",
  excerpt: "",
  content: "",
  author: "Cutis Path Lab",
  imageUrl: "",
  readMinutes: "4",
  date: "",
  isActive: true,
  sortOrder: "0",
};

/** Mirrors the API's slugify so the admin preview matches what gets saved. */
function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 180);
}

function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function AdminBlogPage() {
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
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [pendingFile, setPendingFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const fileInputRef = useRef(null);

  const load = async ({ showSkeleton = false } = {}) => {
    if (showSkeleton) setLoading(true);
    try {
      // withContent so the search box can look inside article bodies too.
      const json = await adminFetch("/api/blog?active=false&withContent=1");
      setRows(json.data || []);
    } catch (err) {
      setError(err.message || "Couldn't load blog posts. Refresh to try again.");
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

  const startEdit = (post) => {
    clearPendingFile();
    setEditingId(post.id);
    setForm({
      title: post.title || "",
      slug: post.slug || "",
      category: CATEGORIES.includes(post.category) ? post.category : "Blog",
      excerpt: post.excerpt || "",
      content: post.content || "",
      author: post.author || "Cutis Path Lab",
      imageUrl: post.image || post.imageUrl || "",
      readMinutes: String(post.readMinutes ?? 4),
      date: post.date ? String(post.date).slice(0, 10) : "",
      isActive: post.isActive !== false,
      sortOrder: String(post.sortOrder ?? 0),
    });
    setPreviewUrl(post.image || post.imageUrl || "");
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
      const uploaded = await adminUpload("/api/blog/upload", body);
      return uploaded.data?.url || "";
    }
    return form.imageUrl.trim();
  };

  const save = async () => {
    const title = form.title.trim();
    // Nepali titles slugify to an empty string, so the slug has to be typed in.
    const slug = slugify(form.slug || title);
    if (!title) {
      setError("Give the post a title.");
      return;
    }
    if (!slug) {
      setError(
        "Couldn't build a web address from that title — type a slug using latin letters, e.g. gurjo-ke-faida.",
      );
      return;
    }

    setBusy(true);
    setError("");
    setMessage("");
    try {
      const imageUrl = await resolveImageUrl();
      const payload = {
        title,
        slug,
        category: form.category,
        excerpt: form.excerpt.trim() || null,
        content: form.content.trim() || null,
        author: form.author.trim() || null,
        imageUrl: imageUrl || null,
        readMinutes: Number(form.readMinutes) || 4,
        date: form.date || null,
        isActive: form.isActive,
        sortOrder: Number(form.sortOrder) || 0,
      };

      if (editingId) {
        await adminFetch(`/api/blog/${encodeURIComponent(editingId)}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
        setMessage(`Updated “${payload.title}”`);
      } else {
        await adminFetch("/api/blog", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setMessage(`Published “${payload.title}”`);
      }
      closeForm();
      await load();
    } catch (err) {
      setError(err.message || "Couldn't save this post. Check the fields and try again.");
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!confirming) return;
    setDeleting(true);
    setError("");
    try {
      await adminFetch(`/api/blog/${encodeURIComponent(confirming.id)}`, { method: "DELETE" });
      setMessage(`Deleted “${confirming.title}”`);
      if (editingId === confirming.id) closeForm();
      setConfirming(null);
      await load();
    } catch (err) {
      setError(err.message || "Couldn't delete this post. Try again.");
    } finally {
      setDeleting(false);
    }
  };

  const query = search.trim().toLowerCase();

  /*
    Search runs before the category filter so the chip counts below can be
    taken from it — showing "Health (20)" next to a search that only matches
    three of them would be misleading.

    Body text is searched too, not just the title: with three dozen posts the
    question an editor actually has is "which article was it that covered
    fasting?", and that answer is usually not in the headline.
  */
  const searchMatched = useMemo(() => {
    if (!query) return rows;
    return rows.filter((r) =>
      [r.title, r.slug, r.excerpt, r.content, r.category, r.author]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [rows, query]);

  const filtered = useMemo(
    () =>
      categoryFilter === "All"
        ? searchMatched
        : searchMatched.filter((r) => r.category === categoryFilter),
    [searchMatched, categoryFilter],
  );

  const { items, total, page: safePage } = useMemo(
    () => paginate(filtered, page, ADMIN_PAGE_SIZE),
    [filtered, page],
  );

  const displayPreview = previewUrl || form.imageUrl;
  const slugPreview = slugify(form.slug || form.title);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Blog"
        description="Articles shown on the public blog page."
        actions={
          <>
            <input
              type="search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                // Reset here rather than in an effect keyed on `search` —
                // narrowing the list can otherwise leave you on a page that
                // no longer exists.
                setPage(1);
              }}
              placeholder="Search title, text, author"
              className={inputClass}
              style={{ width: "auto", minWidth: 220 }}
              aria-label="Search blog posts"
            />
            <button type="button" className="admin-btn-primary" onClick={startCreate}>
              Add post
            </button>
          </>
        }
      />

      <ErrorBox message={error} />
      <SuccessBox message={message} />

      <div className="flex flex-wrap gap-2">
        {["All", ...CATEGORIES].map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => {
              setCategoryFilter(c);
              setPage(1);
            }}
            className={
              categoryFilter === c
                ? "admin-btn-primary !px-3.5 !py-1.5 !text-xs"
                : "admin-btn-ghost !px-3.5 !py-1.5 !text-xs"
            }
          >
            {c}
            {c !== "All"
              ? ` (${searchMatched.filter((r) => r.category === c).length})`
              : ` (${searchMatched.length})`}
          </button>
        ))}
      </div>

      <AdminCard
        title={total === 1 ? "1 post" : `${total} posts`}
        subtitle={query ? `Filtered from ${rows.length}` : undefined}
      >
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex gap-3 border-b border-[var(--admin-line-soft)] pb-3">
                <Skeleton className="h-14 w-20 shrink-0 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-56" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : total === 0 ? (
          <EmptyState
            title={query ? "No posts match that search" : "No posts here yet"}
            body={
              query
                ? "Try a different title, word from the article, or author."
                : "Add a post to show it on the public blog page."
            }
            action={
              query ? (
                <button
                  type="button"
                  className="admin-btn-ghost"
                  onClick={() => {
                    setSearch("");
                    setPage(1);
                  }}
                >
                  Clear search
                </button>
              ) : (
                <button type="button" className="admin-btn-primary" onClick={startCreate}>
                  Add post
                </button>
              )
            }
          />
        ) : (
          <>
            <ul className="space-y-2.5">
              {items.map((p) => (
                <li
                  key={p.id}
                  className="flex flex-col gap-3 rounded-lg border border-[var(--admin-line)] p-3.5 sm:flex-row sm:items-start sm:justify-between"
                >
                  <div className="flex min-w-0 gap-3">
                    {p.image ? (
                      <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border border-[var(--admin-line)]">
                        <Image
                          src={p.image}
                          alt=""
                          fill
                          sizes="80px"
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    ) : null}
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900">{p.title}</p>
                      <p className="text-xs text-[var(--admin-brand)]">
                        {p.category} · {formatDate(p.date)} · {p.readMinutes} min
                      </p>
                      <p className="mt-0.5 truncate font-mono text-[11px] text-slate-400">
                        /blog/{p.slug}
                      </p>
                      {p.excerpt ? (
                        <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-slate-600">
                          {p.excerpt}
                        </p>
                      ) : null}
                      {p.isActive === false ? (
                        <span className="admin-pill admin-pill--cancelled mt-1.5">Hidden</span>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      className="admin-btn-ghost !px-2.5 !py-1 !text-xs"
                      onClick={() => startEdit(p)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="admin-btn-danger !px-2.5 !py-1 !text-xs"
                      onClick={() => setConfirming(p)}
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
        title={editingId ? "Edit post" : "Add blog post"}
        description="Fields marked * are required."
        footer={
          <>
            <button type="button" className="admin-btn-ghost" onClick={closeForm} disabled={busy}>
              Cancel
            </button>
            <BusyButton busy={busy} onClick={save}>
              {editingId ? "Save changes" : "Publish post"}
            </BusyButton>
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Field label="Title *">
              <input
                name="title"
                className={inputClass}
                value={form.title}
                onChange={onChange}
                data-autofocus
              />
            </Field>
          </div>

          <div className="sm:col-span-2">
            <Field
              label="Web address (slug)"
              hint={
                slugPreview
                  ? `Will publish at /blog/${slugPreview}`
                  : "Type a slug — this title has no latin characters to build one from"
              }
            >
              <input
                name="slug"
                className={inputClass}
                value={form.slug}
                onChange={onChange}
                placeholder="leave blank to build it from the title"
              />
            </Field>
          </div>

          <Field label="Category *">
            <select name="category" className={inputClass} value={form.category} onChange={onChange}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Author">
            <input name="author" className={inputClass} value={form.author} onChange={onChange} />
          </Field>

          <Field label="Publish date">
            <input
              name="date"
              type="date"
              className={inputClass}
              value={form.date}
              onChange={onChange}
            />
          </Field>

          <Field label="Read time (minutes)">
            <input
              name="readMinutes"
              type="number"
              min="1"
              className={inputClass}
              value={form.readMinutes}
              onChange={onChange}
            />
          </Field>

          <div className="sm:col-span-2">
            <Field label="Excerpt" hint="The summary shown on the blog card">
              <textarea
                name="excerpt"
                rows={3}
                className={inputClass}
                value={form.excerpt}
                onChange={onChange}
              />
            </Field>
          </div>

          <div className="sm:col-span-2">
            <Field label="Article body" hint="Optional — shown on the full article page">
              <textarea
                name="content"
                rows={8}
                className={inputClass}
                value={form.content}
                onChange={onChange}
              />
            </Field>
          </div>

          <div className="sm:col-span-2">
            <Field label="Cover image" hint="JPG, PNG, WebP, or GIF · up to 5 MB">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={onFileChange}
                className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-[var(--admin-brand)] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[var(--admin-brand-deep)]"
              />
            </Field>
          </div>

          {displayPreview ? (
            <div className="sm:col-span-2">
              <p className="admin-eyebrow mb-2">Cover preview</p>
              <div className="relative h-28 w-44 overflow-hidden rounded-lg border border-[var(--admin-line)] bg-[var(--admin-subtle)]">
                <Image
                  src={displayPreview}
                  alt="Preview"
                  fill
                  sizes="176px"
                  className="object-cover"
                  unoptimized
                />
              </div>
            </div>
          ) : null}

          <Field label="Sort order" hint="Used when two posts share a date">
            <input
              name="sortOrder"
              type="number"
              className={inputClass}
              value={form.sortOrder}
              onChange={onChange}
            />
          </Field>

          <label className="flex items-center gap-2.5 self-end pb-2 text-sm text-slate-700">
            <input type="checkbox" name="isActive" checked={form.isActive} onChange={onChange} />
            Visible on the public site
          </label>
        </div>
      </AdminModal>

      <ConfirmDialog
        open={Boolean(confirming)}
        onCancel={() => setConfirming(null)}
        onConfirm={remove}
        busy={deleting}
        title="Delete this post?"
        body={
          confirming
            ? `“${confirming.title}” will be removed from the blog. This can't be undone.`
            : ""
        }
      />
    </div>
  );
}
