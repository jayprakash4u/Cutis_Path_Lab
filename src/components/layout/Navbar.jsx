"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LocationIcon,
  PhoneIcon,
  EmailIcon,
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
  WhatsAppIcon,
  SearchIcon,
} from "./NavIcons";
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
  const pathname = usePathname();
  const router = useRouter();

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
        <mark className="bg-clinical-100 font-semibold text-clinical-700">
          {text.slice(idx, idx + query.length)}
        </mark>
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
          className={`absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-md border border-line bg-surface shadow-3 ${
            compact ? "max-h-64" : "max-h-80"
          } overflow-y-auto`}
        >
          {searchResults.map((item, idx) => (
            <button
              key={item.id + item.type}
              type="button"
              onClick={() => navigateToResult(item)}
              className={`flex w-full items-center gap-3 border-b border-line px-4 py-2.5 text-left transition-colors last:border-b-0 ${
                idx === searchActiveIdx ? "bg-clinical-50" : "hover:bg-paper"
              }`}
            >
              <span
                className={`mono flex h-6 w-6 shrink-0 items-center justify-center rounded-xs text-[10px] font-semibold ${
                  item.type === "test"
                    ? "bg-clinical-100 text-clinical-700"
                    : "bg-assay-100 text-assay-700"
                }`}
              >
                {item.type === "test" ? "T" : "P"}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink-800">
                  {highlightedLabel(item.name, searchQuery)}
                </p>
                <p className="label mt-0.5">
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
          <div className="absolute left-0 right-0 z-50 mt-2 rounded-md border border-line bg-surface px-4 py-6 text-center shadow-3">
            <p className="text-sm text-ink-500">
              Nothing matches{" "}
              <span className="font-semibold text-ink-800">
                &ldquo;{searchQuery}&rdquo;
              </span>
              . Try a shorter word.
            </p>
          </div>
        )}
    </>
  );

  return (
    <div className="fixed left-0 right-0 top-0 z-50">
      {/* UTILITY STRIP — desktop only */}
      <div className="hidden bg-ink-900 text-clinical-100/70 lg:block">
        <div className="shell-wide">
          <div className="mono flex items-center justify-between gap-4 py-2 text-[11px] tracking-wide">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
              <span className="flex items-center gap-1.5">
                <LocationIcon size={13} />
                Mid-Baneshwor, Kathmandu
              </span>
              <span className="h-3 w-px bg-white/15" aria-hidden="true" />
              <a
                href="tel:+9779825849435"
                className="flex items-center gap-1.5 transition-colors hover:text-white"
              >
                <PhoneIcon size={13} />
                +977-9825849435
              </a>
              <span className="h-3 w-px bg-white/15" aria-hidden="true" />
              <a
                href="mailto:cutislabpath@gmail.com"
                className="flex items-center gap-1.5 transition-colors hover:text-white"
              >
                <EmailIcon size={13} />
                cutislabpath@gmail.com
              </a>
            </div>
            <div className="flex items-center gap-1">
              <span className="mr-2 hidden text-[10px] uppercase tracking-[0.16em] text-clinical-200/50 xl:inline">
                Open 365 days
              </span>
              {[
                { href: "https://facebook.com", label: "Facebook", Icon: FacebookIcon },
                { href: "https://instagram.com", label: "Instagram", Icon: InstagramIcon },
                { href: "https://twitter.com", label: "Twitter", Icon: TwitterIcon },
                { href: "https://wa.me/9779825849435", label: "WhatsApp", Icon: WhatsAppIcon },
              ].map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-7 w-7 items-center justify-center rounded-xs transition-colors hover:bg-white/10 hover:text-white"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MAIN NAVBAR */}
      <nav className="relative z-[60] border-b border-line bg-surface/95 backdrop-blur-md">
        <div className="shell-wide relative z-[70]">
          <div className="flex h-14 items-center justify-between gap-6 sm:h-16 lg:h-[3.75rem]">
            {/* Logo */}
            <Link
              href="/"
              className="flex shrink-0 items-center"
              onClick={closeMobileMenu}
            >
              <Image
                src="/images/cutis.png"
                alt="Cutis Path Lab"
                width={120}
                height={45}
                className="h-auto w-[104px] sm:w-28 lg:w-[7.5rem]"
                priority
              />
            </Link>

            {/* Desktop Menu */}
            <div className="hidden items-center lg:flex">
              {navLinks.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative px-3.5 py-5 text-[14px] font-medium transition-colors xl:px-4 ${
                      active
                        ? "text-clinical-700"
                        : "text-ink-600 hover:text-clinical-700"
                    }`}
                  >
                    {link.label}
                    <span
                      className={`absolute inset-x-3 bottom-0 h-0.5 rounded-full transition-colors ${
                        active ? "bg-clinical-600" : "bg-transparent"
                      }`}
                      aria-hidden="true"
                    />
                  </Link>
                );
              })}
            </div>

            {/* Desktop Right */}
            <div className="hidden shrink-0 items-center gap-2.5 lg:flex">
              <div className="relative flex items-center" ref={searchRef}>
                <SearchIcon
                  size={15}
                  className="pointer-events-none absolute left-3 text-ink-400"
                />
                <input
                  type="text"
                  placeholder="Search tests"
                  aria-label="Search tests and packages"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => searchQuery.trim() && setShowSearchDropdown(true)}
                  onKeyDown={searchKeyDown}
                  className="w-48 rounded-md border border-line bg-paper py-2 pl-9 pr-3 text-sm text-ink-800 placeholder:text-ink-400 transition focus:border-clinical-500 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-clinical-100 xl:w-56"
                />
                {renderSearchResults()}
              </div>

              <Link href="/book" className="btn-primary">
                Book a test
              </Link>
            </div>

            {/* Mobile / tablet — Search + Menu (stays above overlay) */}
            <div className="relative z-[80] flex items-center gap-2 lg:hidden">
              <button
                type="button"
                data-mobile-search-toggle
                onClick={() => {
                  setMobileSearchOpen((v) => !v);
                  setIsOpen(false);
                }}
                className={`flex h-10 w-10 items-center justify-center rounded-md border transition-colors ${
                  mobileSearchOpen
                    ? "border-clinical-500 bg-clinical-50 text-clinical-700"
                    : "border-line bg-surface text-ink-500"
                }`}
                aria-label="Search tests"
                aria-expanded={mobileSearchOpen}
              >
                <SearchIcon size={18} />
              </button>
              <button
                type="button"
                className={`flex h-10 w-10 items-center justify-center rounded-md transition-colors ${
                  isOpen
                    ? "bg-ink-900 text-white"
                    : "bg-clinical-600 text-white hover:bg-clinical-700"
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
          className={`overflow-hidden border-t border-line transition-[max-height,opacity] duration-300 ease-out lg:hidden ${
            mobileSearchOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-paper px-4 py-3">
            <div className="relative">
              <SearchIcon
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400"
              />
              <input
                ref={mobileSearchInputRef}
                type="search"
                placeholder="Search tests & packages"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => searchQuery.trim() && setShowSearchDropdown(true)}
                onKeyDown={searchKeyDown}
                className="w-full rounded-md border border-line bg-surface py-3 pl-10 pr-4 text-sm text-ink-800 placeholder:text-ink-400 outline-none focus:border-clinical-500 focus:ring-2 focus:ring-clinical-100"
              />
              {renderSearchResults(true)}
            </div>
          </div>
        </div>

        {/* Mobile / tablet menu — drops under header; hamburger stays clickable */}
        {isOpen && (
          <>
            <button
              type="button"
              className="fixed inset-x-0 bottom-0 top-14 z-[55] bg-ink-900/40 sm:top-16 lg:hidden"
              aria-label="Close menu"
              onClick={closeMobileMenu}
            />
            <div
              id="mobile-nav-panel"
              className="absolute left-0 right-0 top-full z-[65] max-h-[min(72vh,calc(100dvh-8.5rem))] overflow-y-auto border-t border-line bg-surface shadow-3 lg:hidden"
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
                      className={`flex items-center justify-between rounded-md px-4 py-3.5 text-[15px] font-medium transition-colors ${
                        active
                          ? "bg-clinical-50 text-clinical-700"
                          : "text-ink-700 active:bg-paper"
                      }`}
                    >
                      <span>{link.label}</span>
                      {active && (
                        <span
                          className="h-1.5 w-1.5 rounded-full bg-clinical-600"
                          aria-hidden
                        />
                      )}
                    </Link>
                  );
                })}
              </nav>

              <div className="space-y-2.5 border-t border-line px-4 pb-5 pt-3">
                <Link
                  href="/book"
                  onClick={closeMobileMenu}
                  className="btn-primary w-full !py-3"
                >
                  Book a test
                </Link>
                <a
                  href="tel:+9779825849435"
                  className="btn-outline w-full !py-3"
                >
                  <PhoneIcon size={16} />
                  Call the lab
                </a>
              </div>
            </div>
          </>
        )}
      </nav>

      {/* BOTTOM NAV — phones & tablets only (hidden once desktop nav shows) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden">
        <div className="flex h-[4.25rem] items-end justify-around px-1">
          {[
            {
              href: "/",
              label: "Home",
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              ),
            },
            {
              href: "/services",
              label: "Services",
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              ),
            },
          ].map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-1 flex-col items-center justify-center gap-1 py-2 transition-colors ${
                  active ? "text-clinical-700" : "text-ink-400"
                }`}
              >
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-md transition-colors ${
                    active ? "bg-clinical-50" : ""
                  }`}
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {item.icon}
                  </svg>
                </span>
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}

          <Link
            href="/book"
            className="-mt-5 flex flex-1 flex-col items-center justify-center"
          >
            <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-clinical-600 text-white shadow-2 ring-4 ring-surface">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.25} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </span>
            <span className="mt-1.5 text-[10px] font-semibold text-clinical-700">
              Book
            </span>
          </Link>

          {[
            {
              href: "/tests",
              label: "Tests",
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              ),
            },
            {
              href: "/packages",
              label: "Packages",
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              ),
            },
          ].map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-1 flex-col items-center justify-center gap-1 py-2 transition-colors ${
                  active ? "text-clinical-700" : "text-ink-400"
                }`}
              >
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-md transition-colors ${
                    active ? "bg-clinical-50" : ""
                  }`}
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {item.icon}
                  </svg>
                </span>
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Floating WhatsApp — phone only */}
      <a
        href="https://wa.me/9779861848382"
        className="fixed bottom-[5.5rem] right-3 z-40 sm:hidden"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Message the lab on WhatsApp"
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#128C7E] text-white shadow-2 ring-4 ring-surface">
          <WhatsAppIcon size={21} className="text-white" />
        </span>
      </a>
    </div>
  );
}
