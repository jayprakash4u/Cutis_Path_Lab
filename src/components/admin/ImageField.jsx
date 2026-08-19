"use client";

import { useRef, useState } from "react";
import { adminUpload } from "@/lib/adminClient";
import { Field, inputClass } from "@/components/admin/ui";

const MAX_BYTES = 5 * 1024 * 1024;

/**
 * An image URL with a file picker attached.
 *
 * The stored value is still a URL — pasting one from anywhere keeps working —
 * but choosing a file uploads it immediately and drops the resulting path into
 * the same field, so staff never have to know where images live. The upload
 * happens on pick rather than on form save, which keeps this usable inside the
 * item dialogs that save through their own handlers.
 */
export default function ImageField({
  label = "Image",
  hint,
  folder,
  value,
  onChange,
  previewClassName = "h-20 w-20",
}) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const pick = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_BYTES) {
      setError("That image is over 5 MB. Choose a smaller file.");
      event.target.value = "";
      return;
    }

    setBusy(true);
    setError("");
    try {
      const body = new FormData();
      body.append("file", file);
      const uploaded = await adminUpload(
        `/api/uploads/${encodeURIComponent(folder)}`,
        body,
      );
      const url = uploaded.data?.url;
      if (!url) throw new Error("The upload didn't return an image URL.");
      onChange(url);
    } catch (err) {
      setError(err.message || "Upload failed. Try again.");
    } finally {
      setBusy(false);
      // Let the same file be picked again after a failure.
      event.target.value = "";
    }
  };

  return (
    <Field label={label} hint={hint || "Paste a URL, or upload a JPG, PNG, WebP or GIF up to 5 MB."}>
      <div className="space-y-2.5">
        <div className="flex gap-2">
          <input
            className={`${inputClass} flex-1`}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder="/images/…"
          />
          <button
            type="button"
            className="admin-btn-ghost shrink-0"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
          >
            {busy ? "Uploading…" : "Upload"}
          </button>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={pick}
          className="hidden"
        />

        {error ? <p className="text-xs text-red-600">{error}</p> : null}

        {value ? (
          <div className="flex items-center gap-3">
            {/* Admin-only preview of an arbitrary URL — next/image would need
                every host in remotePatterns, so this stays a plain img. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt=""
              className={`${previewClassName} rounded-lg border border-[var(--admin-line)] bg-[var(--admin-subtle)] object-cover`}
            />
            <button
              type="button"
              className="admin-btn-ghost !px-2.5 !py-1 !text-xs"
              onClick={() => onChange("")}
            >
              Remove
            </button>
          </div>
        ) : null}
      </div>
    </Field>
  );
}
