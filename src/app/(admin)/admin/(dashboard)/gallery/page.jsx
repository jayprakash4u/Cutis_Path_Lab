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
} from "@/components/admin/ui";

export default function AdminGalleryPage() {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [confirming, setConfirming] = useState(null);
  const [pendingFile, setPendingFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const fileInputRef = useRef(null);

  const load = async () => {
    setLoading(true);
    try {
      const json = await adminFetch("/api/gallery?active=false");
      setRows(json.data || []);
    } catch (err) {
      setError(err.message || "Couldn't load the gallery. Refresh to try again.");
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

  const clearPendingFile = () => {
    if (previewUrl.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    setPendingFile(null);
    setPreviewUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const closeForm = () => {
    setFormOpen(false);
    clearPendingFile();
  };

  const startCreate = () => {
    setError("");
    clearPendingFile();
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

  const upload = async () => {
    if (!pendingFile) {
      setError("Choose an image from your computer first.");
      return;
    }

    setBusy(true);
    setError("");
    setMessage("");
    try {
      const body = new FormData();
      body.append("file", pendingFile);
      const uploaded = await adminUpload("/api/gallery/upload", body);
      const imageUrl = uploaded.data?.url || "";
      if (!imageUrl) throw new Error("The upload didn't return an image URL.");

      await adminFetch("/api/gallery", {
        method: "POST",
        body: JSON.stringify({ imageUrl }),
      });

      setMessage("Image added to the gallery");
      closeForm();
      await load();
    } catch (err) {
      setError(err.message || "Couldn't upload that image. Try again.");
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!confirming) return;
    setDeleting(true);
    setError("");
    try {
      await adminFetch(`/api/gallery/${encodeURIComponent(confirming.id)}`, {
        method: "DELETE",
      });
      setMessage("Image deleted");
      setConfirming(null);
      await load();
    } catch (err) {
      setError(err.message || "Couldn't delete that image. Try again.");
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
        title="Gallery"
        description="Photos shown on the public Gallery page."
        actions={
          <button type="button" className="admin-btn-primary" onClick={startCreate}>
            Upload image
          </button>
        }
      />

      <ErrorBox message={error} />
      <SuccessBox message={message} />

      <AdminCard title={total === 1 ? "1 image" : `${total} images`}>
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[4/3] rounded-lg" />
            ))}
          </div>
        ) : total === 0 ? (
          <EmptyState
            title="No images yet"
            body="Upload a photo of the lab, team, or facilities to fill the public gallery."
            action={
              <button type="button" className="admin-btn-primary" onClick={startCreate}>
                Upload image
              </button>
            }
          />
        ) : (
          <>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="group overflow-hidden rounded-lg border border-[var(--admin-line)]"
                >
                  <div className="relative aspect-[4/3] bg-[var(--admin-subtle)]">
                    {(item.image || item.imageUrl) && (
                      <Image
                        src={item.image || item.imageUrl}
                        alt={item.altText || item.title || "Gallery image"}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover"
                        unoptimized
                      />
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-2 p-2.5">
                    <p className="truncate text-xs text-slate-500">
                      {item.title || "Untitled"}
                    </p>
                    <button
                      type="button"
                      className="admin-btn-danger !px-2 !py-1 !text-xs"
                      onClick={() => setConfirming(item)}
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
        title="Upload image"
        description="JPG, PNG, WebP, or GIF · up to 5 MB"
        size="md"
        footer={
          <>
            <button type="button" className="admin-btn-ghost" onClick={closeForm} disabled={busy}>
              Cancel
            </button>
            <BusyButton busy={busy} onClick={upload} disabled={!pendingFile}>
              Upload image
            </BusyButton>
          </>
        }
      >
        <Field label="Choose image">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={onFileChange}
            data-autofocus
            className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-[var(--admin-sky)] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[var(--admin-sky-deep)]"
          />
        </Field>

        {previewUrl ? (
          <div className="mt-4">
            <p className="admin-eyebrow mb-2">Preview</p>
            <div className="relative aspect-video overflow-hidden rounded-lg border border-[var(--admin-line)] bg-[var(--admin-subtle)]">
              <Image src={previewUrl} alt="Preview" fill className="object-cover" unoptimized />
            </div>
            <button
              type="button"
              onClick={clearPendingFile}
              className="admin-btn-ghost mt-3 !px-2.5 !py-1 !text-xs"
            >
              Choose a different image
            </button>
          </div>
        ) : null}
      </AdminModal>

      <ConfirmDialog
        open={Boolean(confirming)}
        onCancel={() => setConfirming(null)}
        onConfirm={remove}
        busy={deleting}
        title="Delete this image?"
        body="It will be removed from the public gallery and the file deleted from the server. This can't be undone."
      />
    </div>
  );
}
