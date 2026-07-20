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
} from "@/components/admin/ui";

export default function AdminGalleryPage() {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [page, setPage] = useState(1);
  const [pendingFile, setPendingFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const fileInputRef = useRef(null);

  const load = async () => {
    try {
      const json = await adminFetch("/api/gallery?active=false");
      setRows(json.data || []);
    } catch (err) {
      setError(err.message || "Failed to load gallery");
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

  const upload = async () => {
    if (!pendingFile) {
      setError("Please choose an image from your computer");
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
      if (!imageUrl) throw new Error("Upload failed");

      await adminFetch("/api/gallery", {
        method: "POST",
        body: JSON.stringify({ imageUrl }),
      });

      setMessage("Image added to gallery");
      clearPendingFile();
      await load();
    } catch (err) {
      setError(err.message || "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this image?")) return;
    try {
      await adminFetch(`/api/gallery/${encodeURIComponent(id)}`, { method: "DELETE" });
      setMessage("Image deleted");
      await load();
    } catch (err) {
      setError(err.message || "Delete failed");
    }
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Gallery"
        description="Upload images from your computer. They appear on the public Gallery page."
      />
      <ErrorBox message={error} />
      <SuccessBox message={message} />

      <AdminCard title="Add image">
        <Field label="Choose image">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={onFileChange}
            className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-sky-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-sky-700"
          />
          <p className="mt-1.5 text-xs text-slate-500">JPG, PNG, WebP, or GIF · max 5 MB</p>
        </Field>

        {previewUrl && (
          <div className="mt-4">
            <p className="mb-2 text-xs font-medium text-slate-500">Preview</p>
            <div className="relative aspect-video max-w-md overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
              <Image
                src={previewUrl}
                alt="Preview"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          <BusyButton busy={busy} onClick={upload} disabled={!pendingFile}>
            Upload image
          </BusyButton>
          {pendingFile && (
            <button
              type="button"
              onClick={clearPendingFile}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600"
            >
              Clear
            </button>
          )}
        </div>
      </AdminCard>

      <AdminCard title={`All images (${rows.length})`}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {paginate(rows, page, ADMIN_PAGE_SIZE).items.map((item) => (
            <div key={item.id} className="overflow-hidden rounded-xl border border-slate-100">
              <div className="relative aspect-[4/3] bg-slate-100">
                {(item.image || item.imageUrl) && (
                  <Image
                    src={item.image || item.imageUrl}
                    alt="Gallery"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                )}
              </div>
              <div className="p-2 text-center">
                <button
                  type="button"
                  className="text-sm font-semibold text-red-600"
                  onClick={() => remove(item.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        {!rows.length && (
          <p className="py-6 text-center text-sm text-slate-500">No images yet.</p>
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
