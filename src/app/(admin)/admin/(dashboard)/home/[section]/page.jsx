"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { adminFetch } from "@/lib/adminClient";
import AdminModal, { ConfirmDialog } from "@/components/admin/AdminModal";
import ImageField from "@/components/admin/ImageField";
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
import { getHomeSection } from "@/lib/homeSections";

const FIELD_LABELS = {
  title: "Title",
  badge: "Badge",
  note: "Note",
  description: "Description",
  iconKey: "Icon",
  imageUrl: "Image URL",
  mobileImageUrl: "Mobile image",
  linkUrl: "Link URL",
};

/** Where uploads from each section land under public/images. */
const IMAGE_FOLDERS = {
  hero: "banners",
  team: "team",
};

const emptyItem = {
  title: "",
  description: "",
  badge: "",
  note: "",
  iconKey: "",
  imageUrl: "",
  mobileImageUrl: "",
  linkUrl: "",
  isActive: true,
  sortOrder: "0",
};

export default function AdminHomeSectionPage() {
  const params = useParams();
  const sectionKey = String(params?.section ?? "");
  const config = getHomeSection(sectionKey);

  const [section, setSection] = useState(null);
  const [form, setForm] = useState({
    title: "",
    highlight: "",
    subtitle: "",
    ctaLabel: "",
    ctaHref: "",
    isActive: true,
  });
  const [itemForm, setItemForm] = useState(emptyItem);
  const [editingItemId, setEditingItemId] = useState(null);
  const [itemOpen, setItemOpen] = useState(false);
  const [confirming, setConfirming] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [itemBusy, setItemBusy] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [reload, setReload] = useState(0);

  /* Fetched inside the effect so switching section in the sidebar refetches,
     and saves re-run it by bumping `reload` — no memoized callback needed. */
  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    (async () => {
      try {
        const json = await adminFetch(
          `/api/home-sections/${encodeURIComponent(sectionKey)}?active=false`,
        );
        if (cancelled) return;
        const data = json.data || null;
        setSection(data);
        setForm({
          title: data?.title || "",
          highlight: data?.highlight || "",
          subtitle: data?.subtitle || "",
          ctaLabel: data?.ctaLabel || "",
          ctaHref: data?.ctaHref || "",
          isActive: data?.isActive !== false,
        });
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Couldn't load this section. Refresh to try again.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [sectionKey, reload]);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const onItemChange = (e) => {
    const { name, value, type, checked } = e.target;
    setItemForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const shows = (field) => (config?.fields || []).includes(field);
  const itemFields = config?.itemFields || [];
  const items = section?.items || [];
  // Heading-only sections carry no itemLabel, and the dialogs below render
  // regardless of which section is open.
  const itemLabel = config?.itemLabel || "Item";
  const itemLabelLower = itemLabel.toLowerCase();

  const saveSection = async () => {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const payload = { isActive: form.isActive };
      if (shows("title")) payload.title = form.title;
      if (shows("highlight")) payload.highlight = form.highlight;
      if (shows("subtitle")) payload.subtitle = form.subtitle;
      if (shows("cta")) {
        payload.ctaLabel = form.ctaLabel;
        payload.ctaHref = form.ctaHref;
      }
      await adminFetch(`/api/home-sections/${encodeURIComponent(sectionKey)}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
      setMessage("Section saved");
      setReload((n) => n + 1);
    } catch (err) {
      setError(err.message || "Couldn't save this section. Try again.");
    } finally {
      setBusy(false);
    }
  };

  const startCreateItem = () => {
    const nextOrder =
      items.reduce((max, i) => Math.max(max, Number(i.sortOrder) || 0), -1) + 1;
    setItemForm({
      ...emptyItem,
      iconKey: config?.icons?.[0] || "",
      sortOrder: String(nextOrder),
    });
    setEditingItemId(null);
    setError("");
    setItemOpen(true);
  };

  const startEditItem = (item) => {
    setItemForm({
      title: item.title || "",
      description: item.description || "",
      badge: item.badge || "",
      note: item.note || "",
      iconKey: item.iconKey || "",
      imageUrl: item.imageUrl || "",
      mobileImageUrl: item.mobileImageUrl || "",
      linkUrl: item.linkUrl || "",
      isActive: item.isActive !== false,
      sortOrder: String(item.sortOrder ?? 0),
    });
    setEditingItemId(item.id);
    setError("");
    setItemOpen(true);
  };

  const closeItem = () => {
    setItemOpen(false);
    setItemForm(emptyItem);
    setEditingItemId(null);
  };

  const saveItem = async () => {
    setItemBusy(true);
    setError("");
    setMessage("");
    try {
      const payload = {
        title: itemForm.title,
        isActive: itemForm.isActive,
        sortOrder: Number(itemForm.sortOrder) || 0,
      };
      // Only send the fields this section actually uses, so a hidden column
      // can never be blanked by a save.
      for (const field of itemFields) payload[field] = itemForm[field];

      const base = `/api/home-sections/${encodeURIComponent(sectionKey)}/items`;
      if (editingItemId) {
        await adminFetch(`${base}/${encodeURIComponent(editingItemId)}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
        setMessage(`Updated ${payload.title}`);
      } else {
        await adminFetch(base, { method: "POST", body: JSON.stringify(payload) });
        setMessage(`Added ${payload.title}`);
      }
      closeItem();
      setReload((n) => n + 1);
    } catch (err) {
      setError(err.message || "Couldn't save this item. Check the fields and try again.");
    } finally {
      setItemBusy(false);
    }
  };

  const removeItem = async () => {
    if (!confirming) return;
    setDeleting(true);
    setError("");
    try {
      await adminFetch(
        `/api/home-sections/${encodeURIComponent(sectionKey)}/items/${encodeURIComponent(
          confirming.id,
        )}`,
        { method: "DELETE" },
      );
      setMessage(`Deleted ${confirming.title}`);
      setConfirming(null);
      setReload((n) => n + 1);
    } catch (err) {
      setError(err.message || "Couldn't delete this item. Try again.");
    } finally {
      setDeleting(false);
    }
  };

  const iconOptions = useMemo(() => config?.icons || [], [config]);

  if (!config) {
    return (
      <div className="space-y-5">
        <PageHeader title="Unknown section" description="This home section does not exist." />
        <Link href="/admin/home" className="admin-btn-primary">
          Back to home page
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Home page"
        title={config.label}
        description={config.description}
        actions={
          <>
            <Link href="/" className="admin-btn-ghost" target="_blank">
              View home page
            </Link>
            <BusyButton busy={busy} onClick={saveSection} disabled={loading}>
              Save section
            </BusyButton>
          </>
        }
      />

      <ErrorBox message={error} />
      <SuccessBox message={message} />

      <AdminCard
        title="Section settings"
        subtitle="Shown on the public home page."
      >
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {shows("title") ? (
              <div className={shows("highlight") ? "" : "sm:col-span-2"}>
                <Field label="Heading">
                  <input
                    name="title"
                    className={inputClass}
                    value={form.title}
                    onChange={onChange}
                  />
                </Field>
              </div>
            ) : null}

            {shows("highlight") ? (
              <Field
                label="Highlighted word"
                hint="Picked out in blue inside the heading"
              >
                <input
                  name="highlight"
                  className={inputClass}
                  value={form.highlight}
                  onChange={onChange}
                />
              </Field>
            ) : null}

            {shows("subtitle") ? (
              <div className="sm:col-span-2">
                <Field label="Sub-heading">
                  <textarea
                    name="subtitle"
                    rows={3}
                    className={inputClass}
                    value={form.subtitle}
                    onChange={onChange}
                  />
                </Field>
              </div>
            ) : null}

            {shows("cta") ? (
              <>
                <Field label="Button label">
                  <input
                    name="ctaLabel"
                    className={inputClass}
                    value={form.ctaLabel}
                    onChange={onChange}
                  />
                </Field>
                <Field label="Button link">
                  <input
                    name="ctaHref"
                    className={inputClass}
                    value={form.ctaHref}
                    onChange={onChange}
                  />
                </Field>
              </>
            ) : null}

            <div className="sm:col-span-2">
              <label className="flex items-center gap-2.5 text-sm text-slate-700">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={form.isActive}
                  onChange={onChange}
                />
                Show this section on the home page
              </label>
            </div>
          </div>
        )}
      </AdminCard>

      {config.hasItems ? (
        <AdminCard
          title={`${itemLabel}s`}
          subtitle="Cards shown inside this section, in order."
          actions={
            <button type="button" className="admin-btn-primary" onClick={startCreateItem}>
              Add {itemLabelLower}
            </button>
          }
        >
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <EmptyState
              title={`No ${itemLabelLower}s yet`}
              body="The home page falls back to its built-in cards until you add some."
              action={
                <button type="button" className="admin-btn-primary" onClick={startCreateItem}>
                  Add {itemLabelLower}
                </button>
              }
            />
          ) : (
            <ul className="space-y-2.5">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex flex-col justify-between gap-3 rounded-lg border border-[var(--admin-line)] p-3.5 sm:flex-row sm:items-start"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900">
                      {item.badge ? (
                        <span className="mr-1.5 text-xs text-slate-400">{item.badge}</span>
                      ) : null}
                      {item.title}
                    </p>
                    {item.description ? (
                      <p className="mt-1 line-clamp-2 whitespace-pre-line text-sm leading-relaxed text-slate-600">
                        {item.description}
                      </p>
                    ) : null}
                    <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span>Order {item.sortOrder ?? 0}</span>
                      {item.iconKey ? <span>Icon: {item.iconKey}</span> : null}
                      {item.linkUrl ? <span>{item.linkUrl}</span> : null}
                      {item.isActive === false ? (
                        <span className="admin-pill admin-pill--cancelled">Hidden</span>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      className="admin-btn-ghost !px-2.5 !py-1 !text-xs"
                      onClick={() => startEditItem(item)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="admin-btn-danger !px-2.5 !py-1 !text-xs"
                      onClick={() => setConfirming(item)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </AdminCard>
      ) : (
        <AdminCard title="Cards">
          <p className="text-sm text-slate-500">
            This section&apos;s cards come from the catalog, so only the heading is edited
            here.
          </p>
        </AdminCard>
      )}

      <AdminModal
        open={itemOpen}
        onClose={itemBusy ? () => {} : closeItem}
        title={`${editingItemId ? "Edit" : "Add"} ${itemLabelLower}`}
        description="Fields marked * are required."
        footer={
          <>
            <button
              type="button"
              className="admin-btn-ghost"
              onClick={closeItem}
              disabled={itemBusy}
            >
              Cancel
            </button>
            <BusyButton busy={itemBusy} onClick={saveItem}>
              {editingItemId ? "Save changes" : `Add ${itemLabelLower}`}
            </BusyButton>
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {itemFields.map((field) => {
            // A section may rename a generic column for its own cards — the
            // team's "Name" and "Role" are the shared title/badge fields.
            const name = config.itemLabels?.[field] || FIELD_LABELS[field] || field;
            const label = `${name}${field === "title" ? " *" : ""}`;
            const hint = config.itemHints?.[field];

            if (field === "iconKey" && iconOptions.length > 0) {
              return (
                <Field key={field} label={label} hint={hint}>
                  <select
                    name="iconKey"
                    className={inputClass}
                    value={itemForm.iconKey}
                    onChange={onItemChange}
                  >
                    <option value="">Pick by position</option>
                    {iconOptions.map((icon) => (
                      <option key={icon} value={icon}>
                        {icon}
                      </option>
                    ))}
                  </select>
                </Field>
              );
            }

            if (field === "imageUrl" || field === "mobileImageUrl") {
              return (
                <div key={field} className="sm:col-span-2">
                  <ImageField
                    label={name}
                    hint={hint}
                    /* Hero slides and team portraits get their own folders;
                       everything else on the home page shares one. */
                    folder={IMAGE_FOLDERS[sectionKey] || "home"}
                    value={itemForm[field]}
                    onChange={(url) => setItemForm((f) => ({ ...f, [field]: url }))}
                    previewClassName={field === "imageUrl" && sectionKey === "hero" ? "h-16 w-40" : "h-20 w-20"}
                  />
                </div>
              );
            }

            if (field === "description") {
              return (
                <div key={field} className="sm:col-span-2">
                  <Field label={label} hint={hint}>
                    <textarea
                      name="description"
                      rows={4}
                      className={inputClass}
                      value={itemForm.description}
                      onChange={onItemChange}
                    />
                  </Field>
                </div>
              );
            }

            return (
              <Field key={field} label={label} hint={hint}>
                <input
                  name={field}
                  className={inputClass}
                  value={itemForm[field]}
                  onChange={onItemChange}
                  data-autofocus={field === "title" ? true : undefined}
                />
              </Field>
            );
          })}

          <Field label="Sort order" hint="Lower numbers show first">
            <input
              name="sortOrder"
              type="number"
              className={inputClass}
              value={itemForm.sortOrder}
              onChange={onItemChange}
            />
          </Field>

          <div className="sm:col-span-2">
            <label className="flex items-center gap-2.5 text-sm text-slate-700">
              <input
                type="checkbox"
                name="isActive"
                checked={itemForm.isActive}
                onChange={onItemChange}
              />
              Visible on the home page
            </label>
          </div>
        </div>
      </AdminModal>

      <ConfirmDialog
        open={Boolean(confirming)}
        onCancel={() => setConfirming(null)}
        onConfirm={removeItem}
        busy={deleting}
        title={`Delete this ${itemLabelLower}?`}
        body={
          confirming
            ? `${confirming.title} will be removed from the home page. This can't be undone.`
            : ""
        }
      />
    </div>
  );
}
