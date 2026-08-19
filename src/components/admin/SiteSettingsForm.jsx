"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminFetch } from "@/lib/adminClient";
import {
  AdminCard,
  BusyButton,
  ErrorBox,
  Field,
  PageHeader,
  Skeleton,
  SuccessBox,
  inputClass,
} from "@/components/admin/ui";

/**
 * Editor for one single-row settings table.
 *
 * The header strip and the footer have their own screens and their own tables;
 * only the field list differs, so the form itself lives here. `groups` describe
 * the cards and their fields — nothing is inferred from the API response, so a
 * column that isn't listed can't be written by accident.
 */
export default function SiteSettingsForm({
  endpoint,
  eyebrow,
  title,
  description,
  groups,
  toggle,
}) {
  const blank = Object.fromEntries(
    groups.flatMap((group) => group.fields).map((field) => [field.name, ""]),
  );

  const [values, setValues] = useState(blank);
  const [enabled, setEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const json = await adminFetch(endpoint);
        if (cancelled) return;
        const data = json.data || {};
        const next = { ...blank };
        for (const key of Object.keys(next)) next[key] = data[key] ?? "";
        setValues(next);
        if (toggle) setEnabled(data[toggle.name] !== false);
      } catch (err) {
        if (!cancelled) setError(err.message || "Could not load these settings");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
    // `blank` is derived from the static group config, so the endpoint is the
    // only thing that changes what gets fetched.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint]);

  const setField = (name) => (e) =>
    setValues((current) => ({ ...current, [name]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const payload = { ...values };
      if (toggle) payload[toggle.name] = enabled;
      await adminFetch(endpoint, { method: "PUT", body: JSON.stringify(payload) });
      setMessage("Saved. The site picks this up within a minute.");
    } catch (err) {
      setError(err.message || "Could not save these settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <PageHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
        actions={
          <>
            <Link href="/" className="admin-btn-ghost" target="_blank">
              View site
            </Link>
            <BusyButton busy={saving} type="submit">
              Save changes
            </BusyButton>
          </>
        }
      />

      <ErrorBox message={error} />
      <SuccessBox message={message} />

      {toggle ? (
        <AdminCard title={toggle.title}>
          <label className="flex items-center gap-2.5 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
            />
            {toggle.label}
          </label>
        </AdminCard>
      ) : null}

      {groups.map((group) => (
        <AdminCard key={group.title} title={group.title} subtitle={group.subtitle}>
          <div className="grid gap-4 sm:grid-cols-2">
            {group.fields.map((field) => (
              <div key={field.name} className={field.wide ? "sm:col-span-2" : ""}>
                <Field label={field.label} hint={field.hint}>
                  {field.multiline ? (
                    <textarea
                      rows={3}
                      className={inputClass}
                      value={values[field.name]}
                      onChange={setField(field.name)}
                      placeholder={field.placeholder}
                    />
                  ) : (
                    <input
                      className={inputClass}
                      value={values[field.name]}
                      onChange={setField(field.name)}
                      placeholder={field.placeholder}
                    />
                  )}
                </Field>
              </div>
            ))}
          </div>
        </AdminCard>
      ))}
    </form>
  );
}
