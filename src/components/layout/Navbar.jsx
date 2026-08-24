"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { BuildingIcon, LocationIcon, PhoneIcon, EmailIcon, FacebookIcon, InstagramIcon, TwitterIcon, WhatsAppIcon, SearchIcon, MobileNavIcon } from "./NavIcons";
import ReportModal from "./ReportModal";
import { tests } from "@/data/staticData";
import { mailHref, telHref, useSiteHeader } from "@/lib/useSiteChrome";

/* An entry with `children` renders as a dropdown on desktop and an expanding
   group in the mobile drawer. `href` on the group is what the label itself
   points at, and what marks the group active. */
const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/tests", label: "Our Tests" },
  { href: "/packages", label: "Packages" },
  {
    href: "/about",
    label: "About",
    children: [
      { href: "/about", label: "About Us" },
      { href: "/contact", label: "Contact Us" },
      { href: "/blog", label: "Blog" },
      { href: "/gallery", label: "Gallery" },
    ],
  },
];

/** True when the current path is the group itself or any of its children. */
function isGroupActive(link, pathname) {
  if (pathname === link.href) return true;
  return (link.children || []).some(
    (child) => pathname === child.href || pathname.startsWith(`${child.href}/`),
  );
}

function ChevronDown({ className = "" }) {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  // Label of the open desktop dropdown, and of the expanded drawer group.
  const [openMenu, setOpenMenu] = useState(null);
  const [openMobileGroup, setOpenMobileGroup] = useState(null);
  const menuRef = useRef(null);
  // The report popover is positioned against this button on desktop.
  const reportBtnRef = useRef(null);
  const pathname = usePathname();
  const router = useRouter();
  const site = useSiteHeader();

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
        <span className="text-accent-500 font-semibold">{text.slice(idx, idx + query.length)}</span>
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
      // Pointer users can open the dropdown by click as well as hover, so it
      // needs the same outside-click dismissal as the search results.
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(null);
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
      setOpenMenu(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Focus the field once the sheet has opened.
  useEffect(() => {
    if (mobileSearchOpen) mobileSearchInputRef.current?.focus();
  }, [mobileSearchOpen]);

  const closeMobileMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setIsOpen((open) => {
      const next = !open;
      // Only one of the two panels should be down at a time.
      if (next) setMobileSearchOpen(false);
      return next;
    });
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsOpen(false);
    setMobileSearchOpen(false);
    setShowSearchDropdown(false);
    setOpenMenu(null);
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
          className={`absolute left-0 right-0 mt-2 bg-white border border-brand-100 rounded-2xl shadow-xl z-50 overflow-hidden ${
            compact ? "max-h-64" : "max-h-80"
          } overflow-y-auto`}
        >
          {searchResults.map((item, idx) => (
            <button
              key={item.id + item.type}
              type="button"
              onClick={() => navigateToResult(item)}
              className={`w-full px-4 py-3 flex items-center gap-3 text-left transition-colors ${
                idx === searchActiveIdx ? "bg-brand-50" : "hover:bg-slate-50"
              }`}
            >
              <span
                className={`flex-shrink-0 w-7 h-7 rounded-xl flex items-center justify-center text-[10px] font-bold ${
                  item.type === "test"
                    ? "bg-brand-100 text-brand-700"
                    : "bg-accent-500/15 text-accent-500"
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
          <div className="absolute left-0 right-0 mt-2 bg-white border border-brand-100 rounded-2xl shadow-xl z-50 px-4 py-6 text-center">
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

      {/*
        Utility strip. Shown at every width now, but the four desktop items plus
        four social icons will not fit a phone — so below `lg` it condenses to
        the two things a visitor actually taps: call and WhatsApp.
      */}
      <div
        className="bg-brand-600 text-white py-1.5 border-b border-brand-700"
        /* Header settings can switch the whole strip off without clearing it. */
        hidden={site.isActive === false}
      >
        <div className="mx-auto w-full max-w-shell px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-3 text-xs font-medium lg:gap-4 lg:text-sm">
            <div className="flex min-w-0 items-center gap-3 lg:flex-wrap lg:gap-6">
              {site.brandName && (
                <>
                  <span className="hidden font-semibold tracking-wide lg:flex lg:items-center lg:gap-1.5">
                    <BuildingIcon size={16} className="text-white" />
                    {site.brandName}
                  </span>
                  <span className="hidden opacity-80 lg:inline">|</span>
                </>
              )}
              {site.region && (
                <>
                  <span className="hidden lg:flex lg:items-center lg:gap-1.5">
                    <LocationIcon size={16} className="text-white" />
                    {site.region}
                  </span>
                  <span className="hidden opacity-80 lg:inline">|</span>
                </>
              )}
              {site.phone && (
                <a
                  href={telHref(site.phone)}
                  className="flex shrink-0 items-center gap-1.5 hover:text-brand-100"
                >
                  <PhoneIcon size={15} className="text-white" />
                  {site.phone}
                </a>
              )}
              {site.email && (
                <>
                  <span className="hidden opacity-80 lg:inline">|</span>
                  <a
                    href={mailHref(site.email)}
                    className="hidden truncate hover:text-brand-100 lg:flex lg:items-center lg:gap-1.5"
                  >
                    <EmailIcon size={16} className="text-white" />
                    {site.email}
                  </a>
                </>
              )}
            </div>
            {/* A social link with no URL saved simply drops out of the strip. */}
            <div className="flex shrink-0 items-center gap-3">
              {site.facebookUrl && (
                <a href={site.facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="transition hover:text-brand-300">
                  <FacebookIcon size={18} />
                </a>
              )}
              {site.instagramUrl && (
                <a href={site.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="transition hover:text-brand-300">
                  <InstagramIcon size={18} />
                </a>
              )}
              {site.xUrl && (
                <a href={site.xUrl} target="_blank" rel="noopener noreferrer" aria-label="X" className="transition hover:text-brand-300">
                  <TwitterIcon size={18} />
                </a>
              )}
              {site.whatsappUrl && (
                <a href={site.whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="transition hover:text-brand-300">
                  <WhatsAppIcon size={17} />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MAIN NAVBAR */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-brand-100 shadow-[0_4px_24px_rgba(55,80,164,0.06)] relative z-[60]">
        {/* Same shell as every page section, so the logo lines up with the
            content below it instead of sitting against the viewport edge. */}
        <div className="relative z-[70] mx-auto w-full max-w-shell px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">

            {/*
              Hamburger sits left of the logo on mobile, because the drawer
              slides in from the left — a right-hand trigger opening a panel on
              the opposite edge reads as disconnected. Hidden on desktop, where
              the full nav is inline.
            */}
            {/* Logo */}
            {/*
              The new logo is a circular seal (966x964 after trimming), not the
              4:1 wordmark it replaces — dropped into the old slot it rendered
              108x113px and pushed the header open. So it becomes a lockup: the
              seal at nav height, with the name set in type beside it. At 40px
              the seal's ring text ("Pvt. Ltd.", "Mid Baneshwor, KTM") is far
              too small to read, so the type carries the name instead.
            */}
            <Link
              href="/"
              className="flex shrink-0 items-center gap-2 sm:gap-2.5"
              onClick={closeMobileMenu}
            >
              {/*
                A white plate with a hair of padding and a brand ring. The seal
                is blue right to its own edge, so on a white navbar it had
                nothing to sit against — the gap plus ring gives it a defined
                rim and it reads as a struck coin rather than a floating blob.
              */}
              <span className="flex shrink-0 items-center justify-center rounded-full bg-white p-[3px] shadow-sm ring-1 ring-brand-200">
                <Image
                  src="/images/logo/cutis-seal-192.png"
                  alt=""
                  width={192}
                  height={192}
                  /* Next re-encodes at quality 75 by default, which softens the
                     seal's fine ring lettering at this size. 90 is allow-listed
                     in next.config.mjs. */
                  quality={90}
                  className="h-11 w-11 rounded-full sm:h-12 sm:w-12 lg:h-14 lg:w-14"
                  priority
                />
              </span>
              <span className="flex min-w-0 flex-col leading-none">
                <span className="text-[15px] font-bold tracking-tight text-brand-700 sm:text-lg lg:text-xl">
                  CUTIS PATH LAB
                </span>
                {/* Too much for a phone header alongside the icons */}
                <span className="mt-1 hidden text-[10px] font-medium uppercase tracking-[0.16em] text-slate-500 sm:block lg:text-[11px]">
                  Mid Baneshwor, Kathmandu
                </span>
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-1 ml-8" ref={menuRef}>
              {navLinks.map((link) => {
                if (!link.children) {
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`px-4 py-2.5 text-base font-medium rounded-lg transition relative ${
                        pathname === link.href
                          ? "text-brand-600"
                          : "text-slate-800 hover:text-brand-600"
                      }`}
                    >
                      {link.label}
                      {pathname === link.href && (
                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-0.5 bg-accent-500 rounded-full"></span>
                      )}
                    </Link>
                  );
                }

                const open = openMenu === link.label;
                const active = isGroupActive(link, pathname);

                return (
                  <div
                    key={link.label}
                    className="relative"
                    onMouseEnter={() => setOpenMenu(link.label)}
                    onMouseLeave={() => setOpenMenu(null)}
                  >
                    <button
                      type="button"
                      aria-haspopup="true"
                      aria-expanded={open}
                      onFocus={() => setOpenMenu(link.label)}
                      /* Hover already opens the panel, so a click on an open
                         menu would just close what the pointer revealed. It
                         goes to the group's own page instead; on touch, where
                         there is no hover, the first tap opens it. */
                      onClick={() => {
                        if (open) router.push(link.href);
                        else setOpenMenu(link.label);
                      }}
                      className={`flex items-center gap-1.5 px-4 py-2.5 text-base font-medium rounded-lg transition relative ${
                        active ? "text-brand-600" : "text-slate-800 hover:text-brand-600"
                      }`}
                    >
                      {link.label}
                      <ChevronDown
                        className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                      />
                      {active && (
                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-0.5 bg-accent-500 rounded-full"></span>
                      )}
                    </button>

                    {open && (
                      /* The wrapper's top padding bridges the gap between the
                         button and the panel, so the hover doesn't drop. */
                      <div className="absolute left-0 top-full z-50 pt-2">
                        <div className="min-w-[13.5rem] rounded-xl border border-slate-100 bg-white p-1.5 shadow-[0_12px_30px_rgba(15,23,42,0.12)]">
                          {link.children.map((child) => {
                            const childActive = pathname === child.href;
                            return (
                              <Link
                                key={child.href}
                                href={child.href}
                                onClick={() => setOpenMenu(null)}
                                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[0.95rem] font-medium transition-colors ${
                                  childActive
                                    ? "bg-brand-50 text-brand-700"
                                    : "text-slate-700 hover:bg-slate-50 hover:text-brand-600"
                                }`}
                              >
                                <MobileNavIcon
                                  href={child.href}
                                  size={18}
                                  className={childActive ? "shrink-0 text-brand-600" : "shrink-0 text-slate-400"}
                                />
                                {child.label}
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
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
                    className="w-64 px-4 py-2 pr-12 text-slate-900 border border-brand-300 rounded-lg bg-white focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
                  />
                  <div className="absolute right-0 top-0 bottom-0 w-9 bg-accent-500 rounded-lg flex items-center justify-center pointer-events-none">
                    <SearchIcon size={16} className="text-white" />
                  </div>
                  {renderSearchResults()}
                </div>

              <button
                ref={reportBtnRef}
                type="button"
                onClick={() => setReportOpen((v) => !v)}
                aria-haspopup="dialog"
                aria-expanded={reportOpen}
                className="px-5 py-2 bg-transparent border-b-2 border-b-accent-500 rounded-lg text-base font-semibold text-accent-500 hover:bg-red-50 transition"
              >
                Report
              </button>
            </div>

            {/*
              Hidden while the drawer is open. These sit above the overlay so
              they stay tappable normally, but the drawer carries its own close
              button — leaving these on screen showed two ✕ at once.
            */}
            <div
              className={`lg:hidden relative z-[80] flex items-center gap-2 transition-opacity duration-200 ${
                isOpen ? "pointer-events-none opacity-0" : "opacity-100"
              }`}
            >
              <button
                type="button"
                data-mobile-search-toggle
                onClick={() => {
                  setMobileSearchOpen((v) => !v);
                  setIsOpen(false);
                }}
                className={`flex h-10 w-10 items-center justify-center rounded-lg border transition-colors ${
                  mobileSearchOpen
                    ? "border-brand-400 bg-brand-50 text-brand-700"
                    : "border-slate-200 bg-white text-slate-600"
                }`}
                aria-label="Search tests"
                aria-expanded={mobileSearchOpen}
              >
                <SearchIcon size={18} />
              </button>
              {/* Always the hamburger — closing is the drawer's job now */}
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600 text-white transition-colors hover:bg-brand-700"
                onClick={toggleMobileMenu}
                aria-label="Open menu"
                aria-expanded={isOpen}
                aria-controls="mobile-nav-panel"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.25} d="M4 7h16M4 12h16M4 17h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Search sheet — expands under the header when the icon is tapped */}
        <div
          ref={mobileSearchRef}
          className={`lg:hidden overflow-hidden border-t border-brand-50 transition-[max-height,opacity] duration-300 ease-out ${
            mobileSearchOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-slate-50 px-4 py-3">
            <div className="relative">
              <input
                ref={mobileSearchInputRef}
                type="search"
                placeholder="Search tests & packages"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => searchQuery.trim() && setShowSearchDropdown(true)}
                onKeyDown={searchKeyDown}
                className="w-full rounded-xl border border-brand-200 bg-white py-3 pl-4 pr-11 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              />
              <div className="pointer-events-none absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg bg-brand-600">
                <SearchIcon size={14} className="text-white" />
              </div>
              {renderSearchResults(true)}
            </div>
          </div>
        </div>
        </nav>

        {/*
          Side drawer, not a full-width dropdown: it covers ~82% of the screen
          (capped at 320px) so the dimmed page stays visible alongside it, which
          is what makes it read as an overlay rather than a new page.

          Kept mounted and moved with translate-x so it can slide. `invisible`
          is transitioned too, so it only applies once the slide-out finishes —
          otherwise the panel would vanish before it had moved.
        */}
        <button
          type="button"
          className={`lg:hidden fixed inset-0 z-[55] bg-slate-900/50 transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
          aria-label="Close menu"
          tabIndex={isOpen ? 0 : -1}
          onClick={closeMobileMenu}
        />
        <div
          id="mobile-nav-panel"
          className={`lg:hidden fixed inset-y-0 left-0 z-[65] flex w-[82%] max-w-[320px] flex-col bg-white shadow-2xl transition-[transform,visibility] duration-300 ease-out ${
            isOpen ? "visible translate-x-0" : "invisible -translate-x-full"
          }`}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
        >
          <div className="flex shrink-0 items-center justify-between bg-brand-600 px-5 py-4">
            <span className="text-base font-bold text-white">Cutis Path Lab</span>
            <button
              type="button"
              onClick={closeMobileMenu}
              aria-label="Close menu"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/30"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
              {/* Icon + label rows split by hairlines, rather than floating pills */}
              <nav className="divide-y divide-slate-100">
                {navLinks.map((link) => {
                  if (link.children) {
                    const groupActive = isGroupActive(link, pathname);
                    // Open by default when you are already inside the group.
                    const expanded = openMobileGroup === null ? groupActive : openMobileGroup === link.label;

                    return (
                      <div key={link.label}>
                        <button
                          type="button"
                          aria-expanded={expanded}
                          onClick={() =>
                            setOpenMobileGroup(expanded ? "" : link.label)
                          }
                          className={`flex w-full items-center gap-4 px-5 py-4 text-left text-[15px] transition-colors ${
                            groupActive
                              ? "bg-brand-50/60 font-semibold text-brand-700"
                              : "font-medium text-slate-700 active:bg-slate-50"
                          }`}
                        >
                          <MobileNavIcon
                            href={link.href}
                            className={groupActive ? "shrink-0 text-brand-600" : "shrink-0 text-slate-400"}
                          />
                          <span className="flex-1">{link.label}</span>
                          <ChevronDown
                            className={`shrink-0 text-slate-400 transition-transform duration-200 ${
                              expanded ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        {expanded && (
                          <div className="bg-slate-50/70 pb-1">
                            {link.children.map((child) => {
                              const childActive = pathname === child.href;
                              return (
                                <Link
                                  key={child.href}
                                  href={child.href}
                                  onClick={closeMobileMenu}
                                  className={`flex items-center gap-3 py-3 pl-14 pr-5 text-[14.5px] transition-colors ${
                                    childActive
                                      ? "font-semibold text-brand-700"
                                      : "font-medium text-slate-600 active:bg-slate-100"
                                  }`}
                                >
                                  <MobileNavIcon
                                    href={child.href}
                                    size={18}
                                    className={childActive ? "shrink-0 text-brand-600" : "shrink-0 text-slate-400"}
                                  />
                                  <span className="flex-1">{child.label}</span>
                                  {childActive && (
                                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent-500" aria-hidden />
                                  )}
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  }

                  const active = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={closeMobileMenu}
                      className={`flex items-center gap-4 px-5 py-4 text-[15px] transition-colors ${
                        active
                          ? "bg-brand-50/60 font-semibold text-brand-700"
                          : "font-medium text-slate-700 active:bg-slate-50"
                      }`}
                    >
                      <MobileNavIcon
                        href={link.href}
                        className={active ? "shrink-0 text-brand-600" : "shrink-0 text-slate-400"}
                      />
                      <span className="flex-1">{link.label}</span>
                      {active && (
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent-500" aria-hidden />
                      )}
                    </Link>
                  );
                })}
            </nav>
          </div>

          <div className="shrink-0 border-t border-slate-100 px-4 py-4">
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => {
                  closeMobileMenu();
                  setReportOpen(true);
                }}
                className="flex items-center justify-center rounded-xl border border-accent-500/50 py-2.5 text-sm font-semibold text-accent-500"
              >
                Report
              </button>
              <a
                href={telHref(site.phone)}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-700"
              >
                <PhoneIcon size={16} />
                Call
              </a>
            </div>
          </div>
        </div>

      {/* BOTTOM NAV — phones & tablets only (hidden once desktop nav shows) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-slate-100 bg-white/95 backdrop-blur-md shadow-[0_-8px_30px_rgba(15,23,42,0.06)] pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-end justify-around h-[4.25rem] px-1">
          {[
            {
              href: "/",
              label: "Home",
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              ),
            },
            {
              href: "/services",
              label: "Services",
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              ),
            },
          ].map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-1 flex-col items-center justify-center gap-1 py-2 transition-colors ${
                  active ? "text-brand-600" : "text-slate-400"
                }`}
              >
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-2xl transition-colors ${
                    active ? "bg-brand-50" : ""
                  }`}
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {item.icon}
                  </svg>
                </span>
                <span className="text-[10px] font-semibold tracking-wide">{item.label}</span>
                <span
                  className={`h-0.5 w-4 rounded-full transition-colors ${
                    active ? "bg-accent-500" : "bg-transparent"
                  }`}
                />
              </Link>
            );
          })}

          <Link href="/book" className="flex flex-1 flex-col items-center justify-center -mt-5">
            <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-white shadow-[0_8px_20px_rgba(55,80,164,0.35)] ring-4 ring-white">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </span>
            <span className="mt-1.5 text-[10px] font-bold text-brand-700">Book</span>
          </Link>

          {[
            {
              href: "/tests",
              label: "Tests",
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              ),
            },
            {
              href: "/packages",
              label: "Packages",
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              ),
            },
          ].map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-1 flex-col items-center justify-center gap-1 py-2 transition-colors ${
                  active ? "text-brand-600" : "text-slate-400"
                }`}
              >
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-2xl transition-colors ${
                    active ? "bg-brand-50" : ""
                  }`}
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {item.icon}
                  </svg>
                </span>
                <span className="text-[10px] font-semibold tracking-wide">{item.label}</span>
                <span
                  className={`h-0.5 w-4 rounded-full transition-colors ${
                    active ? "bg-accent-500" : "bg-transparent"
                  }`}
                />
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Floating WhatsApp — phone only, and only with a link saved */}
      {site.whatsappUrl && (
        <a
          href={site.whatsappUrl}
          className="sm:hidden fixed bottom-[5.5rem] right-3 z-40"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp support"
        >
          <div className="w-12 h-12 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg ring-4 ring-white">
            <WhatsAppIcon size={22} className="text-white" />
          </div>
        </a>
      )}

      {/* Report lookup — portals itself to <body>, so it is safe from the
          backdrop-blur containing block on <nav>. */}
      {reportOpen && (
        <ReportModal anchorRef={reportBtnRef} onClose={() => setReportOpen(false)} />
      )}
    </div>
  );
}
