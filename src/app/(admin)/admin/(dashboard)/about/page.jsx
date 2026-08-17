"use client";

import { useEffect, useState } from "react";
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

const emptySettings = {
  heroTagline: "",
  introHeading: "",
  introLead: "",
  introBody: "",
  missionHeading: "",
  missionBody: "",
  missionImage: "",
  visionHeading: "",
  visionBody: "",
  visionImage: "",
  statsHeading: "",
  certsHeading: "",
  certsIntro: "",
};

const ICON_OPTIONS = [
  { value: "nabl", label: "NABL shield" },
  { value: "iso", label: "ISO gear" },
  { value: "cap", label: "CAP wreath" },
];

/** Small repeated toolbar for the two editable lists. */
function RowTools({ index, count, onMove, onRemove, isActive, onToggle, label }) {
  return (
    <div className="flex items-center gap-2">
      <label className="flex items-center gap-1.5 text-xs text-slate-600">
        <input type="checkbox" checked={isActive !== false} onChange={onToggle} />
        Visible
      </label>
      <button
        type="button"
        className="admin-btn-ghost"
        onClick={() => onMove(-1)}
        disabled={index === 0}
        aria-label={`Move ${label} ${index + 1} up`}
      >
        ↑
      </button>
      <button
        type="button"
        className="admin-btn-ghost"
        onClick={() => onMove(1)}
        disabled={index === count - 1}
        aria-label={`Move ${label} ${index + 1} down`}
      >
        ↓
      </button>
      <button type="button" className="admin-btn-ghost text-red-600" onClick={onRemove}>
        Remove
      </button>
    </div>
  );
}

export default function AdminAboutPage() {
  const [settings, setSettings] = useState(emptySettings);
  const [stats, setStats] = useState([]);
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const json = await adminFetch("/api/site-about");
        if (cancelled) return;
        const data = json.data || {};
        setSettings({ ...emptySettings, ...stripNulls(data) });
        setStats(Array.isArray(data.stats) ? data.stats : []);
        setCerts(Array.isArray(data.accreditations) ? data.accreditations : []);
      } catch (err) {
        if (!cancelled) setError(err.message || "Could not load the about page");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const setField = (key) => (event) =>
    setSettings((prev) => ({ ...prev, [key]: event.target.value }));

  const moveIn = (setter) => (index, delta) =>
    setter((prev) => {
      const next = [...prev];
      const target = index + delta;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });

  const patchIn = (setter) => (index, patch) =>
    setter((prev) => prev.map((row, i) => (i === index ? { ...row, ...patch } : row)));

  const moveStat = moveIn(setStats);
  const moveCert = moveIn(setCerts);
  const patchStat = patchIn(setStats);
  const patchCert = patchIn(setCerts);

  const handleSave = async (event) => {
    event.preventDefault();
    if (saving) return;
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const json = await adminFetch("/api/site-about", {
        method: "PUT",
        body: JSON.stringify({
          ...settings,
          stats: stats.map((s, i) => ({ ...s, sortOrder: i })),
          accreditations: certs.map((c, i) => ({ ...c, sortOrder: i })),
        }),
      });
      setMessage(json.message || "About page saved");
    } catch (err) {
      setError(err.message || "Could not save the about page");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <PageHeader eyebrow="Site content" title="About page" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <PageHeader
        eyebrow="Site content"
        title="About page"
        description="Every heading, paragraph, figure and badge on the public About page. Clear a field to hide that element."
        actions={
          <BusyButton busy={saving} type="submit">
            Save changes
          </BusyButton>
        }
      />

      <ErrorBox message={error} />
      <SuccessBox message={message} />

      <AdminCard title="Header" subtitle="The line under the page title.">
        <Field label="Hero tagline">
          <textarea
            className={inputClass}
            rows={2}
            value={settings.heroTagline}
            onChange={setField("heroTagline")}
          />
        </Field>
      </AdminCard>

      <AdminCard title="Who we are" subtitle="Opening section under the header.">
        <div className="space-y-4">
          <Field label="Heading">
            <input className={inputClass} value={settings.introHeading} onChange={setField("introHeading")} />
          </Field>
          <Field label="Lead paragraph" hint="Set slightly larger than the rest.">
            <textarea className={inputClass} rows={3} value={settings.introLead} onChange={setField("introLead")} />
          </Field>
          <Field label="Second paragraph">
            <textarea className={inputClass} rows={3} value={settings.introBody} onChange={setField("introBody")} />
          </Field>
        </div>
      </AdminCard>

      <AdminCard title="Mission" subtitle="Image sits on the left.">
        <div className="space-y-4">
          <Field label="Heading">
            <input className={inputClass} value={settings.missionHeading} onChange={setField("missionHeading")} />
          </Field>
          <Field label="Body">
            <textarea className={inputClass} rows={4} value={settings.missionBody} onChange={setField("missionBody")} />
          </Field>
          <Field label="Image path" hint="e.g. /images/mission-vision.png">
            <input className={inputClass} value={settings.missionImage} onChange={setField("missionImage")} />
          </Field>
        </div>
      </AdminCard>

      <AdminCard title="Vision" subtitle="Image sits on the right.">
        <div className="space-y-4">
          <Field label="Heading">
            <input className={inputClass} value={settings.visionHeading} onChange={setField("visionHeading")} />
          </Field>
          <Field label="Body">
            <textarea className={inputClass} rows={4} value={settings.visionBody} onChange={setField("visionBody")} />
          </Field>
          <Field label="Image path" hint="e.g. /images/vision-image.png">
            <input className={inputClass} value={settings.visionImage} onChange={setField("visionImage")} />
          </Field>
        </div>
      </AdminCard>

      <AdminCard
        title="By the numbers"
        subtitle={`${stats.length} figure${stats.length === 1 ? "" : "s"} — shown in this order.`}
        actions={
          <button
            type="button"
            className="admin-btn-ghost"
            onClick={() => setStats((prev) => [...prev, { value: "", label: "", isActive: true }])}
          >
            Add figure
          </button>
        }
      >
        <Field label="Section heading">
          <input className={inputClass} value={settings.statsHeading} onChange={setField("statsHeading")} />
        </Field>

        {stats.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">No figures yet — the section stays hidden.</p>
        ) : (
          <ul className="mt-4 space-y-4">
            {stats.map((stat, index) => (
              <li key={index} className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Figure {index + 1}
                  </span>
                  <RowTools
                    index={index}
                    count={stats.length}
                    label="figure"
                    isActive={stat.isActive}
                    onToggle={(e) => patchStat(index, { isActive: e.target.checked })}
                    onMove={(d) => moveStat(index, d)}
                    onRemove={() => setStats((prev) => prev.filter((_, i) => i !== index))}
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Value" hint="e.g. 500K+">
                    <input
                      className={inputClass}
                      value={stat.value}
                      onChange={(e) => patchStat(index, { value: e.target.value })}
                    />
                  </Field>
                  <Field label="Label">
                    <input
                      className={inputClass}
                      value={stat.label}
                      onChange={(e) => patchStat(index, { label: e.target.value })}
                    />
                  </Field>
                </div>
              </li>
            ))}
          </ul>
        )}
      </AdminCard>

      <AdminCard
        title="Accreditations"
        subtitle={`${certs.length} badge${certs.length === 1 ? "" : "s"} — the artwork is fixed, the wording is yours.`}
        actions={
          <button
            type="button"
            className="admin-btn-ghost"
            onClick={() =>
              setCerts((prev) => [...prev, { title: "", body: "", iconKey: "nabl", isActive: true }])
            }
          >
            Add badge
          </button>
        }
      >
        <div className="space-y-4">
          <Field label="Section heading">
            <input className={inputClass} value={settings.certsHeading} onChange={setField("certsHeading")} />
          </Field>
          <Field label="Section intro">
            <textarea className={inputClass} rows={2} value={settings.certsIntro} onChange={setField("certsIntro")} />
          </Field>
        </div>

        {certs.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">No badges yet — the section stays hidden.</p>
        ) : (
          <ul className="mt-4 space-y-4">
            {certs.map((cert, index) => (
              <li key={index} className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Badge {index + 1}
                  </span>
                  <RowTools
                    index={index}
                    count={certs.length}
                    label="badge"
                    isActive={cert.isActive}
                    onToggle={(e) => patchCert(index, { isActive: e.target.checked })}
                    onMove={(d) => moveCert(index, d)}
                    onRemove={() => setCerts((prev) => prev.filter((_, i) => i !== index))}
                  />
                </div>
                <div className="space-y-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Title">
                      <input
                        className={inputClass}
                        value={cert.title}
                        onChange={(e) => patchCert(index, { title: e.target.value })}
                      />
                    </Field>
                    <Field label="Badge artwork">
                      <select
                        className={inputClass}
                        value={cert.iconKey || "nabl"}
                        onChange={(e) => patchCert(index, { iconKey: e.target.value })}
                      >
                        {ICON_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </Field>
                  </div>
                  <Field label="Description">
                    <textarea
                      className={inputClass}
                      rows={2}
                      value={cert.body || ""}
                      onChange={(e) => patchCert(index, { body: e.target.value })}
                    />
                  </Field>
                </div>
              </li>
            ))}
          </ul>
        )}
      </AdminCard>
    </form>
  );
}

/** The API returns SQL NULLs; inputs need strings to stay controlled. */
function stripNulls(data) {
  const out = {};
  for (const [key, value] of Object.entries(data)) {
    if (key === "stats" || key === "accreditations" || key === "id") continue;
    out[key] = value == null ? "" : String(value);
  }
  return out;
}
