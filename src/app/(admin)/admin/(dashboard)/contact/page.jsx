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
  location: "",
  phone: "",
  whatsapp: "",
  email: "",
  hours: "",
  emergencyNote: "",
  mapEmbedUrl: "",
  facebookUrl: "",
  instagramUrl: "",
  whatsappUrl: "",
  xUrl: "",
  linkedinUrl: "",
};

const newFaq = () => ({ question: "", answer: "", isActive: true });

export default function AdminContactPage() {
  const [settings, setSettings] = useState(emptySettings);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const json = await adminFetch("/api/site-contact");
        if (cancelled) return;
        const data = json.data || {};
        setSettings({ ...emptySettings, ...stripNulls(data) });
        setFaqs(Array.isArray(data.faqs) ? data.faqs : []);
      } catch (err) {
        if (!cancelled) setError(err.message || "Could not load contact settings");
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

  const updateFaq = (index, patch) =>
    setFaqs((prev) => prev.map((faq, i) => (i === index ? { ...faq, ...patch } : faq)));

  const moveFaq = (index, delta) =>
    setFaqs((prev) => {
      const next = [...prev];
      const target = index + delta;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });

  const handleSave = async (event) => {
    event.preventDefault();
    if (saving) return;
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const json = await adminFetch("/api/site-contact", {
        method: "PUT",
        body: JSON.stringify({
          ...settings,
          faqs: faqs.map((faq, index) => ({ ...faq, sortOrder: index })),
        }),
      });
      setMessage(json.message || "Contact settings saved");
    } catch (err) {
      setError(err.message || "Could not save contact settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <PageHeader eyebrow="Site content" title="Contact page" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <PageHeader
        eyebrow="Site content"
        title="Contact page"
        description="These details drive the public contact page — the quick contact bar, the info cards, the social links, the map and the FAQ list."
        actions={
          <BusyButton busy={saving} type="submit">
            Save changes
          </BusyButton>
        }
      />

      <ErrorBox message={error} />
      <SuccessBox message={message} />

      <AdminCard
        title="Contact details"
        subtitle="Shown in the quick contact bar and the Get in Touch cards."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Location">
            <input
              className={inputClass}
              value={settings.location}
              onChange={setField("location")}
              placeholder="Mid-Baneshwor, Opposite to Ratna Rajya School"
            />
          </Field>
          <Field label="Working hours">
            <input
              className={inputClass}
              value={settings.hours}
              onChange={setField("hours")}
              placeholder="Sat - Thu 10:00 - 18:00"
            />
          </Field>
          <Field label="Phone" hint="Used for the tap-to-call link.">
            <input
              className={inputClass}
              value={settings.phone}
              onChange={setField("phone")}
              placeholder="+977 986-1848382"
            />
          </Field>
          <Field label="WhatsApp number" hint="Digits only, with country code.">
            <input
              className={inputClass}
              value={settings.whatsapp}
              onChange={setField("whatsapp")}
              placeholder="9779861848382"
            />
          </Field>
          <Field label="Email">
            <input
              type="email"
              className={inputClass}
              value={settings.email}
              onChange={setField("email")}
              placeholder="info@cutispathlab.com"
            />
          </Field>
          <Field label="Emergency note" hint="Small line under the hotline card.">
            <input
              className={inputClass}
              value={settings.emergencyNote}
              onChange={setField("emergencyNote")}
              placeholder="24/7 emergency laboratory services"
            />
          </Field>
        </div>
      </AdminCard>

      <AdminCard
        title="Social profiles"
        subtitle="Leave a field blank to hide that icon on the site."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Facebook URL">
            <input
              className={inputClass}
              value={settings.facebookUrl}
              onChange={setField("facebookUrl")}
              placeholder="https://facebook.com/yourpage"
            />
          </Field>
          <Field label="Instagram URL">
            <input
              className={inputClass}
              value={settings.instagramUrl}
              onChange={setField("instagramUrl")}
              placeholder="https://instagram.com/yourpage"
            />
          </Field>
          <Field label="WhatsApp link">
            <input
              className={inputClass}
              value={settings.whatsappUrl}
              onChange={setField("whatsappUrl")}
              placeholder="https://wa.me/9779861848382"
            />
          </Field>
          <Field label="X (Twitter) URL">
            <input
              className={inputClass}
              value={settings.xUrl}
              onChange={setField("xUrl")}
              placeholder="https://x.com/yourpage"
            />
          </Field>
          <Field label="LinkedIn URL">
            <input
              className={inputClass}
              value={settings.linkedinUrl}
              onChange={setField("linkedinUrl")}
              placeholder="https://linkedin.com/company/yourpage"
            />
          </Field>
        </div>
      </AdminCard>

      <AdminCard
        title="Map"
        subtitle="Paste the src URL from a Google Maps embed."
      >
        <Field label="Map embed URL">
          <input
            className={inputClass}
            value={settings.mapEmbedUrl}
            onChange={setField("mapEmbedUrl")}
            placeholder="https://www.google.com/maps/embed?pb=..."
          />
        </Field>
      </AdminCard>

      <AdminCard
        title="FAQs"
        subtitle={`${faqs.length} question${faqs.length === 1 ? "" : "s"} — shown in the order listed here.`}
        actions={
          <button
            type="button"
            className="admin-btn-ghost"
            onClick={() => setFaqs((prev) => [...prev, newFaq()])}
          >
            Add question
          </button>
        }
      >
        {faqs.length === 0 ? (
          <p className="text-sm text-slate-500">
            No questions yet. Add one and it appears on the contact page.
          </p>
        ) : (
          <ul className="space-y-4">
            {faqs.map((faq, index) => (
              <li
                key={index}
                className="rounded-xl border border-slate-200 bg-white p-4"
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Question {index + 1}
                  </span>
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-1.5 text-xs text-slate-600">
                      <input
                        type="checkbox"
                        checked={faq.isActive !== false}
                        onChange={(e) =>
                          updateFaq(index, { isActive: e.target.checked })
                        }
                      />
                      Visible
                    </label>
                    <button
                      type="button"
                      className="admin-btn-ghost"
                      onClick={() => moveFaq(index, -1)}
                      disabled={index === 0}
                      aria-label={`Move question ${index + 1} up`}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      className="admin-btn-ghost"
                      onClick={() => moveFaq(index, 1)}
                      disabled={index === faqs.length - 1}
                      aria-label={`Move question ${index + 1} down`}
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      className="admin-btn-ghost text-red-600"
                      onClick={() =>
                        setFaqs((prev) => prev.filter((_, i) => i !== index))
                      }
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <Field label="Question">
                    <input
                      className={inputClass}
                      value={faq.question}
                      onChange={(e) => updateFaq(index, { question: e.target.value })}
                      placeholder="What are your laboratory operating hours?"
                    />
                  </Field>
                  <Field label="Answer">
                    <textarea
                      className={inputClass}
                      rows={3}
                      value={faq.answer}
                      onChange={(e) => updateFaq(index, { answer: e.target.value })}
                      placeholder="Our main laboratory is open…"
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
    if (key === "faqs" || key === "id") continue;
    out[key] = value == null ? "" : String(value);
  }
  return out;
}
