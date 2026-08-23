"use client";

/**
 * Book Appointment Page Component
 * Multi-step form for booking diagnostic tests with home collection
 * 
 * @description 4-step booking wizard: Select Tests → Your Details → Schedule → Confirm
 */

// ========== REACT HOOKS ==========
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

// ========== LAYOUT COMPONENTS ==========
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  bookingDetailsSchema,
  bookingScheduleSchema,
  buildBookingPayloadFromWizard,
} from "@/lib/validation/booking";
import { mapBookingApiErrorsToWizard, parseOrErrors } from "@/lib/validation/common";

// ========== CONSTANTS & CONFIGURATION ==========

/**
 * Available time slots for appointments
 */
const TIME_SLOTS = [
  "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM",
];

/**
 * Progress steps configuration
 */
const STEPS = [
  { number: 1, title: "Select Tests" },
  { number: 2, title: "Your Details" },
  { number: 3, title: "Schedule" },
  { number: 4, title: "Confirm" },
];

/**
 * Category filter options
 */
const CATEGORIES = [
  { id: "all", name: "All" },
  { id: "Hematology", name: "Hematology" },
  { id: "Biochemistry", name: "Biochemistry" },
  { id: "Hormone", name: "Hormone" },
];

/**
 * Static content constants
 */
const CONTENT = {
  // Hero section
  HERO: {
    TITLE: "Book Your",
    SUBTITLE: "Appointment",
    TAGLINE: "Quick and easy online booking with home sample collection",
  },

  // Step titles
  STEP_TITLES: {
    1: { heading: "Select Your Tests", description: "Choose from our range of diagnostic tests" },
    2: { heading: "Your Information", description: "Please provide your details for the appointment" },
    3: { heading: "Schedule Your Visit", description: "Choose your preferred date and time slot" },
    4: { heading: "Review & Confirm", description: "Please review your booking details" },
  },

  // Discount threshold message
  DISCOUNT: {
    THRESHOLD: 2,
    PERCENTAGE: 10,
    MESSAGE: "10% bulk discount applied!",
  },

  // Home collection info
  HOME_COLLECTION: {
    TITLE: "Free home sample collection",
    DESCRIPTION: "Our technician will visit your location at the scheduled time",
  },
};

// ========== HELPER FUNCTIONS ==========

function FieldError({ message }) {
  if (!message) return null;
  return (
    <p className="mt-1.5 flex items-start gap-1.5 text-xs font-medium text-red-600" role="alert">
      <svg className="mt-0.5 h-3.5 w-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 8.25a.875.875 0 100-1.75.875.875 0 000 1.75z"
          clipRule="evenodd"
        />
      </svg>
      <span>{message}</span>
    </p>
  );
}

function scrollToFirstError(errors) {
  const firstKey = Object.keys(errors || {})[0];
  if (!firstKey) return;
  const el =
    document.querySelector(`[data-field="${firstKey}"]`) ||
    document.getElementById(`field-${firstKey}`);
  el?.scrollIntoView({ behavior: "smooth", block: "center" });
  if (el?.focus) {
    try {
      el.focus({ preventScroll: true });
    } catch {
      // ignore
    }
  }
}

// ========== MAIN COMPONENT ==========

export default function BookPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BookPageContent />
    </Suspense>
  );
}

function BookPageContent() {
  const searchParams = useSearchParams();
  const [tests, setTests] = useState([]);
  const [testsLoading, setTestsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: "", text: "" });
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    let cancelled = false;
    async function loadTests() {
      try {
        const res = await fetch("/api/tests");
        const json = await res.json();
        if (!cancelled && json.success && Array.isArray(json.data)) {
          setTests(json.data);
        }
      } catch {
        if (!cancelled) setTests([]);
      } finally {
        if (!cancelled) setTestsLoading(false);
      }
    }
    loadTests();
    return () => {
      cancelled = true;
    };
  }, []);

  // ── Step + pre-selected tests from URL ───────────────────────────
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTests, setSelectedTests] = useState([]);
  const [urlPreselected, setUrlPreselected] = useState(false);

  useEffect(() => {
    if (urlPreselected || tests.length === 0) return;
    const raw = searchParams.get("testIds");
    if (!raw) {
      setUrlPreselected(true);
      return;
    }
    const ids = raw.split(",").map((s) => s.trim()).filter(Boolean);
    const matched = ids
      .map((id) => tests.find((t) => String(t.id) === String(id)))
      .filter(Boolean);
    if (matched.length > 0) {
      setSelectedTests(matched);
      setCurrentStep(2);
    }
    setUrlPreselected(true);
  }, [tests, searchParams, urlPreselected]);

  // Category filter
  const [activeCategory, setActiveCategory] = useState("all");
  const [testSearch, setTestSearch] = useState("");

  // Form data state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    address: "",
    notes: "",
  });

  const updateField = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (fieldErrors[key]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  /**
   * Inline style tag — scoped to this page so browser date-picker
   * pseudo-elements (:calendar-picker, :calendar-picker-indicator, etc.)
   * render with correct contrast on Chrome / Edge / Safari.
   */
  const datePickerStyles = `
    input[type="date"] {
      color-scheme: light;
    }
    input[type="date"]::-webkit-calendar-picker-indicator {
      cursor: pointer;
      filter: invert(0.25) sepia(0.3) saturate(3) hue-rotate(200deg);
    }
    input[type="date"]::-webkit-calendar-picker-indicator:hover {
      filter: invert(0.1) sepia(0.4) saturate(5) hue-rotate(190deg);
    }
    input[type="date"]::-webkit-datetime-edit-text,
    input[type="date"]::-webkit-datetime-edit-month-field,
    input[type="date"]::-webkit-datetime-edit-day-field,
    input[type="date"]::-webkit-datetime-edit-year-field {
      color: #1e293b;
    }
  `;

  /**
   * Toggle test selection - adds if not present, removes if present
   */
  const toggleTest = (test) => {
    setSelectedTests((prev) =>
      prev.find((t) => t.id === test.id)
        ? prev.filter((t) => t.id !== test.id)
        : [...prev, test]
    );
    if (fieldErrors.tests) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next.tests;
        return next;
      });
    }
  };

  /**
   * Price calculation with bulk discount
   */
  const totalPrice = selectedTests.reduce((sum, test) => sum + test.price, 0);
  const discount = selectedTests.length > CONTENT.DISCOUNT.THRESHOLD 
    ? Math.round(totalPrice * (CONTENT.DISCOUNT.PERCENTAGE / 100)) 
    : 0;
  const finalPrice = totalPrice - discount;

  /**
   * Handle continue — show errors on the fields that need attention
   */
  const handleContinue = () => {
    setSubmitMessage({ type: "", text: "" });
    if (currentStep === 1) {
      if (selectedTests.length === 0) {
        setFieldErrors({
          tests: "Please select at least one test to continue",
        });
        scrollToFirstError({ tests: true });
        return;
      }
      setFieldErrors({});
      setCurrentStep(2);
      return;
    }
    if (currentStep === 2) {
      const parsed = parseOrErrors(bookingDetailsSchema, formData);
      if (!parsed.ok) {
        setFieldErrors(parsed.errors);
        scrollToFirstError(parsed.errors);
        return;
      }
      setFieldErrors({});
      setCurrentStep(3);
      return;
    }
    if (currentStep === 3) {
      const parsed = parseOrErrors(bookingScheduleSchema, formData);
      if (!parsed.ok) {
        setFieldErrors(parsed.errors);
        scrollToFirstError(parsed.errors);
        return;
      }
      setFieldErrors({});
      setCurrentStep(4);
    }
  };

  /**
   * Handle form submission — frontend + backend Zod validation
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setSubmitMessage({ type: "", text: "" });
    setFieldErrors({});

    try {
      if (selectedTests.length === 0) {
        setCurrentStep(1);
        setFieldErrors({ tests: "Please select at least one test before confirming" });
        setSubmitting(false);
        return;
      }

      let payload;
      try {
        payload = buildBookingPayloadFromWizard({ formData, selectedTests });
      } catch {
        const details = parseOrErrors(bookingDetailsSchema, formData);
        const schedule = parseOrErrors(bookingScheduleSchema, formData);
        const merged = { ...details.errors, ...schedule.errors };
        setFieldErrors(merged);
        if (!details.ok) setCurrentStep(2);
        else if (!schedule.ok) setCurrentStep(3);
        scrollToFirstError(merged);
        setSubmitting(false);
        return;
      }

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        if (json.errors && Object.keys(json.errors).length) {
          const mapped = mapBookingApiErrorsToWizard(json.errors);
          setFieldErrors(mapped);
          if (mapped.firstName || mapped.lastName || mapped.email || mapped.phone || mapped.address) {
            setCurrentStep(2);
          } else if (mapped.date || mapped.time) {
            setCurrentStep(3);
          }
          scrollToFirstError(mapped);
          setSubmitting(false);
          return;
        }
        setSubmitMessage({
          type: "error",
          text: "We couldn’t save your booking right now. Please try again in a moment.",
        });
        setSubmitting(false);
        return;
      }

      setSubmitMessage({
        type: "success",
        text: "Booking confirmed! We’ll contact you shortly.",
      });
      setSelectedTests([]);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        date: "",
        time: "",
        address: "",
        notes: "",
      });
      setCurrentStep(1);
    } catch {
      setSubmitMessage({
        type: "error",
        text: "Something went wrong while saving your booking. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = (key) =>
    `w-full px-3 lg:px-4 py-2 lg:py-3 rounded-lg lg:rounded-xl border bg-white text-slate-900 placeholder:text-slate-400 focus:ring-2 transition-colors outline-none text-sm ${
      fieldErrors[key]
        ? "border-red-500 bg-red-50/40 focus:border-red-500 focus:ring-red-100"
        : "border-slate-200 focus:border-brand-500 focus:ring-brand-200"
    }`;

  // ========== RENDER ==========
  return (
    <>
      <style>{datePickerStyles}</style>
      <Navbar />
      <main className="pt-16 lg:pt-24 pb-12 lg:pb-16 bg-white">
        
        {/* Hero Section - Gradient for mobile, image for bigger */}
        <section className="relative py-6 lg:py-12">
          <div className="sm:hidden absolute inset-0 bg-gradient-to-br from-brand-600 via-brand-500 to-brand-400"></div>
          <div className="hidden sm:block absolute inset-0 bg-gradient-to-br from-brand-600 via-brand-500 to-brand-400">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1920')] bg-cover bg-center opacity-10"></div>
          </div>
          <div className="relative max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 text-center">
            <h1 className="text-xl lg:text-4xl font-bold text-white mb-2 lg:mb-4">
              {CONTENT.HERO.TITLE} <span className="text-brand-100">{CONTENT.HERO.SUBTITLE}</span>
            </h1>
            <p className="text-xs sm:text-sm lg:text-lg text-white/90 max-w-lg mx-auto">
              {CONTENT.HERO.TAGLINE}
            </p>
          </div>
        </section>

        {/* Progress Steps - Sticky */}
        {/* Pinned against the real header height rather than guessed pixels,
            so it follows the utility strip appearing on small screens. */}
        <div className="sticky top-[var(--site-nav-h)] z-30 border-b border-slate-100 bg-white sm:top-[var(--site-nav-h-sm)] lg:top-[var(--site-nav-h-lg)]">
          <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-2 lg:py-4">
            <div className="flex items-center justify-between">
              {STEPS.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className={`flex items-center gap-1 lg:gap-2 ${currentStep >= step.number ? 'text-brand-600' : 'text-slate-400'}`}>
                    <div className={`w-6 lg:w-8 h-6 lg:h-8 rounded-full flex items-center justify-center text-xs lg:text-sm font-semibold ${
                      currentStep > step.number 
                        ? 'bg-brand-600 text-white' 
                        : currentStep === step.number 
                          ? 'bg-brand-100 text-brand-600 border-2 border-brand-600'
                          : 'bg-slate-100 text-slate-400'
                    }`}>
                      {currentStep > step.number ? (
                        <svg className="w-3 lg:w-4 h-3 lg:h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : step.number}
                    </div>
                    <span className="hidden sm:inline text-xs lg:text-sm font-medium">{step.title}</span>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div className={`w-4 lg:w-8 sm:w-12 h-0.5 mx-1 lg:mx-2 ${currentStep > step.number ? 'bg-brand-600' : 'bg-slate-200'}`}></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 lg:py-12">
          <div className="grid lg:grid-cols-3 gap-4 lg:gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Step 1: Select Tests */}
{currentStep === 1 && (
                <div className="bg-slate-50 rounded-2xl p-0 border border-slate-100">
                  <div className="bg-accent-500 w-full px-3 lg:px-4 py-1.5 lg:py-2 rounded-tr-xl">
                    <h2 className="text-sm lg:text-xl font-bold text-white">{CONTENT.STEP_TITLES[1].heading}</h2>
                  </div>
                  
                  <div className="p-4 lg:p-8">
                    {/* Category Filter */}
                    <div className="flex flex-wrap gap-1 lg:gap-2 mb-3 lg:mb-6">
                      {CATEGORIES.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => setActiveCategory(category.id)}
                          className={`px-2 lg:px-4 py-1 lg:py-2 rounded-lg text-xs lg:text-sm font-medium transition-all duration-200 ${
                            activeCategory === category.id
                              ? "bg-brand-600 text-white"
                              : "bg-slate-100 text-slate-600 hover:bg-brand-50 hover:text-brand-600"
                          }`}
                        >
                          {category.name}
                        </button>
                      ))}
                    </div>

                    {/* Test search */}
                    <div className="relative mb-3 lg:mb-4">
                      <svg
                        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                      <input
                        type="search"
                        value={testSearch}
                        onChange={(e) => setTestSearch(e.target.value)}
                        placeholder="Search tests by name or category..."
                        className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-9 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-200 lg:rounded-xl lg:py-2.5"
                        aria-label="Search tests"
                      />
                      {testSearch && (
                        <button
                          type="button"
                          onClick={() => setTestSearch("")}
                          className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                          aria-label="Clear search"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                   
                    {/* Filtered Tests */}
                    {(() => {
                      if (testsLoading) {
                        return (
                          <p className="text-sm text-slate-500 py-6 text-center">
                            Loading tests from database...
                          </p>
                        );
                      }

                      const searchQuery = testSearch.trim().toLowerCase();
                      const filteredTests = tests
                        .filter((test) =>
                          activeCategory === "all" || test.category === activeCategory
                        )
                        .filter((test) => {
                          if (!searchQuery) return true;
                          const name = (test.name || "").toLowerCase();
                          const category = (test.category || "").toLowerCase();
                          return name.includes(searchQuery) || category.includes(searchQuery);
                        });
                      
                      return (
                        <>
                          <div className="mb-2 lg:mb-4" data-field="tests" id="field-tests">
                            <p className="text-xs lg:text-sm text-slate-500">
                              <span className="font-semibold text-brand-600">{filteredTests.length}</span>{" "}
                              {filteredTests.length === 1 ? "test" : "tests"}
                              {searchQuery ? " found" : ""}
                            </p>
                            <FieldError message={fieldErrors.tests} />
                          </div>
                          {filteredTests.length === 0 ? (
                            <div className="rounded-xl border border-dashed border-slate-200 bg-white px-4 py-8 text-center">
                              <p className="text-sm font-medium text-slate-700">No tests found</p>
                              <p className="mt-1 text-xs text-slate-500">
                                Try a different search term or category
                              </p>
                              {searchQuery && (
                                <button
                                  type="button"
                                  onClick={() => setTestSearch("")}
                                  className="mt-3 text-xs font-medium text-brand-600 hover:text-brand-700"
                                >
                                  Clear search
                                </button>
                              )}
                            </div>
                          ) : (
                          <div
                            className={`max-h-64 lg:max-h-96 overflow-y-auto pr-1 lg:pr-2 space-y-2 lg:space-y-3 custom-scrollbar rounded-xl ${
                              fieldErrors.tests ? "ring-2 ring-red-400 ring-offset-2 p-1" : ""
                            }`}
                          >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 lg:gap-4">
                              {filteredTests.map((test) => (
                                <button
                                  key={test.id}
                                  onClick={() => toggleTest(test)}
                                  className={`flex items-center justify-between p-2 lg:p-4 rounded-lg lg:rounded-xl border transition-all duration-200 ${
                                    selectedTests.find((t) => t.id === test.id)
                                      ? "border-brand-500 bg-brand-50 shadow-sm"
                                      : "border-slate-200 hover:border-brand-300 hover:shadow-sm"
                                  }`}
                                >
                                  <div className="text-left">
                                    <p className="text-xs lg:text-sm font-semibold text-slate-900">{test.name}</p>
                                    <p className="text-[10px] lg:text-xs text-slate-500">{test.category}</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-xs lg:text-sm font-bold text-brand-600">₹{test.price}</p>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                          )}
                        </>
                      );
                    })()}
                   
                    {/* Selection Summary */}
                    {selectedTests.length > 0 && (
                      <div className="mt-3 lg:mt-6 p-2 lg:p-4 bg-brand-50 rounded-lg lg:rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-1 lg:gap-2">
                          <svg className="w-4 lg:w-5 h-4 lg:h-5 text-brand-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                          <span className="text-xs lg:text-sm text-brand-700">
                            {selectedTests.length} test{selectedTests.length > 1 ? 's' : ''} selected
                          </span>
                        </div>
                        {selectedTests.length > CONTENT.DISCOUNT.THRESHOLD && (
                          <span className="text-xs lg:text-sm font-medium text-brand-600">
                            🎉 {CONTENT.DISCOUNT.MESSAGE}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: Personal Information */}
              {currentStep === 2 && (
                <div className="bg-slate-50 rounded-2xl p-0 border border-slate-100">
                  <div className="bg-accent-500 w-full px-3 lg:px-4 py-1.5 lg:py-2 rounded-tr-xl">
                    <h2 className="text-sm lg:text-xl font-bold text-white">{CONTENT.STEP_TITLES[2].heading}</h2>
                  </div>
                  
                  <div className="p-4 lg:p-8">
                    <form className="space-y-3 lg:space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-5">
                        <div data-field="firstName">
                          <label className="block text-xs lg:text-sm font-medium text-slate-700 mb-1 lg:mb-2">First Name *</label>
                          <input
                            id="field-firstName"
                            type="text"
                            aria-invalid={Boolean(fieldErrors.firstName)}
                            className={inputClass("firstName")}
                            placeholder="John"
                            value={formData.firstName}
                            onChange={(e) => updateField("firstName", e.target.value)}
                          />
                          <FieldError message={fieldErrors.firstName} />
                        </div>
                        <div data-field="lastName">
                          <label className="block text-xs lg:text-sm font-medium text-slate-700 mb-1 lg:mb-2">Last Name *</label>
                          <input
                            id="field-lastName"
                            type="text"
                            aria-invalid={Boolean(fieldErrors.lastName)}
                            className={inputClass("lastName")}
                            placeholder="Doe"
                            value={formData.lastName}
                            onChange={(e) => updateField("lastName", e.target.value)}
                          />
                          <FieldError message={fieldErrors.lastName} />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-5">
                        <div data-field="email">
                          <label className="block text-xs lg:text-sm font-medium text-slate-700 mb-1 lg:mb-2">Email *</label>
                          <input
                            id="field-email"
                            type="email"
                            aria-invalid={Boolean(fieldErrors.email)}
                            className={inputClass("email")}
                            placeholder="email@example.com"
                            value={formData.email}
                            onChange={(e) => updateField("email", e.target.value)}
                          />
                          <FieldError message={fieldErrors.email} />
                        </div>
                        <div data-field="phone">
                          <label className="block text-xs lg:text-sm font-medium text-slate-700 mb-1 lg:mb-2">Phone *</label>
                          <input
                            id="field-phone"
                            type="tel"
                            aria-invalid={Boolean(fieldErrors.phone)}
                            className={inputClass("phone")}
                            placeholder="+977 98xxxxxxxx"
                            value={formData.phone}
                            onChange={(e) => updateField("phone", e.target.value)}
                          />
                          <FieldError message={fieldErrors.phone} />
                        </div>
                      </div>
                      <div data-field="address">
                        <label className="block text-xs lg:text-sm font-medium text-slate-700 mb-1 lg:mb-2">Address</label>
                        <textarea
                          id="field-address"
                          aria-invalid={Boolean(fieldErrors.address)}
                          className={inputClass("address")}
                          rows={2}
                          placeholder="Home address"
                          value={formData.address}
                          onChange={(e) => updateField("address", e.target.value)}
                        ></textarea>
                        <FieldError message={fieldErrors.address} />
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Step 3: Date & Time */}
              {currentStep === 3 && (
                <div className="bg-slate-50 rounded-2xl p-0 border border-slate-100">
                  <div className="bg-accent-500 w-full px-4 py-2 rounded-tr-xl">
                    <h2 className="text-xl font-bold text-white">{CONTENT.STEP_TITLES[3].heading}</h2>
                  </div>
                  
                  <div className="p-6 lg:p-8">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div data-field="date">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Preferred Date *</label>
                        <input
                          id="field-date"
                          type="date"
                          min={new Date().toISOString().split('T')[0]}
                          style={{ colorScheme: 'light' }}
                          aria-invalid={Boolean(fieldErrors.date)}
                          className={inputClass("date")}
                          value={formData.date}
                          onChange={(e) => updateField("date", e.target.value)}
                        />
                        <FieldError message={fieldErrors.date} />
                      </div>
                      <div data-field="time">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Preferred Time *</label>
                        <div
                          id="field-time"
                          className={`grid grid-cols-2 gap-2 rounded-xl p-1 ${
                            fieldErrors.time ? "ring-2 ring-red-400 bg-red-50/50" : ""
                          }`}
                        >
                          {TIME_SLOTS.map((slot) => (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => updateField("time", slot)}
                              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                                formData.time === slot
                                  ? "bg-accent-500 text-white"
                                  : "bg-slate-100 text-slate-600 hover:bg-brand-50 hover:text-brand-600"
                              }`}
                            >
                              {slot}
                            </button>
                          ))}
                        </div>
                        <FieldError message={fieldErrors.time} />
                      </div>
                    </div>
                    
                    {/* Home Collection Info */}
                    <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                      <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <p className="text-sm font-medium text-blue-700">{CONTENT.HOME_COLLECTION.TITLE}</p>
                          <p className="text-xs text-blue-600 mt-1">{CONTENT.HOME_COLLECTION.DESCRIPTION}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Confirmation */}
              {currentStep === 4 && (
                <div className="bg-slate-50 rounded-2xl p-0 border border-slate-100">
                  <div className="bg-accent-500 w-full px-4 py-2 rounded-tr-xl">
                    <h2 className="text-xl font-bold text-white">{CONTENT.STEP_TITLES[4].heading}</h2>
                  </div>
                  
                  <div className="p-6 lg:p-8 space-y-4">
                    {/* Patient Details */}
                    <div className="p-4 bg-white rounded-xl">
                      <h3 className="font-semibold text-slate-900 mb-2">Patient Details</h3>
                      <p className="text-sm text-slate-600">{formData.firstName} {formData.lastName}</p>
                      <p className="text-sm text-slate-600">{formData.email}</p>
                      <p className="text-sm text-slate-600">{formData.phone}</p>
                    </div>
                    
                    {/* Appointment Details */}
                    <div className="p-4 bg-white rounded-xl">
                      <h3 className="font-semibold text-slate-900 mb-2">Appointment</h3>
                      <p className="text-sm text-slate-600">Date: {formData.date}</p>
                      <p className="text-sm text-slate-600">Time: {formData.time}</p>
                    </div>
                    
                    {/* Address (if provided) */}
                    {formData.address && (
                      <div className="p-4 bg-white rounded-xl">
                        <h3 className="font-semibold text-slate-900 mb-2">Sample Collection Address</h3>
                        <p className="text-sm text-slate-600">{formData.address}</p>
                      </div>
                    )}
                    
                    {/* Selected Tests Summary */}
                    <div className="p-4 bg-white rounded-xl">
                      <h3 className="font-semibold text-slate-900 mb-2">Selected Tests</h3>
                      <div className="space-y-2">
                        {selectedTests.map((test) => (
                          <div key={test.id} className="flex justify-between text-sm">
                            <span className="text-slate-600">{test.name}</span>
                            <span className="text-slate-900 font-medium">₹{test.price}</span>
                          </div>
                        ))}
                        <div className="border-t pt-2 mt-2">
                          <div className="flex justify-between font-semibold">
                            <span>Total</span>
                            <span className="text-brand-600">₹{finalPrice}</span>
                          </div>
                          {discount > 0 && (
                            <p className="text-xs text-green-600 mt-1">Bulk discount applied: -₹{discount}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex flex-col gap-3">
                {submitMessage.type === "success" && submitMessage.text && (
                  <p className="text-sm font-medium text-green-600" role="status">
                    {submitMessage.text}
                  </p>
                )}
                {submitMessage.type === "error" && submitMessage.text && (
                  <p className="text-sm font-medium text-red-600" role="alert">
                    {submitMessage.text}
                  </p>
                )}
                <div className="flex items-center justify-between gap-2">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={() => {
                      setFieldErrors({});
                      setCurrentStep(currentStep - 1);
                    }}
                    className="px-3 lg:px-6 py-2 lg:py-3 border border-slate-200 text-slate-600 text-xs lg:font-medium rounded-lg lg:rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    ← Back
                  </button>
                ) : (
                  <div></div>
                )}
                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={handleContinue}
                    className="px-4 lg:px-6 py-2 lg:py-3 bg-accent-500 text-white text-xs lg:font-medium rounded-lg lg:rounded-xl transition-colors hover:opacity-90"
                  >
                    Continue →
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="px-4 lg:px-8 py-2 lg:py-3 bg-accent-500 text-white text-xs lg:font-semibold rounded-lg lg:rounded-xl hover:opacity-90 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {submitting ? "Saving..." : "Confirm Booking"}
                  </button>
                )}
                </div>
              </div>
            </div>

            {/* Right Column - Booking Summary */}
            <div className="lg:col-span-1">
              <div className="bg-slate-50 rounded-2xl p-0 border border-slate-100 sticky top-48">
                <div className="bg-brand-600 w-full px-3 lg:px-4 py-1.5 lg:py-2 rounded-tr-xl">
                  <h2 className="text-sm lg:text-lg font-bold text-white">Summary</h2>
                </div>
                
                <div className="p-3 lg:p-6">
                  {selectedTests.length === 0 ? (
                    /* Empty state */
                    <div className="text-center py-4 lg:py-8">
                      <div className="w-10 lg:w-16 h-10 lg:h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-2 lg:mb-4">
                        <svg className="w-5 lg:w-8 h-5 lg:h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <p className="text-xs lg:text-sm text-slate-500">No tests selected</p>
                      <p className="text-[10px] lg:text-xs text-slate-400 mt-1">Select tests to see pricing</p>
                    </div>
                  ) : (
                    <>
                      {/* Selected Tests List */}
                      <div className="space-y-2 lg:space-y-3 mb-3 lg:mb-6 max-h-32 lg:max-h-48 overflow-y-auto">
                        {selectedTests.map((test) => (
                          <div key={test.id} className="flex justify-between items-center py-1 lg:py-2 border-b border-slate-100">
                            <div>
                              <p className="text-xs lg:text-sm font-medium text-slate-900">{test.name}</p>
                            </div>
                            <span className="text-xs lg:text-sm font-semibold text-slate-900">₹{test.price}</span>
                          </div>
                        ))}
                      </div>
                      
                      {/* Price Summary */}
                      <div className="space-y-1 lg:space-y-2 border-t border-slate-200 pt-2 lg:pt-4 mb-2 lg:mb-4">
                        <div className="flex justify-between text-xs lg:text-sm">
                          <span className="text-slate-600">Subtotal</span>
                          <span className="text-slate-900">₹{totalPrice}</span>
                        </div>
                        {discount > 0 && (
                          <div className="flex justify-between text-xs lg:text-sm">
                            <span className="text-green-600">Discount</span>
                            <span className="text-green-600">-₹{discount}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Total */}
                      <div className="border-t border-slate-200 pt-2 lg:pt-4 mb-3 lg:mb-6">
                        <div className="flex justify-between items-center">
                          <span className="text-sm lg:text-lg font-semibold text-slate-900">Total</span>
                          <div className="text-right">
                            <span className="text-lg lg:text-2xl font-bold text-brand-600">₹{finalPrice}</span>
                            {discount > 0 && (
                              <p className="text-[10px] lg:text-xs text-green-600">Saved ₹{discount}</p>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Home Collection Badge */}
                      <div className="p-2 lg:p-3 bg-accent-500 rounded-lg lg:rounded-xl mb-2 lg:mb-4">
                        <div className="flex items-center gap-1 lg:gap-2 text-xs lg:text-sm text-white">
                          <svg className="w-3 lg:w-4 h-3 lg:h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-[10px] lg:text-sm">{CONTENT.HOME_COLLECTION.TITLE}</span>
                        </div>
                      </div>
                      
                      <p className="text-[10px] lg:text-xs text-slate-500 text-center">
                        Results in 24 hours
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}