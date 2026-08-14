"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { LocationIcon, PhoneIcon, EmailIcon, FacebookIcon, InstagramIcon, TwitterIcon, WhatsAppIcon, SearchIcon } from "./NavIcons";
import { tests } from "@/data/staticData";

const navLinks = [
  { href: "/", label: "Home", icon: "home" },
  { href: "/services", label: "Services", icon: "flask" },
  { href: "/tests", label: "Our Tests", icon: "clipboard" },
  { href: "/packages", label: "Packages", icon: "box" },
  { href: "/gallery", label: "Gallery", icon: "image" },
  { href: "/about", label: "About Us", icon: "info" },
  { href: "/contact", label: "Contact Us", icon: "chat" },
];

const NAV_ICON_PATHS = {
  home: "M3 11.5 12 4l9 7.5M5.5 10v9a1 1 0 001 1H10v-5.5a1 1 0 011-1h2a1 1 0 011 1V20h3.5a1 1 0 001-1v-9",
  flask:
    "M9.5 3.5h5M10 4v5.5L5.75 17a1.5 1.5 0 001.3 2.25h9.9a1.5 1.5 0 001.3-2.25L14 9.5V4M8.5 14.5h7",
  clipboard:
    "M9 4.5h6a1 1 0 011 1V6h1.5a1 1 0 011 1v12a1 1 0 01-1 1h-11a1 1 0 01-1-1V7a1 1 0 011-1H8v-.5a1 1 0 011-1zM9 12l2 2 4-4",
  box: "M3.5 8.5 12 4l8.5 4.5L12 13 3.5 8.5zM3.5 8.5V16L12 20.5M20.5 8.5V16L12 20.5M12 13v7.5",
  image:
    "M4.5 5h15a1 1 0 011 1v12a1 1 0 01-1 1h-15a1 1 0 01-1-1V6a1 1 0 011-1zM8 10.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM4 17l5.5-5.5a1.5 1.5 0 012.12 0L15 15M15 15l1.88-1.88a1.5 1.5 0 012.12 0L20.5 15.5",
  info: "M12 3.5a8.5 8.5 0 100 17 8.5 8.5 0 000-17zM12 11v5.5M12 8.25v.01",
  chat: "M4.5 5.5h15a1 1 0 011 1v9a1 1 0 01-1 1H10l-4.5 4v-4H4.5a1 1 0 01-1-1v-9a1 1 0 011-1z",
};

function NavLinkIcon({ id, className = "" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={NAV_ICON_PATHS[id]} />
    </svg>
  );
}

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

        </nav>

      {/*
        Mobile / tablet menu — a right-side slide-in drawer. It lives outside
        <nav> on purpose: the nav's backdrop-blur establishes a containing
        block for fixed descendants, which would pin the drawer under the
        header instead of letting it cover the full viewport height.
      */}
      <button
        type="button"
        tabIndex={isOpen ? 0 : -1}
        aria-hidden={!isOpen}
        className={`lg:hidden fixed inset-0 z-[85] bg-slate-900/55 backdrop-blur-[2px] transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-label="Close menu"
        onClick={closeMobileMenu}
      />

      <aside
        id="mobile-nav-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        className={`lg:hidden fixed inset-y-0 right-0 z-[90] flex h-dvh w-[84%] max-w-[360px] flex-col bg-white shadow-[-12px_0_40px_rgba(15,23,42,0.22)] transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="relative shrink-0 overflow-hidden bg-gradient-to-br from-sky-600 via-sky-600 to-sky-500 px-5 pb-5 pt-[max(1.1rem,env(safe-area-inset-top))]">
          <div
            className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full bg-white/10"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -left-6 bottom-0 h-20 w-20 rounded-full bg-[#FF6B6B]/20 blur-xl"
            aria-hidden="true"
          />
          <div className="relative flex items-center justify-between gap-3">
            <Link href="/" onClick={closeMobileMenu} className="flex items-center rounded-lg bg-white/95 px-2.5 py-1.5 shadow-sm">
              <Image
                src="/images/cutis.png"
                alt="CUTIS Lab"
                width={120}
                height={45}
                className="h-auto w-[100px]"
              />
            </Link>
            <button
              type="button"
              onClick={closeMobileMenu}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white transition-colors active:scale-95 active:bg-white/25"
              aria-label="Close menu"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.25} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="relative mt-3 t-caption font-medium text-white/85">
            Trusted diagnostics, transparent results.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain">
          <nav className="px-3 py-3">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMobileMenu}
                  className={`group mb-1 flex items-center gap-3 rounded-xl px-3 py-3 t-body font-semibold transition-colors ${
                    active
                      ? "bg-sky-50 text-sky-700"
                      : "text-slate-700 active:bg-slate-50"
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors ${
                      active
                        ? "bg-sky-600 text-white"
                        : "bg-slate-100 text-slate-500 group-active:bg-sky-100 group-active:text-sky-600"
                    }`}
                  >
                    <NavLinkIcon id={link.icon} className="h-[18px] w-[18px]" />
                  </span>
                  <span className="flex-1">{link.label}</span>
                  {active ? (
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#FF6B6B]" aria-hidden />
                  ) : (
                    <svg className="h-4 w-4 shrink-0 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="space-y-2.5 border-t border-slate-100 px-4 pb-4 pt-3">
            <Link
              href="/book"
              onClick={closeMobileMenu}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-600 to-sky-500 py-3 text-sm font-bold text-white shadow-md shadow-sky-500/25"
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

          <div className="border-t border-slate-100 px-4 py-4">
            <p className="mb-2.5 t-caption font-bold uppercase tracking-wider text-slate-400">
              Get in touch
            </p>
            <ul className="space-y-2.5 t-body text-slate-600">
              <li className="flex items-start gap-2.5">
                <LocationIcon size={16} className="mt-0.5 shrink-0 text-sky-600" />
                Kathmandu, Bagmati, Nepal
              </li>
              <li>
                <a href="tel:+9779825849435" className="flex items-center gap-2.5">
                  <PhoneIcon size={16} className="shrink-0 text-sky-600" />
                  +977-9825849435
                </a>
              </li>
              <li>
                <a href="mailto:cutislabpath@gmail.com" className="flex items-center gap-2.5 break-all">
                  <EmailIcon size={16} className="shrink-0 text-sky-600" />
                  cutislabpath@gmail.com
                </a>
              </li>
            </ul>

            <div className="mt-4 flex items-center gap-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-50 text-sky-600 transition-colors active:bg-sky-100"
              >
                <FacebookIcon size={16} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-50 text-sky-600 transition-colors active:bg-sky-100"
              >
                <InstagramIcon size={16} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-50 text-sky-600 transition-colors active:bg-sky-100"
              >
                <TwitterIcon size={16} />
              </a>
              <a
                href="https://wa.me/9779825849435"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366]/10 text-[#25D366] transition-colors active:bg-[#25D366]/20"
              >
                <WhatsAppIcon size={16} accent={false} />
              </a>
            </div>
          </div>

          <div className="h-[env(safe-area-inset-bottom)]" aria-hidden="true" />
        </div>
      </aside>

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
