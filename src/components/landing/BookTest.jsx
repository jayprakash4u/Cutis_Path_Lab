"use client";

import { useState } from "react";
import Link from "next/link";
import { bookingCreateSchema, bookingQuickSchema } from "@/lib/validation/booking";
import { parseOrErrors } from "@/lib/validation/common";

export default function BookTest() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    test: "",
    date: "",
    time: "",
  });
  const [tests, setTests] = useState([]);
  const [testsLoading, setTestsLoading] = useState(false);
  const [testsLoaded, setTestsLoaded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [fieldErrors, setFieldErrors] = useState({});

  const loadTests = async () => {
    if (testsLoaded || testsLoading) return;
    setTestsLoading(true);
    try {
      const res = await fetch("/api/tests?limit=100");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setTests(json.data);
        setTestsLoaded(true);
      }
    } catch {
      // keep empty; form still works with manual notes
    } finally {
      setTestsLoading(false);
    }
  };

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
    `w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 ${
      fieldErrors[key]
        ? "bg-red-50 border border-red-500 focus:border-red-500 focus:ring-red-100"
        : "bg-slate-50 border border-slate-200 focus:border-sky-500 focus:ring-sky-100"
    }`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ type: "", text: "" });
    setFieldErrors({});

    try {
      const quick = parseOrErrors(bookingQuickSchema, formData);
      if (!quick.ok) {
        setFieldErrors(quick.errors);
        const firstKey = Object.keys(quick.errors)[0];
        const el = firstKey
          ? document.querySelector(`[name="${firstKey}"]`)
          : null;
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
        el?.focus?.({ preventScroll: true });
        return;
      }

      const selected = tests.find((t) => String(t.id) === String(formData.test));
      const payload = parseOrErrors(bookingCreateSchema, {
        name: quick.data.name,
        phone: quick.data.phone,
        preferredDate: quick.data.date,
        preferredTime: quick.data.time,
        testId: selected?.id || null,
        notes: selected
          ? `Test: ${selected.name}`
          : formData.test || "",
      });
      if (!payload.ok) {
        const mapped = { ...payload.errors };
        if (mapped.preferredDate) mapped.date = mapped.preferredDate;
        if (mapped.preferredTime) mapped.time = mapped.preferredTime;
        if (mapped.name) mapped.name = mapped.name;
        setFieldErrors(mapped);
        const firstKey = Object.keys(mapped)[0];
        const el = firstKey
          ? document.querySelector(`[name="${firstKey}"]`)
          : null;
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
        el?.focus?.({ preventScroll: true });
        return;
      }

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload.data),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.success) {
        if (json.errors && Object.keys(json.errors).length) {
          const mapped = { ...json.errors };
          if (mapped.preferredDate) mapped.date = mapped.preferredDate;
          if (mapped.preferredTime) mapped.time = mapped.preferredTime;
          setFieldErrors(mapped);
          const firstKey = Object.keys(mapped)[0];
          const el = firstKey
            ? document.querySelector(`[name="${firstKey}"]`)
            : null;
          el?.scrollIntoView({ behavior: "smooth", block: "center" });
          return;
        }
        setMessage({
          type: "error",
          text: "We couldn’t save your booking right now. Please try again.",
        });
        return;
      }

      setMessage({
        type: "success",
        text: "Booking saved! We’ll confirm your appointment shortly.",
      });
      setFormData({ name: "", phone: "", test: "", date: "", time: "" });
    } catch {
      setMessage({
        type: "error",
        text: "Something went wrong. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="book-test" className="section-y bg-slate-50">
      <div className="section-shell">
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-center">
          {/* Left Side - Content & Image */}
          <div>
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-slate-900 mb-2 sm:mb-4">
              Book Your Test Today
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mb-3 sm:mb-4 lg:mb-6">
              Get accurate pathology results from the comfort of your home. Our
              expert team will collect your sample and deliver results
              digitally.
            </p>

            <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-10 h-10 sm:w-12 sm:w-16 flex items-center justify-center">
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 120 120"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-10 h-10 sm:w-12 sm:w-14"
                  >
                    <circle
                      cx="60"
                      cy="60"
                      r="56"
                      fill="#e8f4fd"
                      stroke="#0284c7"
                      strokeWidth="2"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="32"
                      fill="#fff"
                      stroke="#0284c7"
                      strokeWidth="2.5"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="28"
                      fill="#fff"
                      stroke="#0284c7"
                      strokeWidth="1"
                    />
                    <line
                      x1="60"
                      y1="32"
                      x2="60"
                      y2="38"
                      stroke="#0284c7"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    <line
                      x1="60"
                      y1="82"
                      x2="60"
                      y2="88"
                      stroke="#0284c7"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    <line
                      x1="32"
                      y1="60"
                      x2="38"
                      y2="60"
                      stroke="#0284c7"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    <line
                      x1="82"
                      y1="60"
                      x2="88"
                      y2="60"
                      stroke="#0284c7"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    <line
                      x1="79"
                      y1="41"
                      x2="75.5"
                      y2="46"
                      stroke="#0284c7"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <line
                      x1="41"
                      y1="41"
                      x2="44.5"
                      y2="46"
                      stroke="#0284c7"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <line
                      x1="79"
                      y1="79"
                      x2="75.5"
                      y2="74"
                      stroke="#0284c7"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <line
                      x1="41"
                      y1="79"
                      x2="44.5"
                      y2="74"
                      stroke="#0284c7"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <line
                      x1="60"
                      y1="60"
                      x2="60"
                      y2="40"
                      stroke="#0284c7"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    <line
                      x1="60"
                      y1="60"
                      x2="76"
                      y2="67"
                      stroke="#FF6B6B"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    <circle cx="60" cy="60" r="4" fill="#FF6B6B" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-slate-900 text-xs sm:text-sm">
                    Quick Results
                  </p>
                  <p className="t-caption text-slate-500">
                    Results within 24 hours
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-10 h-10 sm:w-12 sm:w-16 flex items-center justify-center">
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 120 120"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-10 h-10 sm:w-12 sm:w-14"
                  >
                    <circle
                      cx="60"
                      cy="60"
                      r="56"
                      fill="#e8f4fd"
                      stroke="#0284c7"
                      strokeWidth="2"
                    />
                    <path
                      d="M28 64 L60 32 L92 64"
                      stroke="#0284c7"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                    <rect
                      x="36"
                      y="62"
                      width="48"
                      height="32"
                      rx="2"
                      fill="#bae6fd"
                      stroke="#0284c7"
                      strokeWidth="2.5"
                    />
                    <rect
                      x="41"
                      y="68"
                      width="14"
                      height="12"
                      rx="2"
                      fill="#fff"
                      stroke="#0284c7"
                      strokeWidth="1.8"
                    />
                    <circle
                      cx="60"
                      cy="32"
                      r="7"
                      fill="#FF6B6B"
                      stroke="#fff"
                      strokeWidth="1.5"
                    />
                    <circle cx="60" cy="31" r="3" fill="#fff" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-slate-900 text-xs sm:text-sm">
                    Home Sample Collection
                  </p>
                  <p className="t-caption text-slate-500">
                    We come to your doorstep
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-10 h-10 sm:w-12 sm:w-16 flex items-center justify-center">
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 120 120"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-10 h-10 sm:w-12 sm:w-14"
                  >
                    <circle
                      cx="60"
                      cy="60"
                      r="56"
                      fill="#e8f4fd"
                      stroke="#0284c7"
                      strokeWidth="2"
                    />
                    <circle cx="60" cy="60" r="5" fill="#FF6B6B" />
                    <polyline
                      points="44,63 54,74 76,50"
                      fill="none"
                      stroke="#FF6B6B"
                      strokeWidth="5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <text
                      x="60"
                      y="84"
                      textAnchor="middle"
                      fontSize="9"
                      fontWeight="800"
                      fill="#0284c7"
                      fontFamily="Arial,sans-serif"
                      letterSpacing="1"
                    >
                      NABL
                    </text>
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-slate-900 text-xs sm:text-sm">
                    NABL Accredited
                  </p>
                  <p className="t-caption text-slate-500">
                    ISO certified lab
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-3 sm:mb-6">
              <Link
                href="/tests"
                className="inline-flex items-center gap-1 sm:gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-sky-600 text-white text-xs sm:text-sm font-semibold rounded-lg hover:bg-sky-700 transition-colors"
              >
                View All Tests
                <svg
                  className="w-3 h-3 sm:w-4 sm:h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 shadow-lg">
            <div className="bg-[#FF6B6B] -mx-3 sm:-mx-4 md:-mx-6 -mt-3 sm:-mt-4 md:-mt-6 px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 rounded-t-xl sm:rounded-t-2xl mb-3 sm:mb-4">
              <h3 className="text-sm sm:text-base md:text-xl font-semibold text-white">
                Book Your Appointment
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4" noValidate>
              <div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  aria-invalid={Boolean(fieldErrors.name)}
                  className={fieldClass("name")}
                />
                {fieldErrors.name && (
                  <p className="mt-1 text-xs font-medium text-red-600" role="alert">{fieldErrors.name}</p>
                )}
              </div>

              <div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  aria-invalid={Boolean(fieldErrors.phone)}
                  className={fieldClass("phone")}
                />
                {fieldErrors.phone && (
                  <p className="mt-1 text-xs font-medium text-red-600" role="alert">{fieldErrors.phone}</p>
                )}
              </div>

              <div>
                <select
                  name="test"
                  value={formData.test}
                  onChange={handleChange}
                  onFocus={loadTests}
                  className={fieldClass("test")}
                >
                  <option value="">
                    {testsLoading ? "Loading tests…" : "Select Test"}
                  </option>
                  {tests.map((test) => (
                    <option key={test.id} value={test.id}>
                      {test.name} - Rs. {test.price}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <div>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    aria-invalid={Boolean(fieldErrors.date)}
                    className={fieldClass("date")}
                  />
                  {fieldErrors.date && (
                    <p className="mt-1 text-xs font-medium text-red-600" role="alert">{fieldErrors.date}</p>
                  )}
                </div>
                <div>
                  <select
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    aria-invalid={Boolean(fieldErrors.time)}
                    className={fieldClass("time")}
                  >
                    <option value="">Time</option>
                    <option value="morning">Morning</option>
                    <option value="afternoon">Afternoon</option>
                    <option value="evening">Evening</option>
                  </select>
                  {fieldErrors.time && (
                    <p className="mt-1 text-xs font-medium text-red-600" role="alert">{fieldErrors.time}</p>
                  )}
                </div>
              </div>

              {message.type === "success" && message.text && (
                <p className="text-xs sm:text-sm font-medium text-green-600" role="status">
                  {message.text}
                </p>
              )}
              {message.type === "error" && message.text && (
                <p className="text-xs sm:text-sm font-medium text-red-600" role="alert">
                  {message.text}
                </p>
              )}

              <div className="pt-1 sm:pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="float-right px-4 sm:px-6 py-2 sm:py-2.5 bg-sky-600 text-white text-xs sm:text-sm font-semibold rounded-lg hover:bg-sky-700 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? "Saving..." : "Book Now"}{" "}
                  {!submitting && <span className="text-white">&gt;</span>}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
