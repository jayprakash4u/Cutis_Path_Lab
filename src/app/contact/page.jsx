"use client";

/**
 * Contact Page Component
 * Displays contact information, forms, and FAQs
 *
 * @description Contact page with tabbed form sections, quick contacts, and FAQ
 */

// ========== REACT HOOKS ==========
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

// ========== LAYOUT COMPONENTS ==========
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PagePosterHero from "@/components/sections/PagePosterHero";

// ========== UI COMPONENTS ==========
import { InfoCard } from "@/components/ui";

// ========== VALIDATION ==========
import { parseOrErrors } from "@/lib/validation/common";
import { contactFormSchema } from "@/lib/validation/contact";

// ========== CONSTANTS & CONFIGURATION ==========

/**
 * Contact form tabs configuration
 */
const CONTACT_TABS = [
  { id: "general", label: "General Inquiries" },
  { id: "support", label: "Patient Support" },
  { id: "partnerships", label: "Partnerships" },
  { id: "careers", label: "Careers" },
];

/**
 * Quick contact options displayed in banner
 */
const QUICK_CONTACTS = [
  {
    title: "Emergency Hotline",
    desc: "24/7 emergency laboratory services",
    icon: (
      <svg
        width="60"
        height="60"
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
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
          d="M38 34 L48 34 Q52 34 53 38 L56 50 Q57 54 54 56 L50 58 Q56 70 62 76 L64 72 Q66 69 70 70 L82 73 Q86 74 86 78 L86 88 Q86 92 82 92 L78 92 Q52 92 34 54 Q28 40 34 36 Q36 34 38 34Z"
          fill="#bae6fd"
          stroke="#0284c7"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        <circle cx="82" cy="38" r="16" fill="#C0431B" opacity="0.2" />
        <circle cx="82" cy="38" r="11" fill="#C0431B" opacity="0.35" />
        <circle cx="82" cy="38" r="7" fill="#C0431B" />
        <line
          x1="82"
          y1="33"
          x2="82"
          y2="43"
          stroke="#fff"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <line
          x1="77"
          y1="38"
          x2="87"
          y2="38"
          stroke="#fff"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    ),
    value: "+977 986-1848382",
    highlight: true,
  },
  {
    title: "WhatsApp",
    desc: "Quick queries and appointment booking",
    icon: (
      <svg
        width="60"
        height="60"
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
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
          d="M28 52 Q28 28 60 28 Q92 28 92 52 Q92 72 60 72 Q51 72 44 68 L28 76 L33 62 Q28 58 28 52Z"
          fill="#bae6fd"
          stroke="#0284c7"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        <path
          d="M43 40 L51 40 Q54 40 54.5 43 L56 50 Q56.5 53 54 54.5 L52 56 Q55 62 58 65 L60 63 Q62 61 65 62 L72 64 Q75 65 75 68 L75 74 Q75 77 72 77 L69 77 Q52 77 40 56 Q35 46 40 41 Q41 40 43 40Z"
          fill="#0284c7"
        />
        <circle
          cx="82"
          cy="84"
          r="14"
          fill="#C0431B"
          stroke="#fff"
          strokeWidth="2"
        />
        <polyline
          points="73,80 76,90 80,82 84,90 87,80"
          fill="none"
          stroke="#fff"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    value: "+977 986-1848382",
  },
  {
    title: "Toll-Free",
    desc: "Free call from anywhere",
    icon: (
      <svg
        width="60"
        height="60"
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
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
          d="M30 60 Q30 34 60 34 Q90 34 90 60"
          fill="none"
          stroke="#0284c7"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <rect
          x="24"
          y="56"
          width="14"
          height="22"
          rx="7"
          fill="#bae6fd"
          stroke="#0284c7"
          strokeWidth="2.2"
        />
        <rect
          x="27"
          y="60"
          width="8"
          height="14"
          rx="4"
          fill="#0284c7"
          opacity="0.4"
        />
        <rect
          x="82"
          y="56"
          width="14"
          height="22"
          rx="7"
          fill="#bae6fd"
          stroke="#0284c7"
          strokeWidth="2.2"
        />
        <rect
          x="85"
          y="60"
          width="8"
          height="14"
          rx="4"
          fill="#0284c7"
          opacity="0.4"
        />
        <path
          d="M38 76 Q38 88 60 88 Q82 88 82 76"
          fill="none"
          stroke="#0284c7"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <line
          x1="60"
          y1="88"
          x2="60"
          y2="96"
          stroke="#0284c7"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle
          cx="60"
          cy="98"
          r="5"
          fill="#C0431B"
          stroke="#fff"
          strokeWidth="1.5"
        />
        <line
          x1="57"
          y1="98"
          x2="63"
          y2="98"
          stroke="#fff"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <rect x="44" y="54" width="32" height="16" rx="8" fill="#C0431B" />
        <text
          x="60"
          y="65"
          textAnchor="middle"
          fontSize="9"
          fontWeight="800"
          fill="#fff"
          fontFamily="Arial,sans-serif"
          letterSpacing="1"
        >
          FREE
        </text>
      </svg>
    ),
    value: "1800-LIFELINE",
  },
];

/**
 * FAQ data for FAQ section
 */
const FAQS = [
  {
    question: "What are your laboratory operating hours?",
    answer:
      "Our main laboratory is open Monday through Friday from 7:00 AM to 10:00 PM, and Saturday through Sunday from 8:00 AM to 8:00 PM. Emergency services are available 24/7.",
  },
  {
    question: "How do I book an appointment?",
    answer:
      "You can book an appointment through our online booking system, by calling our hotline, or by visiting our facility directly. We also offer home sample collection services.",
  },
  {
    question: "How long does it take to get test results?",
    answer:
      "Most routine test results are available within 24-48 hours. Specialized tests may take 3-7 days. We provide results via email, patient portal, or in-person pickup.",
  },
  {
    question: "Do you accept insurance?",
    answer:
      "Yes, we work with major insurance providers. Please check with your insurance company for coverage details or contact our billing department for more information.",
  },
];

/**
 * Static content constants
 */
const CONTENT = {
  // Hero section
  HERO: {
    TITLE: "Contact",
    SUBTITLE: "Us",
    TAGLINE:
      "We are here to help. Reach out to us for any questions or support.",
  },

  // Contact info cards
  CONTACT_INFO: {
    LOCATION: "Mid-Baneshwor, Opposite to Ratna Rajya School",
    PHONE: "+977 986-1848382",
    HOURS: "Sat - Thu 10:00 - 18:00",
    EMAIL: "info@cutispathlab.com",
  },

  // Form titles for each tab
  FORM_TITLES: {
    general: "Send us a Message",
    support: "Patient Support Form",
    partnerships: "Partnership Inquiry",
    careers: "Job Application",
  },

  // Subject options for each tab
  SUBJECT_OPTIONS: {
    general: [
      { value: "inquiry", label: "General Inquiry" },
      { value: "feedback", label: "Feedback" },
    ],
    support: [
      { value: "appointment", label: "Book an Appointment" },
      { value: "results", label: "Test Results Query" },
      { value: "complaint", label: "Complaint" },
    ],
    partnerships: [
      { value: "hospital", label: "Hospital Partnership" },
      { value: "corporate", label: "Corporate Accounts" },
      { value: "referral", label: "Referral Program" },
    ],
    careers: [
      { value: "job", label: "Job Opportunity" },
      { value: "internship", label: "Internship" },
    ],
  },

  // Career positions
  POSITIONS: [
    { value: "lab-technician", label: "Lab Technician" },
    { value: "pathologist", label: "Pathologist" },
    { value: "customer-service", label: "Customer Service" },
    { value: "manager", label: "Operations Manager" },
  ],
};

// ========== MAIN COMPONENT ==========

function ContactPageContent() {
  // State for tab navigation and FAQ expansion
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("general");
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    position: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: "", text: "" });
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    const service = searchParams.get("service")?.trim();
    if (!service) return;
    setActiveTab("support");
    setFormData((prev) => {
      if (prev.message.trim()) return prev;
      return {
        ...prev,
        message: `I would like to book / enquire about ${service}. Please advise next steps.`,
      };
    });
  }, [searchParams]);

  const fieldClass = (key) =>
    `w-full px-3 lg:px-4 py-2 lg:py-3 rounded-lg lg:rounded-xl bg-white text-slate-900 placeholder:text-slate-400 transition-colors outline-none text-sm ${
      fieldErrors[key]
        ? "border border-red-500 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-100"
        : "border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
    }`;

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (status.text) setStatus({ type: "", text: "" });
    if (fieldErrors[e.target.name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[e.target.name];
        return next;
      });
    }
  };

  const focusFirstError = (errors) => {
    const firstKey = Object.keys(errors)[0];
    const el = firstKey
      ? document.querySelector(`[name="${firstKey}"]`)
      : null;
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    el?.focus?.({ preventScroll: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setStatus({ type: "", text: "" });
    setFieldErrors({});

    try {
      const formCheck = parseOrErrors(contactFormSchema, {
        ...formData,
        requirePosition: activeTab === "careers",
      });
      if (!formCheck.ok) {
        setFieldErrors(formCheck.errors);
        setStatus({
          type: "error",
          text: "Please check the highlighted fields.",
        });
        focusFirstError(formCheck.errors);
        return;
      }

      // Demo build — the message is validated and held locally, not sent.
      setStatus({
        type: "success",
        text: "Message received. We reply within one working day.",
      });
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        position: "",
        message: "",
      });
      setFieldErrors({});
    } catch (err) {
      setStatus({
        type: "error",
        text: err.message || "Could not send message. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // ========== RENDER ==========
  return (
    <>
      <Navbar />
      <main className="pt-below-nav">
        <PagePosterHero
          src="/images/6psd.png"
          alt="Contact Us"
          width={6667}
          height={579}
        />

        {/* Quick Contact Banner - from QUICK_CONTACTS */}
        <section className="py-4 lg:py-8 bg-white">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 lg:gap-6">
              {QUICK_CONTACTS.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 lg:gap-4 p-2 lg:p-4 rounded-lg lg:rounded-xl bg-slate-50"
                >
                  <div className="w-8 lg:w-12 h-8 lg:h-12 rounded-lg lg:rounded-xl flex items-center justify-center flex-shrink-0 bg-sky-100">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-[10px] lg:text-sm text-slate-500">
                      {item.title}
                    </p>
                    <p className="text-xs lg:text-sm font-semibold text-slate-900">
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Content */}
        <section className="py-4 lg:py-12 bg-white">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-6 lg:gap-16">
              {/* Contact Form - title changes based on activeTab */}
              <div className="card overflow-hidden">
                <div className="flex items-baseline justify-between gap-3 border-b border-line bg-surface-sunk px-5 py-3.5">
                  <h2 className="text-[0.9375rem] font-semibold text-ink-900">
                    {CONTENT.FORM_TITLES[activeTab]}
                  </h2>
                  <span className="label">Replies within 1 working day</span>
                </div>
                <form
                  onSubmit={handleSubmit}
                  noValidate
                  className="space-y-3 lg:space-y-5 p-4 lg:p-10"
                >
                  {/* Honeypot — hidden from users, traps bots */}
                  <input
                    type="text"
                    name="_honeypot"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    className="absolute opacity-0 pointer-events-none h-0 w-0 overflow-hidden"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-5">
                    <div>
                      <label
                        htmlFor="firstName"
                        className="block text-xs lg:text-sm font-medium text-slate-700 mb-1 lg:mb-2"
                      >
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        aria-invalid={Boolean(fieldErrors.firstName)}
                        className={fieldClass("firstName")}
                        placeholder="John"
                      />
                      {fieldErrors.firstName && (
                        <p className="mt-1 text-xs font-medium text-red-600" role="alert">
                          {fieldErrors.firstName}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="lastName"
                        className="block text-xs lg:text-sm font-medium text-slate-700 mb-1 lg:mb-2"
                      >
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        aria-invalid={Boolean(fieldErrors.lastName)}
                        className={fieldClass("lastName")}
                        placeholder="Doe"
                      />
                      {fieldErrors.lastName && (
                        <p className="mt-1 text-xs font-medium text-red-600" role="alert">
                          {fieldErrors.lastName}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-xs lg:text-sm font-medium text-slate-700 mb-1 lg:mb-2"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      aria-invalid={Boolean(fieldErrors.email)}
                      className={fieldClass("email")}
                      placeholder="john@example.com"
                    />
                    {fieldErrors.email && (
                      <p className="mt-1 text-xs font-medium text-red-600" role="alert">
                        {fieldErrors.email}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-xs lg:text-sm font-medium text-slate-700 mb-1 lg:mb-2"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      aria-invalid={Boolean(fieldErrors.phone)}
                      className={fieldClass("phone")}
                      placeholder="+1 234 567 890"
                    />
                    {fieldErrors.phone && (
                      <p className="mt-1 text-xs font-medium text-red-600" role="alert">
                        {fieldErrors.phone}
                      </p>
                    )}
                  </div>

                  {/* Position dropdown - shows only for careers tab */}
                  {activeTab === "careers" && (
                    <div>
                      <label
                        htmlFor="position"
                        className="block text-xs lg:text-sm font-medium text-slate-700 mb-1 lg:mb-2"
                      >
                        Position
                      </label>
                      <select
                        id="position"
                        name="position"
                        value={formData.position}
                        onChange={handleChange}
                        aria-invalid={Boolean(fieldErrors.position)}
                        className={fieldClass("position")}
                      >
                        <option value="">Select</option>
                        {CONTENT.POSITIONS.map((pos) => (
                          <option key={pos.value} value={pos.value}>
                            {pos.label}
                          </option>
                        ))}
                      </select>
                      {fieldErrors.position && (
                        <p className="mt-1 text-xs font-medium text-red-600" role="alert">
                          {fieldErrors.position}
                        </p>
                      )}
                    </div>
                  )}

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-xs lg:text-sm font-medium text-slate-700 mb-1 lg:mb-2"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      aria-invalid={Boolean(fieldErrors.message)}
                      rows={3}
                      className={`${fieldClass("message")} resize-none`}
                      placeholder="How can we help you?"
                    ></textarea>
                    {fieldErrors.message && (
                      <p className="mt-1 text-xs font-medium text-red-600" role="alert">
                        {fieldErrors.message}
                      </p>
                    )}
                  </div>

                  {status.text && (
                    <p
                      className={`text-xs lg:text-sm ${
                        status.type === "success"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {status.text}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary w-full !py-3"
                  >
                    {submitting ? "Sending…" : "Send message"}
                  </button>
                </form>
              </div>

              {/* Contact Info - from CONTENT.CONTACT_INFO */}
              <div className="space-y-4 lg:space-y-8 w-full">
                <div>
                  <p className="eyebrow">Visit or call</p>
                  <div className="mt-2.5 flex items-center gap-4">
                    <h2 className="sec-title">Get in touch</h2>
                    <span className="sec-rule" aria-hidden="true" />
                  </div>
                </div>

                {/* Info Cards */}
                <div className="space-y-4">
                  <InfoCard
                    title="Our Location"
                    content={CONTENT.CONTACT_INFO.LOCATION}
                    icon={
                      <svg
                        width="40"
                        height="40"
                        viewBox="0 0 120 120"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
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
                          d="M60 22 Q78 22 78 44 Q78 58 60 80 Q42 58 42 44 Q42 22 60 22Z"
                          fill="#bae6fd"
                          stroke="#0284c7"
                          strokeWidth="2.5"
                          strokeLinejoin="round"
                        />
                        <circle
                          cx="60"
                          cy="44"
                          r="12"
                          fill="#fff"
                          stroke="#0284c7"
                          strokeWidth="2"
                        />
                        <circle cx="60" cy="44" r="6" fill="#C0431B" />
                        <ellipse
                          cx="60"
                          cy="92"
                          rx="16"
                          ry="5"
                          fill="#0284c7"
                          opacity="0.2"
                        />
                        <line
                          x1="30"
                          y1="88"
                          x2="50"
                          y2="83"
                          stroke="#0284c7"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                        />
                        <line
                          x1="70"
                          y1="83"
                          x2="92"
                          y2="88"
                          stroke="#0284c7"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                        />
                        <line
                          x1="28"
                          y1="94"
                          x2="92"
                          y2="94"
                          stroke="#0284c7"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          opacity="0.4"
                        />
                      </svg>
                    }
                  />
                  <InfoCard
                    title="Phone"
                    content={CONTENT.CONTACT_INFO.PHONE}
                    icon={
                      <svg
                        width="40"
                        height="40"
                        viewBox="0 0 120 120"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
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
                          d="M36 32 L48 32 Q52 32 53 36 L56 50 Q57 54 54 56 L49 59 Q54 70 62 78 L65 73 Q67 70 71 71 L85 74 Q89 75 89 79 L89 90 Q89 94 85 94 L80 94 Q50 94 32 56 Q25 40 32 35 Q34 32 36 32Z"
                          fill="#bae6fd"
                          stroke="#0284c7"
                          strokeWidth="2.2"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M72 28 Q84 36 84 50"
                          fill="none"
                          stroke="#C0431B"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                        <path
                          d="M78 22 Q96 34 96 54"
                          fill="none"
                          stroke="#C0431B"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                        <circle cx="68" cy="30" r="3.5" fill="#C0431B" />
                      </svg>
                    }
                  />
                  <InfoCard
                    title="Working Hours"
                    content={CONTENT.CONTACT_INFO.HOURS}
                    icon={
                      <svg
                        width="40"
                        height="40"
                        viewBox="0 0 120 120"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
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
                          cy="62"
                          r="34"
                          fill="#fff"
                          stroke="#0284c7"
                          strokeWidth="2.5"
                        />
                        <circle
                          cx="60"
                          cy="62"
                          r="29"
                          fill="#fff"
                          stroke="#0284c7"
                          strokeWidth="1.2"
                        />
                        <line
                          x1="60"
                          y1="33"
                          x2="60"
                          y2="40"
                          stroke="#0284c7"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                        <line
                          x1="60"
                          y1="84"
                          x2="60"
                          y2="91"
                          stroke="#0284c7"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                        <line
                          x1="26"
                          y1="62"
                          x2="33"
                          y2="62"
                          stroke="#0284c7"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                        <line
                          x1="87"
                          y1="62"
                          x2="94"
                          y2="62"
                          stroke="#0284c7"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                        <line
                          x1="36"
                          y1="38"
                          x2="40"
                          y2="44"
                          stroke="#0284c7"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                        />
                        <line
                          x1="80"
                          y1="44"
                          x2="84"
                          y2="38"
                          stroke="#0284c7"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                        />
                        <line
                          x1="36"
                          y1="86"
                          x2="40"
                          y2="80"
                          stroke="#0284c7"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                        />
                        <line
                          x1="80"
                          y1="80"
                          x2="84"
                          y2="86"
                          stroke="#0284c7"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                        />
                        <line
                          x1="60"
                          y1="62"
                          x2="60"
                          y2="44"
                          stroke="#0284c7"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                        <line
                          x1="60"
                          y1="62"
                          x2="76"
                          y2="62"
                          stroke="#C0431B"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                        <circle cx="60" cy="62" r="4" fill="#C0431B" />
                        <circle cx="60" cy="22" r="6" fill="#C0431B" />
                        <line
                          x1="60"
                          y1="14"
                          x2="60"
                          y2="11"
                          stroke="#C0431B"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                        <line
                          x1="66"
                          y1="16"
                          x2="68"
                          y2="14"
                          stroke="#C0431B"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                        <line
                          x1="54"
                          y1="16"
                          x2="52"
                          y2="14"
                          stroke="#C0431B"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    }
                  />
                  <InfoCard
                    title="Email"
                    content={CONTENT.CONTACT_INFO.EMAIL}
                    icon={
                      <svg
                        width="40"
                        height="40"
                        viewBox="0 0 120 120"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          cx="60"
                          cy="60"
                          r="56"
                          fill="#e8f4fd"
                          stroke="#0284c7"
                          strokeWidth="2"
                        />
                        <rect
                          x="18"
                          y="38"
                          width="84"
                          height="56"
                          rx="6"
                          fill="#bae6fd"
                          stroke="#0284c7"
                          strokeWidth="2.2"
                        />
                        <path
                          d="M18 44 L60 70 L102 44"
                          fill="none"
                          stroke="#0284c7"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <line
                          x1="18"
                          y1="94"
                          x2="46"
                          y2="68"
                          stroke="#0284c7"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                        />
                        <line
                          x1="102"
                          y1="94"
                          x2="74"
                          y2="68"
                          stroke="#0284c7"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                        />
                        <circle cx="60" cy="57" r="14" fill="#C0431B" />
                        <circle
                          cx="60"
                          cy="57"
                          r="6"
                          fill="none"
                          stroke="#fff"
                          strokeWidth="2.2"
                        />
                        <path
                          d="M66 54 L68 52 Q70 52 70 57 Q70 64 60 64 Q50 64 50 57 Q50 50 60 50 Q65 50 66 54Z"
                          fill="none"
                          stroke="#fff"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    }
                  />
                </div>

                {/* Social Links */}
                <div>
                  <h3 className="font-semibold text-slate-900 mb-4">
                    Follow Us
                  </h3>
                  <div className="flex gap-3">
                    {[
                      {
                        name: "facebook",
                        icon: (
                          <svg
                            width="40"
                            height="40"
                            viewBox="0 0 60 60"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect
                              x="4"
                              y="4"
                              width="52"
                              height="52"
                              rx="10"
                              fill="#0284c7"
                            />
                            <path
                              d="M34 18 L30 18 Q24 18 24 24 L24 28 L19 28 L19 35 L24 35 L24 54 L32 54 L32 35 L37 35 L38 28 L32 28 L32 24 Q32 22 34 22 L38 22 Z"
                              fill="#fff"
                            />
                            <path
                              d="M34 18 L30 18 Q24 18 24 24 L24 28 L19 28 L19 35 L24 35 L24 54 L32 54 L32 35 L37 35 L38 28 L32 28 L32 24 Q32 22 34 22 L38 22 Z"
                              fill="#C0431B"
                              opacity="0.25"
                            />
                          </svg>
                        ),
                      },
                      {
                        name: "instagram",
                        icon: (
                          <svg
                            width="40"
                            height="40"
                            viewBox="0 0 60 60"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect
                              x="4"
                              y="4"
                              width="52"
                              height="52"
                              rx="14"
                              fill="#0284c7"
                            />
                            <rect
                              x="14"
                              y="14"
                              width="32"
                              height="32"
                              rx="10"
                              fill="none"
                              stroke="#fff"
                              stroke-width="3"
                            />
                            <circle
                              cx="30"
                              cy="30"
                              r="8"
                              fill="none"
                              stroke="#C0431B"
                              stroke-width="3"
                            />
                            <circle cx="30" cy="30" r="4" fill="#C0431B" />
                            <circle cx="43" cy="17" r="3" fill="#C0431B" />
                            <circle cx="43" cy="17" r="1.5" fill="#fff" />
                          </svg>
                        ),
                      },
                      {
                        name: "linkedin",
                        icon: (
                          <svg
                            width="40"
                            height="40"
                            viewBox="0 0 60 60"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect
                              x="4"
                              y="4"
                              width="52"
                              height="52"
                              rx="10"
                              fill="#0284c7"
                            />
                            <rect
                              x="13"
                              y="22"
                              width="8"
                              height="24"
                              rx="2"
                              fill="#fff"
                            />
                            <circle cx="17" cy="15" r="5" fill="#C0431B" />
                            <circle cx="17" cy="15" r="3" fill="#fff" />
                            <path
                              d="M25 26 L25 46 L33 46 L33 34 Q33 28 38 28 Q43 28 43 34 L43 46 L51 46 L51 33 Q51 22 40 22 Q35 22 33 26 L33 22 L25 22 Z"
                              fill="#fff"
                            />
                          </svg>
                        ),
                      },
                      {
                        name: "twitter",
                        icon: (
                          <svg
                            width="40"
                            height="40"
                            viewBox="0 0 60 60"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect
                              x="4"
                              y="4"
                              width="52"
                              height="52"
                              rx="10"
                              fill="#0284c7"
                            />
                            <path
                              d="M12 12 L26 32 L12 48 L18 48 L29 36 L39 48 L48 48 L33.5 27.5 L47 12 L41 12 L27.5 23.5 L19 12 Z"
                              fill="#fff"
                              stroke="#fff"
                              stroke-width="0.5"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M12 12 L26 32 L12 48 L18 48 L29 36 L39 48 L48 48 L33.5 27.5 L47 12 L41 12 L27.5 23.5 L19 12 Z"
                              fill="#C0431B"
                              opacity="0.3"
                            />
                          </svg>
                        ),
                      },
                    ].map((social) => (
                      <a
                        key={social.name}
                        href="#"
                        className="w-10 h-10 flex items-center justify-center hover:opacity-80 transition-opacity"
                      >
                        <span className="sr-only">{social.name}</span>
                        {social.icon}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section - from FAQS */}
        <section className="section border-t border-line bg-paper">
          <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <p className="eyebrow">Common questions</p>
              <div className="mt-2.5 flex items-center gap-4">
                <h2 className="sec-title">Before you ask</h2>
                <span className="sec-rule" aria-hidden="true" />
              </div>
            </div>

            <div className="divide-y divide-line overflow-hidden rounded-lg border border-line bg-surface">
              {FAQS.map((faq, index) => (
                <div key={index}>
                  <button
                    type="button"
                    aria-expanded={expandedFaq === index}
                    onClick={() =>
                      setExpandedFaq(expandedFaq === index ? null : index)
                    }
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-paper"
                  >
                    <span className="text-[0.9375rem] font-medium text-ink-900">
                      {faq.question}
                    </span>
                    <svg
                      className={`h-4 w-4 shrink-0 text-ink-400 transition-transform ${expandedFaq === index ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {expandedFaq === index && (
                    <div className="px-5 pb-4">
                      <p className="text-[13px] leading-relaxed text-ink-600">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="w-full border-t border-line">
          <div className="band-deep px-4 py-3 lg:px-6">
            <div className="shell !px-0">
              <p className="label !text-clinical-300">Find us</p>
              <h2 className="mt-1 text-[0.9375rem] font-semibold text-white">
                Cutis Path Lab · Mid-Baneshwor, Kathmandu
              </h2>
            </div>
          </div>
          <iframe
            title="Map showing Cutis Path Lab in Mid-Baneshwor, Kathmandu"
            width="100%"
            height="400"
            frameBorder="0"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3531.8907380419406!2d85.32390742346914!3d27.71922847096282!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb19a3778e0001%3A0x1234567890!2sMid-Baneshwor!5e0!3m2!1sen!2snp!4v1234567890"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full"
          ></iframe>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-paper" />}>
      <ContactPageContent />
    </Suspense>
  );
}
