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
import PageHeroBand from "@/components/sections/PageHeroBand";

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
 * Social profiles — official brand marks on each platform's own brand colour.
 * Paths are the standard single-colour glyphs on a 24×24 grid; Instagram uses
 * its corner-anchored gradient rather than a flat fill.
 */
const SOCIAL_LINKS = [
  {
    name: "Facebook",
    urlField: "facebookUrl",
    background: "#1877F2",
    path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
  },
  {
    name: "Instagram",
    urlField: "instagramUrl",
    background:
      "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)",
    path: "M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm7.846-10.405a1.441 1.441 0 0 1-2.881 0 1.441 1.441 0 0 1 2.881 0z",
  },
  {
    name: "WhatsApp",
    urlField: "whatsappUrl",
    background: "#25D366",
    path: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z",
  },
  {
    name: "X",
    urlField: "xUrl",
    background: "#000000",
    path: "M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z",
  },
  {
    name: "LinkedIn",
    urlField: "linkedinUrl",
    background: "#0A66C2",
    path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  },
];

/**
 * Quick contact options displayed in banner
 */
const QUICK_CONTACTS = [
  {
    title: "Emergency Hotline",
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
        <circle cx="82" cy="38" r="16" fill="#FF6B6B" opacity="0.2" />
        <circle cx="82" cy="38" r="11" fill="#FF6B6B" opacity="0.35" />
        <circle cx="82" cy="38" r="7" fill="#FF6B6B" />
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
          fill="#FF6B6B"
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
  },
  {
    title: "Email",
    desc: "We reply the same working day",
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
        <rect
          x="26"
          y="40"
          width="68"
          height="46"
          rx="6"
          fill="#bae6fd"
          stroke="#0284c7"
          strokeWidth="2.4"
        />
        <path
          d="M26 46 L60 68 L94 46"
          fill="none"
          stroke="#0284c7"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M26 84 L50 64"
          fill="none"
          stroke="#0284c7"
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity="0.6"
        />
        <path
          d="M94 84 L70 64"
          fill="none"
          stroke="#0284c7"
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity="0.6"
        />
        <circle cx="88" cy="38" r="10" fill="#FF6B6B" stroke="#fff" strokeWidth="2" />
      </svg>
    ),
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

  // Admin-managed contact details. Until they arrive (or if the request
  // fails) the constants below act as the fallback, so the page never
  // renders blank.
  const [site, setSite] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function loadSiteContact() {
      try {
        const res = await fetch("/api/site-contact");
        const json = await res.json();
        if (!cancelled && json.success && json.data) setSite(json.data);
      } catch {
        // keep the static fallback
      }
    }
    loadSiteContact();
    return () => {
      cancelled = true;
    };
  }, []);

  // Every value below comes from the SiteContact / ContactFaq tables, edited
  // at /admin/contact. Nothing is hard-coded here — a blank field in the admin
  // form simply hides that element rather than falling back to stale copy.
  const info = {
    LOCATION: site?.location || "",
    PHONE: site?.phone || "",
    HOURS: site?.hours || "",
    EMAIL: site?.email || "",
  };
  const telHref = info.PHONE ? `tel:${info.PHONE.replace(/[^\d+]/g, "")}` : null;
  const waNumber = (site?.whatsapp || "").replace(/\D/g, "");

  const quickContacts = QUICK_CONTACTS.map((item) => {
    if (item.title === "Emergency Hotline") {
      return {
        ...item,
        value: info.PHONE,
        href: telHref,
        desc: site?.emergencyNote || "",
      };
    }
    if (item.title === "WhatsApp") {
      return {
        ...item,
        value: info.PHONE,
        href: waNumber ? `https://wa.me/${waNumber}` : null,
      };
    }
    return {
      ...item,
      value: info.EMAIL,
      href: info.EMAIL ? `mailto:${info.EMAIL}` : null,
    };
  }).filter((item) => Boolean(item.href));

  // A social icon only renders when the admin has supplied a URL for it.
  const socials = SOCIAL_LINKS.map((social) => ({
    ...social,
    href: site?.[social.urlField] || null,
  })).filter((social) => Boolean(social.href));

  const faqs = Array.isArray(site?.faqs) ? site.faqs : [];
  const mapSrc = site?.mapEmbedUrl || null;

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

  const mapApiErrors = (errors = {}) => {
    const mapped = { ...errors };
    if (errors.name) {
      if (!mapped.firstName) mapped.firstName = "Please check your first name";
      if (!mapped.lastName) mapped.lastName = "Please check your last name";
      delete mapped.name;
    }
    return mapped;
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

      const data = formCheck.data;
      const name = `${data.firstName} ${data.lastName}`.trim();
      const subjectParts = [
        CONTENT.FORM_TITLES[activeTab] || activeTab,
        data.position
          ? CONTENT.POSITIONS.find((p) => p.value === data.position)?.label ||
            data.position
          : "",
      ].filter(Boolean);

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email: data.email,
          phone: data.phone,
          subject: subjectParts.join(" - "),
          message: data.message,
          _honeypot: e.target._honeypot?.value || "",
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        if (json.errors) {
          const mapped = mapApiErrors(json.errors);
          setFieldErrors(mapped);
          focusFirstError(mapped);
        }
        throw new Error(json.message || "Failed to send message");
      }

      setStatus({
        type: "success",
        text: "Message sent successfully! We will get back to you soon.",
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
        <PageHeroBand
          image="/images/6psd.png"
          crumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
          title="Contact Us"
          tagline="Reach the lab by phone, email or the form below — we usually reply the same day."
        />

        {/* Quick Contact Banner - from QUICK_CONTACTS */}
        <section className="py-4 lg:py-8 bg-white">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3 lg:gap-6">
              {quickContacts.map((item) => (
                <a
                  key={item.title}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl p-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 lg:gap-4 lg:p-4 ${
                    item.highlight
                      ? "bg-sky-50 ring-1 ring-sky-200 hover:bg-sky-100"
                      : "bg-slate-50 hover:bg-sky-50"
                  }`}
                >
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-sky-100 lg:h-12 lg:w-12 [&>svg]:h-8 [&>svg]:w-8 lg:[&>svg]:h-9 lg:[&>svg]:w-9">
                    {item.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="t-caption text-slate-500">{item.title}</p>
                    <p className="truncate t-meta font-semibold text-slate-900">
                      {item.value}
                    </p>
                    <p className="t-caption text-slate-500">{item.desc}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Content */}
        <section className="py-4 lg:py-12 bg-white">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-6 lg:gap-16">
              {/* Contact Form - title changes based on activeTab */}
              <div className="bg-slate-50 rounded-2xl p-0 border border-slate-100">
                <div className="bg-[#FF6B6B] w-full px-3 lg:px-4 py-1.5 lg:py-2 rounded-tr-xl">
                  <h2 className="t-h3 font-bold text-white lg:t-h2">
                    {CONTENT.FORM_TITLES[activeTab]}
                  </h2>
                </div>

                {/* What is this about? Picks the form mode. */}
                <div
                  role="tablist"
                  aria-label="What is your message about?"
                  className="flex flex-wrap gap-2 border-b border-slate-200 px-4 pt-4 lg:px-10 lg:pt-6"
                >
                  {CONTACT_TABS.map((tab) => {
                    const selected = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        role="tab"
                        aria-selected={selected}
                        onClick={() => setActiveTab(tab.id)}
                        className={`rounded-lg px-3 py-1.5 t-caption font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 lg:px-4 lg:py-2 lg:t-meta ${
                          selected
                            ? "bg-sky-600 text-white"
                            : "bg-white text-slate-600 hover:bg-sky-50 hover:text-sky-700"
                        }`}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
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
                    className="w-full py-2.5 lg:py-3.5 bg-sky-600 text-white text-xs lg:text-sm font-semibold rounded-lg lg:rounded-xl hover:bg-sky-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {submitting ? "Sending..." : "Send Message"}
                  </button>
                </form>
              </div>

              {/* Contact Info — from the SiteContact table (/admin/contact) */}
              <div className="space-y-4 lg:space-y-8 w-full">
                <div className="bg-sky-600 w-full px-4 lg:px-6 py-1.5 lg:py-2 rounded-tr-xl">
                  <h2 className="text-sm lg:text-xl font-bold text-white">
                    Get in Touch
                  </h2>
                </div>

                {/* Info Cards */}
                <div className="space-y-4">
                  <InfoCard
                    title="Our Location"
                    content={info.LOCATION}
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
                        <circle cx="60" cy="44" r="6" fill="#FF6B6B" />
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
                    content={info.PHONE}
                    href={telHref}
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
                          stroke="#FF6B6B"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                        <path
                          d="M78 22 Q96 34 96 54"
                          fill="none"
                          stroke="#FF6B6B"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                        <circle cx="68" cy="30" r="3.5" fill="#FF6B6B" />
                      </svg>
                    }
                  />
                  <InfoCard
                    title="Working Hours"
                    content={info.HOURS}
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
                          stroke="#FF6B6B"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                        <circle cx="60" cy="62" r="4" fill="#FF6B6B" />
                        <circle cx="60" cy="22" r="6" fill="#FF6B6B" />
                        <line
                          x1="60"
                          y1="14"
                          x2="60"
                          y2="11"
                          stroke="#FF6B6B"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                        <line
                          x1="66"
                          y1="16"
                          x2="68"
                          y2="14"
                          stroke="#FF6B6B"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                        <line
                          x1="54"
                          y1="16"
                          x2="52"
                          y2="14"
                          stroke="#FF6B6B"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    }
                  />
                  <InfoCard
                    title="Email"
                    content={info.EMAIL}
                    href={`mailto:${info.EMAIL}`}
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
                        <circle cx="60" cy="57" r="14" fill="#FF6B6B" />
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
                  <ul className="flex flex-wrap gap-3">
                    {socials.map((social) => (
                      <li key={social.name}>
                        <a
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ background: social.background }}
                          className="flex h-11 w-11 items-center justify-center rounded-xl text-white transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
                        >
                          <span className="sr-only">{social.name}</span>
                          <svg
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="h-5 w-5"
                            aria-hidden="true"
                          >
                            <path d={social.path} />
                          </svg>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section — from the ContactFaq table (/admin/contact) */}
        <section className="py-8 lg:py-24 bg-slate-50">
          <div className="max-w-3xl mx-auto px-3 sm:px-6 lg:px-8">
            <div className="text-center mb-6 lg:mb-12">
              <h2 className="text-lg lg:text-3xl font-bold text-slate-900 mb-2 lg:mb-4 border-b-2 lg:border-b-4 border-[#FF6B6B] inline-block pb-1 lg:pb-2">
                FAQs
              </h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden"
                >
                  <button
                    type="button"
                    aria-expanded={expandedFaq === index}
                    aria-controls={`faq-answer-${index}`}
                    id={`faq-question-${index}`}
                    onClick={() =>
                      setExpandedFaq(expandedFaq === index ? null : index)
                    }
                    className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sky-500"
                  >
                    <span className="t-body font-medium text-slate-900">
                      {faq.question}
                    </span>
                    <svg
                      className={`h-5 w-5 flex-shrink-0 text-slate-500 transition-transform ${expandedFaq === index ? "rotate-180" : ""}`}
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
                    <div
                      id={`faq-answer-${index}`}
                      role="region"
                      aria-labelledby={`faq-question-${index}`}
                      className="px-6 pb-4"
                    >
                      <p className="t-body text-slate-600">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Map Section — only when an embed URL is set in admin */}
        {mapSrc && (
        <section className="w-full">
          <div className="bg-sky-600 px-4 lg:px-6 py-2 lg:py-3 w-full text-left">
            <h2 className="text-sm lg:text-xl font-bold text-white">
              Cutis Path Lab
            </h2>
          </div>
          <iframe
            title="Cutis Path Lab location on Google Maps"
            width="100%"
            height="400"
            frameBorder="0"
            src={mapSrc}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="block h-[250px] w-full lg:h-[400px]"
          ></iframe>
        </section>
        )}
      </main>
      <Footer />
    </>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <ContactPageContent />
    </Suspense>
  );
}
