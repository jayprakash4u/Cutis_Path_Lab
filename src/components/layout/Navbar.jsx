"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { BuildingIcon, LocationIcon, PhoneIcon, EmailIcon, FacebookIcon, InstagramIcon, TwitterIcon, WhatsAppIcon, SearchIcon } from "./NavIcons";
import { tests } from "@/data/staticData";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/tests", label: "Our Tests" },
  { href: "/packages", label: "Packages" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [navbarPosition, setNavbarPosition] = useState('top');
  const pathname = usePathname();
  const router = useRouter();

  // ── Search state ─────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchActiveIdx, setSearchActiveIdx] = useState(-1);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchRef = useRef(null);

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

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;
      const remainingToBottom = docHeight - scrollY - winHeight;

      if (remainingToBottom < 150) {
        setNavbarPosition("hidden");
      } else {
        setNavbarPosition("top");
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    navbarPosition === 'hidden' ? null : (
    <div className={`fixed left-0 right-0 z-50 transition-all duration-300 ${
      navbarPosition === 'bottom' ? 'bottom-0' : 'top-0'
    }`}>

{/* TOP BAR - Full for big screens, simplified for mobile */}
      <div className="bg-sky-600 text-white py-1.5 sm:py-1.5 border-b border-sky-700">
        <div className="w-full px-3 sm:px-6">
          <div className="flex items-center justify-between flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm font-medium">

            {/* Left Info - Full on lg, simplified on mobile */}
            <div className="flex items-center flex-wrap gap-2 sm:gap-4 lg:gap-6">
              <span className="font-semibold tracking-wide flex items-center gap-1.5">
                <BuildingIcon size={16} className="text-white" />
                <span className="hidden sm:inline">Cutis Lab Path</span>
                <span className="sm:hidden">Cutis Lab</span>
              </span>

              <span className="hidden lg:inline opacity-80">|</span>

              <span className="hidden lg:flex items-center gap-1.5">
                <LocationIcon size={16} className="text-white" />
                Kathmandu, Bagmati, Nepal
              </span>

              <span className="hidden lg:inline opacity-80">|</span>

              <span className="hidden lg:flex items-center gap-1.5">
                <PhoneIcon size={16} className="text-white" />
                Ph No - +977-9825849435
              </span>

              <span className="hidden lg:inline opacity-80">|</span>

              <span className="hidden lg:flex items-center gap-1.5">
                <EmailIcon size={16} className="text-white" />
                Email - cutislabpath@gmail.com
              </span>
            </div>

            {/* Phone for mobile only */}
            <div className="lg:hidden flex items-center gap-2">
              <a href="tel:+977-9825849435" className="flex items-center gap-1">
                <PhoneIcon size={14} className="text-white" />
                <span>+977-9825849435</span>
              </a>
            </div>

            {/* Social Icons - Shown on sm+ */}
            <div className="hidden sm:flex items-center gap-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-sky-300 transition">
                <FacebookIcon size={18} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-sky-300 transition">
                <InstagramIcon size={18} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-sky-300 transition">
                <TwitterIcon size={18} />
              </a>
              <a href="https://wa.me/9779825849435" target="_blank" rel="noopener noreferrer" className="hover:text-sky-300 transition">
                <WhatsAppIcon size={18} />
              </a>
            </div>
</div>
        </div>
      </div>

      {/* MAIN NAVBAR */}
      <nav className="bg-white border-b border-sky-300 shadow-lg relative">
        <div className="w-full px-6">
          <div className="flex items-center justify-between h-16 sm:h-20">

            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Image
                src="/images/cutis.png"
                alt="CUTIS Lab"
                width={120}
                height={45}
                className="w-24 sm:w-32 h-auto"
                priority
              />
            </Link>

            {/* Desktop Menu - Left Aligned */}
            <div className="hidden lg:flex items-center gap-1 ml-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2.5 text-base font-medium rounded-lg transition relative ${
                    pathname === link.href
                      ? "text-sky-600"
                      : "text-slate-800 hover:text-sky-600"
                  }`}
                >
                  {link.label}
                  {pathname === link.href && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-0.5 bg-[#FF6B6B] rounded-full"></span>
                  )}
                </Link>
              ))}
            </div>

             {/* Right Section - Search and Buttons */}
             <div className="hidden lg:flex items-center gap-4">
                {/* Search Box */}
                <div className="relative flex items-center" ref={searchRef}>
                  <input
                    type="text"
                    placeholder="Search tests & packages"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onFocus={() => searchQuery.trim() && setShowSearchDropdown(true)}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") {
                        setShowSearchDropdown(false);
                        setSearchActiveIdx(-1);
                      } else if (e.key === "ArrowDown") {
                        e.preventDefault();
                        setSearchActiveIdx((prev) =>
                          prev < searchResults.length - 1 ? prev + 1 : prev
                        );
                      } else if (e.key === "ArrowUp") {
                        e.preventDefault();
                        setSearchActiveIdx((prev) =>
                          prev > 0 ? prev - 1 : prev
                        );
                      } else if (e.key === "Enter") {
                        e.preventDefault();
                        if (searchResults[searchActiveIdx]) {
                          navigateToResult(searchResults[searchActiveIdx]);
                        } else if (searchResults.length > 0) {
                          navigateToResult(searchResults[0]);
                        }
                      }
                    }}
                    className="w-64 px-4 py-2 pr-12 text-black border border-sky-300 rounded-lg bg-white focus:border-sky-300 focus:outline-none"
                  />
                  <div className="absolute right-0 top-0 bottom-0 w-9 bg-[#FF6B6B] rounded-lg flex items-center justify-center pointer-events-none">
                    <SearchIcon size={16} className="text-white" />
                  </div>

                  {/* Search Results Dropdown */}
                  {showSearchDropdown && searchResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-sky-200 rounded-xl shadow-xl z-50 max-h-80 overflow-y-auto">
                      {searchResults.map((item, idx) => (
                        <button
                          key={item.id + item.type}
                          type="button"
                          onClick={() => navigateToResult(item)}
                          className={`w-full px-4 py-3 flex items-center gap-3 text-left transition-colors ${
                            idx === searchActiveIdx
                              ? "bg-sky-50"
                              : "hover:bg-slate-50"
                          }`}
                        >
                          <span
                            className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                              item.type === "test"
                                ? "bg-sky-100 text-sky-700"
                                : "bg-[#FF6B6B]/15 text-[#FF6B6B]"
                            }`}
                          >
                            {item.type === "test" ? "T" : "P"}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-slate-800 truncate">
                              {highlightedLabel(item.name, searchQuery)}
                            </p>
                            <p className="text-xs text-slate-400 truncate">
                              {item.type === "test" ? "Individual Test" : "Package"} · {item.description}
                            </p>
                          </div>
                          <span
                            className={`flex-shrink-0 text-[10px] font-bold uppercase tracking-wider ${
                              item.type === "test"
                                ? "text-sky-600"
                                : "text-[#FF6B6B]"
                            }`}
                          >
                            {item.type === "test" ? "Book" : "Book"}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* No-results hint */}
                  {showSearchDropdown &&
                    searchQuery.trim().length > 0 &&
                    searchResults.length === 0 && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-sky-200 rounded-xl shadow-xl z-50 px-4 py-6 text-center">
                        <p className="text-sm text-slate-500">
                          No results found for<span className="font-semibold text-slate-700">&nbsp;&quot;{searchQuery}&quot;</span>
                        </p>
                      </div>
                    )}
                </div>

              <Link
                href="/book"
                className="px-5 py-2 bg-sky-600 text-white rounded-lg text-base font-semibold hover:bg-sky-700 transition shadow-md hover:shadow-lg"
              >
                Book Test
              </Link>

              <Link
                href="/download-report"
                className="px-5 py-2 bg-transparent border-b-2 border-b-[#FF6B6B] rounded-lg text-base font-semibold text-[#FF6B6B] hover:bg-red-50 transition"
              >
                Report
              </Link>
            </div>

            {/* Mobile Right Section - Search + Menu */}
            <div className="lg:hidden flex items-center gap-2">
              {/* Search Box for Mobile */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-32 px-3 py-1.5 text-xs text-slate-800 border border-slate-200 rounded-lg focus:border-sky-500 focus:outline-none"
                />
              </div>
              {/* Menu Button */}
              <button
                className="lg:hidden p-2 bg-sky-600 text-white rounded-lg"
                onClick={() => setIsOpen(!isOpen)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden bg-white border-t">
            <div className="px-4 py-3 space-y-3">
              {/* Search Box in Mobile Menu */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search tests & packages..."
                  className="w-full px-4 py-2 text-sm text-slate-800 border border-slate-200 rounded-lg focus:border-sky-500 focus:outline-none"
                />
              </div>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block text-slate-700 text-sm py-1.5"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}

        </nav>

      {/* BOTTOM NAVIGATION - Fixed at bottom on small screens & tablet */}
      <nav className="xl:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] z-50">
        <div className="flex items-center justify-around h-16 px-1">
          {/* Home */}
          <Link
            href="/"
            className={`group flex flex-col items-center justify-center py-2 px-2 min-w-[60px] transition-all duration-200 ${
              pathname === "/" ? "text-sky-600" : "text-slate-400 hover:text-sky-500"
            }`}
          >
            <div className={`p-1.5 rounded-xl transition-all duration-200 ${
              pathname === "/" ? "bg-sky-50" : "group-hover:bg-sky-50"
            }`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <span className="text-[10px] mt-1 font-medium">Home</span>
          </Link>

          {/* Services */}
          <Link
            href="/services"
            className={`group flex flex-col items-center justify-center py-2 px-2 min-w-[60px] transition-all duration-200 ${
              pathname === "/services" ? "text-sky-600" : "text-slate-400 hover:text-sky-500"
            }`}
          >
            <div className={`p-1.5 rounded-xl transition-all duration-200 ${
              pathname === "/services" ? "bg-sky-50" : "group-hover:bg-sky-50"
            }`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <span className="text-[10px] mt-1 font-medium">Services</span>
          </Link>

          {/* Book Test - Center prominent floating button */}
          <Link
            href="/book"
            className="group flex flex-col items-center justify-center -mt-5"
          >
            <div className="relative">
              <div className="absolute -inset-2 bg-sky-100 rounded-full opacity-50 group-hover:opacity-70 transition-opacity"></div>
              <div className="relative w-14 h-14 rounded-full bg-gradient-to-b from-sky-500 to-sky-600 shadow-lg flex items-center justify-center transform group-hover:scale-105 transition-transform duration-200">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
            </div>
            <span className="text-[10px] mt-1.5 font-semibold text-sky-600">Book Now</span>
          </Link>

          {/* Tests */}
          <Link
            href="/tests"
            className={`group flex flex-col items-center justify-center py-2 px-2 min-w-[60px] transition-all duration-200 ${
              pathname === "/tests" ? "text-sky-600" : "text-slate-400 hover:text-sky-500"
            }`}
          >
            <div className={`p-1.5 rounded-xl transition-all duration-200 ${
              pathname === "/tests" ? "bg-sky-50" : "group-hover:bg-sky-50"
            }`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <span className="text-[10px] mt-1 font-medium">Tests</span>
          </Link>

          {/* Packages */}
          <Link
            href="/packages"
            className={`group flex flex-col items-center justify-center py-2 px-2 min-w-[60px] transition-all duration-200 ${
              pathname === "/packages" ? "text-sky-600" : "text-slate-400 hover:text-sky-500"
            }`}
          >
            <div className={`p-1.5 rounded-xl transition-all duration-200 ${
              pathname === "/packages" ? "bg-sky-50" : "group-hover:bg-sky-50"
            }`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <span className="text-[10px] mt-1 font-medium">Packages</span>
          </Link>
        </div>
      </nav>

      {/* Floating Support Button - Small screen only */}
      <a
        href="https://wa.me/9779861848382"
        className="lg:hidden fixed bottom-20 right-4 z-40"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="w-11 h-11 bg-[#FF6B6B] rounded-full flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity">
          <WhatsAppIcon size={24} className="text-white" />
        </div>
      </a>
    </div>
  )
);
}
