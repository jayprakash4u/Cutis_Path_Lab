"use client";

import { useState } from "react";
import Link from "next/link";
import SectionHeader from "@/components/ui/SectionHeader";
import { bookableTests } from "@/data/landingData";
import { bookingQuickSchema } from "@/lib/validation/booking";
import { parseOrErrors } from "@/lib/validation/common";

/** Home collection genuinely is a sequence, so it is numbered. */
const steps = [
  {
    n: "01",
    title: "You pick a slot",
    desc: "Choose a test and a morning, afternoon or evening window. We confirm by phone.",
  },
  {
    n: "02",
    title: "A phlebotomist comes to you",
    desc: "Sealed kit, barcode applied at your door, sample logged before it leaves.",
  },
  {
    n: "03",
    title: "The report reaches you",
    desc: "Within 24 hours for routine panels, by WhatsApp or email, with reference intervals printed.",
  },
];

export default function BookTest() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    test: "",
    date: "",
    time: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (message.text) setMessage({ type: "", text: "" });
    if (fieldErrors[e.target.name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[e.target.name];
        return next;
      });
    }
  };

  const fieldClass = (key) =>
    `w-full rounded-md border px-3 py-2.5 text-sm text-ink-800 placeholder:text-ink-400 transition
     focus:outline-none focus:ring-2 ${
       fieldErrors[key]
         ? "border-flag-600 bg-flag-100/40 focus:border-flag-600 focus:ring-flag-100"
         : "border-line bg-paper focus:border-clinical-500 focus:bg-surface focus:ring-clinical-100"
     }`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ type: "", text: "" });
    setFieldErrors({});

    const quick = parseOrErrors(bookingQuickSchema, formData);
    if (!quick.ok) {
      setFieldErrors(quick.errors);
      const firstKey = Object.keys(quick.errors)[0];
      const el = firstKey ? document.querySelector(`[name="${firstKey}"]`) : null;
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      el?.focus?.({ preventScroll: true });
      setSubmitting(false);
      return;
    }

    // Demo build — the request is held locally instead of being sent anywhere.
    setMessage({
      type: "success",
      text: "Request received. The lab will call you to confirm the slot.",
    });
    setFormData({ name: "", phone: "", test: "", date: "", time: "" });
    setSubmitting(false);
  };

  return (
    <section id="book-test" className="section bg-paper">
      <div className="shell">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_26rem] lg:gap-16">
          <div>
            <SectionHeader
              eyebrow="Home collection"
              title="Book without leaving the house"
              lede="Across Kathmandu valley, seven days a week. There is no collection charge."
            />

            <ol className="mt-9 space-y-px overflow-hidden rounded-lg border border-line bg-line">
              {steps.map((s) => (
                <li key={s.n} className="flex gap-4 bg-surface p-5">
                  <span className="mono flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-clinical-600 text-[11px] font-semibold text-white">
                    {s.n}
                  </span>
                  <div>
                    <h3 className="text-[0.9375rem] font-semibold text-ink-900">
                      {s.title}
                    </h3>
                    <p className="mt-1 text-[13px] leading-relaxed text-ink-500">
                      {s.desc}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link href="/tests" className="btn-outline">
                See the full test list
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <a href="tel:+9779825849435" className="btn-quiet">
                Or call +977-9825849435
              </a>
            </div>
          </div>

          {/* Requisition slip */}
          <div className="card overflow-hidden shadow-2">
            <div className="flex items-baseline justify-between border-b border-line bg-surface-sunk px-5 py-3">
              <h3 className="text-[0.9375rem] font-semibold text-ink-900">
                Request a collection
              </h3>
              <span className="label">No payment now</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 p-5" noValidate>
              <div>
                <label htmlFor="bt-name" className="label mb-1.5 block">
                  Full name
                </label>
                <input
                  id="bt-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="As written on your ID"
                  aria-invalid={Boolean(fieldErrors.name)}
                  className={fieldClass("name")}
                />
                {fieldErrors.name && (
                  <p className="mt-1.5 text-xs font-medium text-flag-700" role="alert">
                    {fieldErrors.name}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="bt-phone" className="label mb-1.5 block">
                  Phone
                </label>
                <input
                  id="bt-phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="98XXXXXXXX"
                  aria-invalid={Boolean(fieldErrors.phone)}
                  className={`${fieldClass("phone")} mono`}
                />
                {fieldErrors.phone && (
                  <p className="mt-1.5 text-xs font-medium text-flag-700" role="alert">
                    {fieldErrors.phone}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="bt-test" className="label mb-1.5 block">
                  Test or panel
                </label>
                <select
                  id="bt-test"
                  name="test"
                  value={formData.test}
                  onChange={handleChange}
                  className={fieldClass("test")}
                >
                  <option value="">Select a test</option>
                  {bookableTests.map((test) => (
                    <option key={test.id} value={test.id}>
                      {test.name} — Rs {test.price.toLocaleString("en-IN")}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="bt-date" className="label mb-1.5 block">
                    Date
                  </label>
                  <input
                    id="bt-date"
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    aria-invalid={Boolean(fieldErrors.date)}
                    className={`${fieldClass("date")} mono`}
                  />
                  {fieldErrors.date && (
                    <p className="mt-1.5 text-xs font-medium text-flag-700" role="alert">
                      {fieldErrors.date}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="bt-time" className="label mb-1.5 block">
                    Window
                  </label>
                  <select
                    id="bt-time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    aria-invalid={Boolean(fieldErrors.time)}
                    className={fieldClass("time")}
                  >
                    <option value="">Select</option>
                    <option value="morning">Morning</option>
                    <option value="afternoon">Afternoon</option>
                    <option value="evening">Evening</option>
                  </select>
                  {fieldErrors.time && (
                    <p className="mt-1.5 text-xs font-medium text-flag-700" role="alert">
                      {fieldErrors.time}
                    </p>
                  )}
                </div>
              </div>

              {message.type === "success" && message.text && (
                <p
                  className="rounded-md bg-assay-100 px-3 py-2.5 text-[13px] font-medium text-assay-700"
                  role="status"
                >
                  {message.text}
                </p>
              )}
              {message.type === "error" && message.text && (
                <p
                  className="rounded-md bg-flag-100 px-3 py-2.5 text-[13px] font-medium text-flag-700"
                  role="alert"
                >
                  {message.text}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full !py-3"
              >
                {submitting ? "Sending…" : "Request collection"}
              </button>

              <p className="text-center text-[11px] leading-relaxed text-ink-400">
                We call to confirm before a phlebotomist is assigned.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
