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
          <main className="pt-[72px] lg:pt-[110px] px-6 py-16 text-slate-500 text-sm">
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
      <main className="pt-[72px] lg:pt-[110px]">
        <PagePosterHero
          src="/images/posters/tests-hero.png"
          alt="Cutis Path Lab Tests"
          width={6667}
          height={654}
        />

        <div className="min-h-screen bg-slate-50 pb-20 lg:pb-0">
          <div className="container mx-auto px-2 sm:px-6 py-4 sm:py-8">
            {diseaseSlug && (
              <div className="mb-4 sm:mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-sky-100 bg-white px-4 py-3 shadow-sm">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-700">
                    Disease category
                  </p>
                  <p className="text-sm sm:text-base font-semibold text-slate-900 mt-0.5">
                    Showing tests for {diseaseLabel || diseaseSlug}
                  </p>
                </div>
                <Link
                  href="/tests"
                  className="text-xs sm:text-sm font-semibold text-[#FF6B6B] hover:text-sky-700 transition-colors"
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
                          ? "bg-[#FF6B6B] text-white"
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
                  <div className="bg-[#FF6B6B] px-4 py-3">
                    <h3 className="text-white font-semibold">All Filters</h3>
                  </div>
                  <div className="p-3 border-b border-slate-200">
                    <input
                      type="text"
                      placeholder="Search tests..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-3 py-2 rounded-md border border-slate-200 focus:outline-none focus:border-sky-500 text-sm text-black"
                    />
                  </div>
                  <div className="p-2">
                    {CATEGORIES.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setActiveCategory(category.id)}
                        className={`w-full text-left px-4 py-3 rounded-md font-medium transition-all duration-300 ${
                          activeCategory === category.id
                            ? "bg-sky-100 text-sky-700 border-l-4 border-sky-600"
                            : "text-slate-600 hover:bg-slate-50 hover:text-sky-600 border-l-4 border-transparent"
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
                      className="px-1 sm:px-3 py-1 rounded-md border border-slate-200 focus:outline-none focus:border-sky-500 bg-white text-xs sm:text-sm text-slate-700 cursor-pointer"
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
                    <Link href="/tests" className="underline font-semibold text-sky-700">
                      browse all tests
                    </Link>
                    .
                  </div>
                )}

                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-20 animate-pulse rounded-lg bg-slate-200"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6">
                    {paginatedTests.map((item) => {
                      const isSelected = selectedTests.find(
                        (t) => t.id === item.id,
                      );
                      return (
                        <div
                          key={item.id}
                          onClick={() => toggleTest(item)}
                          className={`flex items-center group cursor-pointer ${
                            isSelected ? "opacity-100" : ""
                          }`}
                        >
                          <div
                            className={`relative z-10 w-20 h-20 sm:w-[68px] sm:h-[68px] flex items-center justify-center rounded-full flex-shrink-0 shadow-md overflow-hidden ${
                              isSelected
                                ? "bg-sky-200 border border-sky-600"
                                : "bg-sky-100 border border-[#FF6B6B]"
                            }`}
                          >
                            <TestIconView
                              test={item}
                              size={36}
                              className="sm:w-10 sm:h-10"
                            />
                          </div>
                          <div
                            className={`px-3 sm:px-3 rounded-r-lg -ml-12 sm:-ml-12 shadow-md h-20 sm:h-14 w-full sm:w-52 flex items-center justify-between border-t-4 ${
                              isSelected
                                ? "bg-[#FF6B6B] border-sky-600"
                                : "bg-sky-600 border-[#FF6B6B]"
                            }`}
                          >
                            <p className="text-xs sm:text-xs text-white font-medium leading-tight ml-12 sm:ml-10">
                              {item.text}
                            </p>
                            <span className="text-xs sm:text-xs font-bold text-white mr-3 sm:mr-2">
                              ₹{item.price}
                            </span>
                          </div>
                        </div>
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
                        className="px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium border border-slate-200 text-slate-600 hover:border-sky-300 hover:text-sky-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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
                              ? "bg-sky-600 text-white"
                              : "border border-slate-200 text-slate-600 hover:border-sky-300 hover:text-sky-700"
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
                        className="px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium border border-slate-200 text-slate-600 hover:border-sky-300 hover:text-sky-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="hidden lg:block lg:w-72 flex-shrink-0">
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden sticky top-24">
                  <div className="bg-sky-600 px-4 py-3">
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
                        <span className="text-sm font-bold text-sky-600">
                          ₹{finalPrice}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleBookNow}
                        disabled={bookingBusy}
                        className="w-full bg-[#FF6B6B] text-white py-2.5 rounded-lg font-semibold hover:bg-red-600 transition-colors disabled:opacity-60 disabled:cursor-wait shadow-sm"
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
              <span className="text-xs font-bold text-sky-600">
                ₹{finalPrice}
              </span>
            </div>
            <button
              type="button"
              onClick={handleBookNow}
              disabled={bookingBusy}
              className="w-full bg-[#FF6B6B] text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-red-600 transition-colors disabled:opacity-60 disabled:cursor-wait"
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
                          ? "bg-sky-100 text-sky-700 border-l-4 border-sky-600"
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
