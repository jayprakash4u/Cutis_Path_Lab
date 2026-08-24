"use client";

import { Suspense, useState, useMemo, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PagePosterHero from "@/components/sections/PagePosterHero";
import { TestIconView } from "@/lib/testIcons";

const CATEGORIES = [
  { id: "all", name: "All Tests" },
  { id: "Hematology", name: "Hematology" },
  { id: "Biochemistry", name: "Biochemistry" },
  { id: "Hormone", name: "Hormone" },
  { id: "Immunology", name: "Immunology" },
  { id: "Microbiology", name: "Microbiology" },
  { id: "Pathology", name: "Pathology" },
];

const SORT_OPTIONS = [
  { value: "name", label: "Sort: A-Z" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
];

const PAGE_SIZE = 30;

export default function TestsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white">
          <Navbar />
          <main className="pt-below-nav-tall px-6 py-16 text-slate-500 text-sm">
            Loading tests…
          </main>
        </div>
      }
    >
      <TestsPageContent />
    </Suspense>
  );
}

function TestsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const diseaseSlug = (searchParams.get("category") || "").trim().toLowerCase();

  const [tests, setTests] = useState([]);
  const [diseaseLabel, setDiseaseLabel] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [selectedTests, setSelectedTests] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [bookingBusy, setBookingBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadTests() {
      try {
        setLoading(true);
        setError("");
        setActiveCategory("all");
        setSelectedTests([]);

        const url = diseaseSlug
          ? `/api/tests?disease=${encodeURIComponent(diseaseSlug)}`
          : "/api/tests";
        const res = await fetch(url);
        const json = await res.json();
        if (!res.ok || !json.success) {
          throw new Error(json.message || "Failed to load tests");
        }
        if (!cancelled) {
          setTests(Array.isArray(json.data) ? json.data : []);
        }

        if (diseaseSlug && !cancelled) {
          try {
            const catRes = await fetch("/api/categories");
            const catJson = await catRes.json();
            const match = (catJson.data || []).find(
              (c) => String(c.slug || "").toLowerCase() === diseaseSlug,
            );
            setDiseaseLabel(match?.label || diseaseSlug);
          } catch {
            setDiseaseLabel(diseaseSlug);
          }
        } else if (!cancelled) {
          setDiseaseLabel("");
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Could not load tests from database");
          setTests([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadTests();
    return () => {
      cancelled = true;
    };
  }, [diseaseSlug]);

  const testsWithIcons = useMemo(() => {
    return tests.map((test) => ({
      ...test,
      text: test.name,
      price: Number(test.price) || 0,
    }));
  }, [tests]);

  const toggleTest = (test) => {
    setSelectedTests((prev) => {
      const exists = prev.find((t) => t.id === test.id);
      if (exists) {
        return prev.filter((t) => t.id !== test.id);
      }
      return [...prev, test];
    });
  };

  const handleBookNow = useCallback(() => {
    if (selectedTests.length === 0 || bookingBusy) return;

    const ids = selectedTests
      .map((t) => t.id)
      .filter((id) => id != null && id !== "")
      .map((id) => String(id));

    if (ids.length === 0) return;

    setBookingBusy(true);
    // Keep commas unencoded so /book can split them reliably
    router.push(`/book?testIds=${ids.join(",")}`);
    // Safety: unlock if navigation is slow/cancelled
    window.setTimeout(() => setBookingBusy(false), 2500);
  }, [selectedTests, bookingBusy, router]);

  const totalPrice = selectedTests.reduce((sum, test) => sum + test.price, 0);
  const discount = Math.round(totalPrice * 0.1);
  const finalPrice = totalPrice - discount;

  const filteredTests = useMemo(() => {
    let result = [...testsWithIcons];

    if (activeCategory && activeCategory !== "all") {
      result = result.filter(
        (test) =>
          test.category &&
          test.category.toLowerCase() === activeCategory.toLowerCase(),
      );
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (test) =>
          test.name?.toLowerCase().includes(q) ||
          test.description?.toLowerCase().includes(q),
      );
    }

    result.sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      return 0;
    });

    return result;
  }, [activeCategory, searchQuery, sortBy, testsWithIcons]);

  // Reset to first page whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, searchQuery, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredTests.length / PAGE_SIZE));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedTests = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredTests.slice(start, start + PAGE_SIZE);
  }, [filteredTests, currentPage]);

  const pageNumbers = useMemo(() => {
    const pages = [];
    const windowSize = 5;
    let start = Math.max(1, currentPage - Math.floor(windowSize / 2));
    let end = Math.min(totalPages, start + windowSize - 1);
    start = Math.max(1, end - windowSize + 1);
    for (let i = start; i <= end; i += 1) pages.push(i);
    return pages;
  }, [currentPage, totalPages]);

  const rangeStart =
    filteredTests.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(currentPage * PAGE_SIZE, filteredTests.length);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-below-nav-tall">
        <PagePosterHero
          src="/images/posters/tests-hero.png"
          alt="Cutis Path Lab Tests"
          width={6667}
          height={654}
          mobileSrc="/images/banners/mobile/tests-hero.png"
          mobileWidth={1844}
          mobileHeight={853}
        />

        <div className="min-h-screen bg-slate-50 pb-20 lg:pb-0">
          <div className="container mx-auto px-2 sm:px-6 py-4 sm:py-8">
            {diseaseSlug && (
              <div className="mb-4 sm:mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-brand-100 bg-white px-4 py-3 shadow-sm">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-700">
                    Disease category
                  </p>
                  <p className="text-sm sm:text-base font-semibold text-slate-900 mt-0.5">
                    Showing tests for {diseaseLabel || diseaseSlug}
                  </p>
                </div>
                <Link
                  href="/tests"
                  className="text-xs sm:text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors"
                >
                  Clear · View all tests
                </Link>
              </div>
            )}

            <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
              <div className="lg:hidden overflow-x-auto -mx-2 px-2 py-2 mb-2 bg-slate-50 border-b border-slate-200">
                <div className="flex gap-2 w-max">
                  {CATEGORIES.map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => setActiveCategory(category.id)}
                      className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                        activeCategory === category.id
                          ? "bg-brand-600 text-white"
                          : "bg-white text-slate-600 border border-slate-200"
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="hidden lg:block lg:w-64 flex-shrink-0">
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden sticky top-24">
                  <div className="bg-brand-600 px-4 py-3">
                    <h3 className="text-white font-semibold">All Filters</h3>
                  </div>
                  <div className="p-3 border-b border-slate-200">
                    <input
                      type="text"
                      placeholder="Search tests..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-3 py-2 rounded-md border border-slate-200 focus:outline-none focus:border-brand-500 text-sm text-black"
                    />
                  </div>
                  <div className="p-2">
                    {CATEGORIES.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setActiveCategory(category.id)}
                        className={`w-full text-left px-4 py-3 rounded-md font-medium transition-all duration-300 ${
                          activeCategory === category.id
                            ? "bg-brand-100 text-brand-700 border-l-4 border-brand-600"
                            : "text-slate-600 hover:bg-slate-50 hover:text-brand-600 border-l-4 border-transparent"
                        }`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex-1">
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 px-2 sm:px-4 py-2 sm:py-3 flex items-center justify-between mb-4 sm:mb-6">
                  <span className="text-xs sm:text-sm font-medium text-slate-700">
                    {loading
                      ? "Loading tests..."
                      : filteredTests.length === 0
                        ? "0 tests"
                        : `Showing ${rangeStart}-${rangeEnd} of ${filteredTests.length} tests`}
                  </span>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <span className="hidden sm:inline text-xs sm:text-sm text-slate-500">
                      Sort:
                    </span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-1 sm:px-3 py-1 rounded-md border border-slate-200 focus:outline-none focus:border-brand-500 bg-white text-xs sm:text-sm text-slate-700 cursor-pointer"
                    >
                      {SORT_OPTIONS.map((option) => (
                        <option
                          key={option.value}
                          value={option.value}
                          className="text-slate-700"
                        >
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {error && (
                  <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                {!loading && !error && diseaseSlug && tests.length === 0 && (
                  <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-900">
                    No tests are linked to{" "}
                    <span className="font-semibold">{diseaseLabel || diseaseSlug}</span> yet.
                    Ask the lab admin to assign tests under Admin → Categories, or{" "}
                    <Link href="/tests" className="underline font-semibold text-brand-700">
                      browse all tests
                    </Link>
                    .
                  </div>
                )}

                {loading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                    {/* Mirrors the real card so the grid doesn't jump on load */}
                    {Array.from({ length: 9 }).map((_, i) => (
                      <div
                        key={i}
                        className="flex items-stretch gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-card"
                      >
                        <div className="h-11 w-11 shrink-0 animate-pulse rounded-lg bg-slate-100" />
                        <div className="flex min-w-0 flex-1 flex-col gap-2">
                          <div className="h-4 w-3/4 animate-pulse rounded bg-slate-100" />
                          <div className="mt-auto h-2.5 w-1/2 animate-pulse rounded bg-slate-100" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                    {paginatedTests.map((item) => {
                      const isSelected = selectedTests.find(
                        (t) => t.id === item.id,
                      );
                      return (
                        /*
                          A real <button>, not a clickable <div> — this toggles
                          selection, so it needs to be reachable by keyboard and
                          to report its state. `aria-pressed` carries that.
                        */
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => toggleTest(item)}
                          aria-pressed={Boolean(isSelected)}
                          title={item.text}
                          className={`group flex w-full items-stretch gap-3 rounded-xl border bg-white p-3 text-left transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 ${
                            isSelected
                              ? "border-brand-500 shadow-card-hover ring-1 ring-brand-500"
                              : "border-slate-200 shadow-card hover:border-brand-300 hover:shadow-card-hover"
                          }`}
                        >
                          <span
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg transition-colors ${
                              isSelected ? "bg-brand-100" : "bg-brand-50 group-hover:bg-brand-100"
                            }`}
                          >
                            <TestIconView test={item} size={22} />
                          </span>

                          <span className="flex min-w-0 flex-1 flex-col">
                            <span className="flex items-start gap-2">
                              {/*
                                `min-w-0` lets the name shrink — flex children
                                default to min-width:auto and would otherwise
                                push the price out of the card. Clamped to two
                                lines so a name like "Immunohistochemistry",
                                which has no space to wrap at, can never
                                overflow; the full text is in `title`.
                              */}
                              <span className="min-w-0 flex-1 text-sm font-bold leading-snug text-slate-900 line-clamp-2">
                                {item.text}
                              </span>
                              <span className="shrink-0 whitespace-nowrap text-sm font-bold text-slate-900">
                                <span className="text-[11px] font-semibold text-slate-400">Rs</span>{" "}
                                {item.price}
                              </span>
                            </span>

                            {/* Pushed to the bottom so cards line up on a row */}
                            <span className="mt-auto flex items-end justify-between gap-2 pt-2">
                              <span className="min-w-0 truncate text-[10px] font-semibold uppercase tracking-[0.12em] text-brand-400">
                                {item.category}
                              </span>
                              <span
                                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
                                  isSelected
                                    ? "border-brand-600 bg-brand-600"
                                    : "border-slate-300 bg-white group-hover:border-brand-400"
                                }`}
                                aria-hidden="true"
                              >
                                {isSelected ? (
                                  <svg
                                    className="h-2.5 w-2.5 text-white"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={3.5}
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                ) : null}
                              </span>
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {!loading && !error && filteredTests.length === 0 && (
                  <p className="text-center text-sm text-slate-500 py-10">
                    No tests found for this filter.
                  </p>
                )}

                {!loading && filteredTests.length > PAGE_SIZE && (
                  <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3 py-3 sm:px-4">
                    <p className="text-xs sm:text-sm text-slate-500">
                      Page {currentPage} of {totalPages}
                    </p>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <button
                        type="button"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium border border-slate-200 text-slate-600 hover:border-brand-300 hover:text-brand-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      >
                        Prev
                      </button>

                      {pageNumbers.map((page) => (
                        <button
                          key={page}
                          type="button"
                          onClick={() => setCurrentPage(page)}
                          className={`min-w-8 h-8 sm:min-w-9 sm:h-9 rounded-md text-xs sm:text-sm font-semibold transition-colors ${
                            page === currentPage
                              ? "bg-brand-600 text-white"
                              : "border border-slate-200 text-slate-600 hover:border-brand-300 hover:text-brand-700"
                          }`}
                        >
                          {page}
                        </button>
                      ))}

                      <button
                        type="button"
                        onClick={() =>
                          setCurrentPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={currentPage === totalPages}
                        className="px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium border border-slate-200 text-slate-600 hover:border-brand-300 hover:text-brand-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="hidden lg:block lg:w-72 flex-shrink-0">
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden sticky top-24">
                  <div className="bg-brand-600 px-4 py-3">
                    <h3 className="text-white font-semibold">
                      Selected Tests ({selectedTests.length})
                    </h3>
                  </div>
                  <div className="p-4 max-h-96 overflow-y-auto">
                    {selectedTests.length === 0 ? (
                      <p className="text-sm text-slate-500 text-center py-4">
                        No tests selected
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {selectedTests.map((test) => (
                          <div
                            key={test.id}
                            className="flex justify-between items-center border-b border-slate-100 pb-2"
                          >
                            <div className="flex-1">
                              <p className="text-xs text-slate-700 font-medium">
                                {test.text}
                              </p>
                              <p className="text-xs text-slate-500">
                                ₹{test.price}
                              </p>
                            </div>
                            <button
                              onClick={() => toggleTest(test)}
                              className="text-red-500 text-xs hover:text-red-700"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {selectedTests.length > 0 && (
                    <div className="border-t border-slate-200 p-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-slate-600">
                          Total Price:
                        </span>
                        <span className="text-sm font-medium">
                          ₹{totalPrice}
                        </span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-slate-600">
                          Discount (10%):
                        </span>
                        <span className="text-sm text-green-600">
                          -₹{discount}
                        </span>
                      </div>
                      <div className="flex justify-between mb-4">
                        <span className="text-sm font-semibold">
                          Final Price:
                        </span>
                        <span className="text-sm font-bold text-brand-600">
                          ₹{finalPrice}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleBookNow}
                        disabled={bookingBusy}
                        className="w-full bg-brand-600 text-white py-2.5 rounded-lg font-semibold hover:bg-brand-700 transition-colors disabled:opacity-60 disabled:cursor-wait shadow-sm"
                      >
                        {bookingBusy ? "Opening booking…" : "Book Now"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {selectedTests.length > 0 && (
          <div className="lg:hidden fixed bottom-[4.75rem] left-0 right-0 bg-white border-t border-slate-200 shadow-lg z-[60] px-3 py-2.5 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-slate-600">
                {selectedTests.length} test{selectedTests.length > 1 ? "s" : ""} selected
              </span>
              <span className="text-xs font-bold text-brand-600">
                ₹{finalPrice}
              </span>
            </div>
            <button
              type="button"
              onClick={handleBookNow}
              disabled={bookingBusy}
              className="w-full bg-brand-600 text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-brand-700 transition-colors disabled:opacity-60 disabled:cursor-wait"
            >
              {bookingBusy ? "Opening booking…" : "Book Now"}
            </button>
          </div>
        )}

        {showFilters && (
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-50"
            onClick={() => setShowFilters(false)}
          >
            <div
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-xl max-h-[70%] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
                <h3 className="font-semibold text-sm">Filters</h3>
                <button onClick={() => setShowFilters(false)} className="p-1">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="p-3">
                <input
                  type="text"
                  placeholder="Search tests..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-slate-200 text-xs mb-3"
                />
                <div className="space-y-1">
                  {CATEGORIES.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => {
                        setActiveCategory(category.id);
                        setShowFilters(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-md text-xs font-medium transition-all ${
                        activeCategory === category.id
                          ? "bg-brand-100 text-brand-700 border-l-4 border-brand-600"
                          : "text-slate-600 hover:bg-slate-50 border-l-4 border-transparent"
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
