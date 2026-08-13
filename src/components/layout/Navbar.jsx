"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { LocationIcon, PhoneIcon, EmailIcon, FacebookIcon, InstagramIcon, TwitterIcon, WhatsAppIcon, SearchIcon } from "./NavIcons";
import { tests } from "@/data/staticData";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/tests", label: "Our Tests" },
  { href: "/packages", label: "Packages" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Elevate the header once the page scrolls under it
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Search state ─────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchActiveIdx, setSearchActiveIdx] = useState(-1);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const mobileSearchInputRef = useRef(null);

  // Combined dataset: tests (from staticData) + packages (inline, matching packages/page.jsx)
  const searchItems = useMemo(() => {
    const PACKAGES = [
      { id: 1, name: "Complete Blood Count", description: "Comprehensive blood analysis including RBC, WBC, platelets, hemoglobin, and hematocrit.", type: "package" },
      { id: 2, name: "Liver Function Test", description: "Tests for liver health including enzymes, bilirubin, and protein levels.", type: "package" },
      { id: 3, name: "Kidney Function Test", description: "Evaluates kidney performance through blood urea and creatinine tests.", type: "package" },
      { id: 4, name: "Thyroid Profile", description: "Complete thyroid function assessment including T3, T4, and TSH.", type: "package" },
      { id: 5, name: "Blood Sugar Fasting", description: "Fasting blood glucose test for diabetes screening and management.", type: "package" },
      { id: 6, name: "Lipid Profile", description: "Cholesterol and triglyceride assessment for heart health.", type: "package" },
      { id: 7, name: "Hemoglobin A1C", description: "Long-term blood sugar monitoring for diabetes management.", type: "package" },
      { id: 8, name: "Vitamin D3", description: "Test for Vitamin D deficiency and bone health assessment.", type: "package" },
      { id: 9, name: "Iron Studies", description: "Comprehensive iron deficiency and anemia workup.", type: "package" },
      { id: 10, name: "Dengue NS1 Antigen", description: "Early detection test for dengue fever infection.", type: "package" },
      { id: 11, name: "Urine Analysis", description: "Complete urine examination for kidney and urinary tract health.", type: "package" },
      { id: 12, name: "ECG", description: "Electrocardiogram for heart rhythm and function assessment.", type: "package" },
      { id: 13, name: "Vitamin B12", description: "Test for Vitamin B12 deficiency and neurological health.", type: "package" },
      { id: 14, name: "HbA1c & Glucose", description: "Combined test for diabetes diagnosis and monitoring.", type: "package" },
      { id: 15, name: "Uric Acid", description: "Test for gout and kidney stone risk assessment.", type: "package" },
      { id: 16, name: "ESR", description: "Erythrocyte sedimentation rate for inflammation detection.", type: "package" },
      { id: 17, name: "Malaria Antigen", description: "Rapid test for malaria parasite detection.", type: "package" },
      { id: 18, name: "Pregnancy Test", description: "Beta HCG test for pregnancy confirmation.", type: "package" },
      { id: 19, name: "Semen Analysis", description: "Complete semen examination for fertility assessment.", type: "package" },
      { id: 20, name: "Stool Routine", description: "Complete stool examination for digestive health.", type: "package" },
      { id: 21, name: "Blood Group & Rh", description: "ABO blood group and Rh factor determination.", type: "package" },
      { id: 22, name: "Coagulation Profile", description: "Blood clotting function assessment.", type: "package" },
      { id: 23, name: "Serum Electrolytes", description: "Electrolyte balance assessment for hydration status.", type: "package" },
      { id: 24, name: "Amylase & Lipase", description: "Pancreatic enzyme test for pancreatitis diagnosis.", type: "package" },
      { id: 25, name: "Prostate Specific Antigen", description: "PSA test for prostate health screening.", type: "package" },
    ];

    const testsNormalized = tests.map((t) => ({
      id: t.id,
      name: t.name,
      description: t.description,
      type: "test",
    }));

    return [...PACKAGES, ...testsNormalized];
  }, []);

  const highlightedLabel = (text, query) => {
    if (!query.trim()) return text;
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return text;
    return (
      <>
        {text.slice(0, idx)}
        <span className="text-[#FF6B6B] font-semibold">{text.slice(idx, idx + query.length)}</span>
        {text.slice(idx + query.length)}
      </>
    );
  };

  const handleSearchChange = useCallback(
    (e) => {
      const q = e.target.value;
      setSearchQuery(q);
      if (q.trim().length > 0) {
        const lowerQ = q.toLowerCase();
        const filtered = searchItems.filter(
          (item) =>
            item.name.toLowerCase().includes(lowerQ) ||
            (item.description ?? "").toLowerCase().includes(lowerQ)
        );
        setSearchResults(filtered.slice(0, 8));
        setSearchActiveIdx(-1);
        setShowSearchDropdown(true);
      } else {
        setSearchResults([]);
        setShowSearchDropdown(false);
      }
    },
    [searchItems]
  );

  const navigateToResult = useCallback(
    (item) => {
      setShowSearchDropdown(false);
      setSearchQuery("");
      setIsOpen(false);
      if (item.type === "test") {
        router.push(`/book?testIds=${encodeURIComponent(item.id)}`);
      } else {
        router.push(`/book-package/${item.id}`);
      }
    },
    [router]
  );

  // Close desktop search dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Escape closes mobile menu / search
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      setIsOpen(false);
      setMobileSearchOpen(false);
      setShowSearchDropdown(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Focus mobile search when opened
  useEffect(() => {
    if (mobileSearchOpen) {
      mobileSearchInputRef.current?.focus();
    }
  }, [mobileSearchOpen]);

  const closeMobileMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setIsOpen((open) => {
      const next = !open;
      if (next) setMobileSearchOpen(false);
      return next;
    });
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsOpen(false);
    setMobileSearchOpen(false);
    setShowSearchDropdown(false);
  }, [pathname]);

  const searchKeyDown = (e) => {
    if (e.key === "Escape") {
      setShowSearchDropdown(false);
      setSearchActiveIdx(-1);
      setMobileSearchOpen(false);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSearchActiveIdx((prev) =>
        prev < searchResults.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSearchActiveIdx((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (searchResults[searchActiveIdx]) {
        navigateToResult(searchResults[searchActiveIdx]);
      } else if (searchResults.length > 0) {
        navigateToResult(searchResults[0]);
      }
    }
  };

  const renderSearchResults = (compact = false) => (
    <>
      {showSearchDropdown && searchResults.length > 0 && (
        <div
          className={`absolute left-0 right-0 mt-2 bg-white border border-sky-100 rounded-2xl shadow-xl z-50 overflow-hidden ${
            compact ? "max-h-64" : "max-h-80"
          } overflow-y-auto`}
        >
          {searchResults.map((item, idx) => (
            <button
              key={item.id + item.type}
              type="button"
              onClick={() => navigateToResult(item)}
              className={`w-full px-4 py-3 flex items-center gap-3 text-left transition-colors ${
                idx === searchActiveIdx ? "bg-sky-50" : "hover:bg-slate-50"
              }`}
            >
              <span
                className={`flex-shrink-0 w-7 h-7 rounded-xl flex items-center justify-center t-caption font-bold ${
                  item.type === "test"
                    ? "bg-sky-100 text-sky-700"
                    : "bg-[#FF6B6B]/15 text-[#FF6B6B]"
                }`}
              >
                {item.type === "test" ? "T" : "P"}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-800 truncate">
                  {highlightedLabel(item.name, searchQuery)}
                </p>
                <p className="text-xs text-slate-400 truncate">
                  {item.type === "test" ? "Test" : "Package"}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
      {showSearchDropdown &&
        searchQuery.trim().length > 0 &&
        searchResults.length === 0 && (
          <div className="absolute left-0 right-0 mt-2 bg-white border border-sky-100 rounded-2xl shadow-xl z-50 px-4 py-6 text-center">
            <p className="text-sm text-slate-500">
              No results for{" "}
              <span className="font-semibold text-slate-700">&quot;{searchQuery}&quot;</span>
            </p>
          </div>
        )}
    </>
  );

  return (
    <div className="fixed left-0 right-0 top-0 z-50 transition-all duration-300">

{/* TOP BAR — desktop utility strip only */}
      <div className="hidden border-b border-sky-800/40 bg-gradient-to-r from-sky-700 via-sky-600 to-sky-700 text-white lg:block">
        <div className="w-full px-6">
          <div className="flex items-center justify-between gap-4 py-2">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1 t-meta">
              <span className="flex items-center gap-1.5 text-white/85">
                <LocationIcon size={15} className="text-white/85" />
                Kathmandu, Bagmati, Nepal
              </span>
              <span className="h-3 w-px bg-white/25" aria-hidden="true" />
              <a
                href="tel:+9779825849435"
                className="flex items-center gap-1.5 text-white/85 transition-colors hover:text-white"
              >
                <PhoneIcon size={15} className="text-white/85" />
                +977-9825849435
              </a>
              <span className="h-3 w-px bg-white/25" aria-hidden="true" />
              <a
                href="mailto:cutislabpath@gmail.com"
                className="flex items-center gap-1.5 text-white/85 transition-colors hover:text-white"
              >
                <EmailIcon size={15} className="text-white/85" />
                cutislabpath@gmail.com
              </a>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white/85 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/20 hover:text-white"
              >
                <FacebookIcon size={14} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white/85 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/20 hover:text-white"
              >
                <InstagramIcon size={14} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white/85 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/20 hover:text-white"
              >
                <TwitterIcon size={14} />
              </a>
              <a
                href="https://wa.me/9779825849435"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white/85 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#25D366] hover:text-white"
              >
                <WhatsAppIcon size={14} accent={false} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN NAVBAR */}
      <nav
        className={`relative z-[60] border-b bg-white/95 backdrop-blur-md transition-shadow duration-300 ${
          scrolled
            ? "border-sky-200 shadow-[0_8px_28px_rgba(2,132,199,0.12)]"
            : "border-sky-100 shadow-[0_4px_24px_rgba(2,132,199,0.06)]"
        }`}
      >
        <div className="w-full px-4 sm:px-6 relative z-[70]">
          <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">

            {/* Logo */}
            <Link
              href="/"
              className="flex items-center shrink-0 transition-transform duration-200 hover:scale-[1.03]"
              onClick={closeMobileMenu}
            >
              <Image
                src="/images/cutis.png"
                alt="CUTIS Lab"
                width={120}
                height={45}
                className="w-[108px] sm:w-28 lg:w-32 h-auto"
                priority
              />
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-1 ml-8">
              {navLinks.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`group relative px-4 py-2.5 text-base font-medium rounded-lg transition-colors duration-200 ${
                      active
                        ? "text-sky-600"
                        : "text-slate-700 hover:text-sky-600 hover:bg-sky-50/80"
                    }`}
                  >
                    {link.label}
                    <span
                      className={`absolute bottom-1 left-1/2 h-0.5 -translate-x-1/2 rounded-full bg-[#FF6B6B] transition-all duration-300 ${
                        active ? "w-6" : "w-0 group-hover:w-6"
                      }`}
                      aria-hidden="true"
                    />
                  </Link>
                );
              })}
            </div>

             {/* Desktop Right */}
             <div className="hidden lg:flex items-center gap-4">
                <div className="relative flex items-center" ref={searchRef}>
                  <input
                    type="text"
                    placeholder="Search tests & packages"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onFocus={() => searchQuery.trim() && setShowSearchDropdown(true)}
                    onKeyDown={searchKeyDown}
                    className="w-64 rounded-full border border-sky-200 bg-sky-50/50 px-4 py-2 pr-11 text-slate-900 transition-colors focus:border-sky-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-sky-100"
                  />
                  <div className="pointer-events-none absolute right-1 flex h-8 w-8 items-center justify-center rounded-full bg-[#FF6B6B]">
                    <SearchIcon size={15} className="text-white" />
                  </div>
                  {renderSearchResults()}
                </div>

              <Link
                href="/book"
                className="rounded-lg bg-gradient-to-r from-sky-600 to-sky-500 px-5 py-2 text-base font-semibold text-white shadow-md shadow-sky-500/25 transition-all duration-200 hover:-translate-y-0.5 hover:from-sky-700 hover:to-sky-600 hover:shadow-lg hover:shadow-sky-500/35"
              >
                Book Test
              </Link>

              <Link
                href="/download-report"
                className="rounded-lg border-2 border-[#FF6B6B]/70 bg-transparent px-5 py-2 text-base font-semibold text-[#FF6B6B] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#FF6B6B] hover:bg-red-50"
              >
                Report
              </Link>
            </div>

            {/* Mobile / tablet — Search + Menu (stays above overlay) */}
            <div className="lg:hidden flex items-center gap-2 relative z-[80]">
              <button
                type="button"
                data-mobile-search-toggle
                onClick={() => {
                  setMobileSearchOpen((v) => !v);
                  setIsOpen(false);
                }}
                className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-200 active:scale-95 ${
                  mobileSearchOpen
                    ? "border-sky-400 bg-sky-50 text-sky-700"
                    : "border-slate-200 bg-white text-slate-600"
                }`}
                aria-label="Search tests"
                aria-expanded={mobileSearchOpen}
              >
                <SearchIcon size={18} />
              </button>
              <button
                type="button"
                className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 active:scale-95 ${
                  isOpen
                    ? "bg-slate-900 text-white"
                    : "bg-sky-600 text-white hover:bg-sky-700"
                }`}
                onClick={toggleMobileMenu}
                aria-label={isOpen ? "Close menu" : "Open menu"}
                aria-expanded={isOpen}
                aria-controls="mobile-nav-panel"
              >
                {isOpen ? (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.25} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.25} d="M4 7h16M4 12h16M4 17h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile search sheet */}
        <div
          ref={mobileSearchRef}
          className={`lg:hidden overflow-hidden border-t border-sky-50 transition-[max-height,opacity] duration-300 ease-out ${
            mobileSearchOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-4 py-3 bg-slate-50">
            <div className="relative">
              <input
                ref={mobileSearchInputRef}
                type="search"
                placeholder="Search tests & packages"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => searchQuery.trim() && setShowSearchDropdown(true)}
                onKeyDown={searchKeyDown}
                className="w-full rounded-xl border border-sky-200 bg-white pl-4 pr-11 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg bg-[#FF6B6B] flex items-center justify-center pointer-events-none">
                <SearchIcon size={14} className="text-white" />
              </div>
              {renderSearchResults(true)}
            </div>
          </div>
        </div>

        {/* Mobile / tablet menu — drops under header; hamburger stays clickable */}
        {isOpen && (
          <>
            <button
              type="button"
              className="lg:hidden fixed inset-x-0 top-14 sm:top-16 bottom-0 z-[55] bg-slate-900/35"
              aria-label="Close menu"
              onClick={closeMobileMenu}
            />
            <div
              id="mobile-nav-panel"
              className="lg:hidden absolute left-0 right-0 top-full z-[65] border-t border-slate-100 bg-white shadow-xl max-h-[min(72vh,calc(100dvh-8.5rem))] overflow-y-auto"
              role="dialog"
              aria-modal="true"
              aria-label="Site menu"
            >
              <nav className="px-3 py-2">
                {navLinks.map((link) => {
                  const active = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={closeMobileMenu}
                      className={`flex items-center justify-between rounded-xl px-4 py-3.5 t-body font-semibold transition-colors ${
                        active
                          ? "bg-sky-50 text-sky-700"
                          : "text-slate-800 active:bg-slate-50"
                      }`}
                    >
                      <span>{link.label}</span>
                      {active && (
                        <span className="h-1.5 w-1.5 rounded-full bg-[#FF6B6B]" aria-hidden />
                      )}
                    </Link>
                  );
                })}
              </nav>

              <div className="px-4 pb-5 pt-2 space-y-2.5 border-t border-slate-100">
                <Link
                  href="/book"
                  onClick={closeMobileMenu}
                  className="flex items-center justify-center w-full rounded-xl bg-sky-600 py-3 text-sm font-bold text-white"
                >
                  Book a Test
                </Link>
                <div className="grid grid-cols-2 gap-2.5">
                  <Link
                    href="/download-report"
                    onClick={closeMobileMenu}
                    className="flex items-center justify-center rounded-xl border border-[#FF6B6B]/50 py-2.5 text-sm font-semibold text-[#FF6B6B]"
                  >
                    Report
                  </Link>
                  <a
                    href="tel:+9779825849435"
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-700"
                  >
                    <PhoneIcon size={16} />
                    Call
                  </a>
                </div>
              </div>
            </div>
          </>
        )}

        </nav>

      {/* Floating WhatsApp — phone only */}
      <a
        href="https://wa.me/9779861848382"
        className="sm:hidden fixed bottom-4 right-3 z-40"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp support"
      >
        <div className="w-12 h-12 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg ring-4 ring-white">
          <WhatsAppIcon size={24} className="text-white" accent={false} />
        </div>
      </a>
    </div>
  );
}
