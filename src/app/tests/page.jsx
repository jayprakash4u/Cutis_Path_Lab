"use client";

import { Suspense, useState, useMemo, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PagePosterHero from "@/components/sections/PagePosterHero";
import SectionHeader from "@/components/ui/SectionHeader";
import { TestIconView } from "@/lib/testIcons";
import { tests as allTests } from "@/data/staticData";
import { diseaseCategories } from "@/data/landingData";
import { categoryTone, categoryChipClass } from "@/lib/categoryTone";

const TONE_TILE_BG = {
  clinical: "bg-clinical-50",
  assay: "bg-assay-100",
  bloom: "bg-bloom-100",
  flag: "bg-flag-100",
};

const CATEGORIES = [
  { id: "all", name: "All tests" },
  { id: "Hematology", name: "Haematology" },
  { id: "Biochemistry", name: "Biochemistry" },
  { id: "Hormone", name: "Hormone" },
  { id: "Immunology", name: "Immunology" },
  { id: "Microbiology", name: "Microbiology" },
  { id: "Pathology", name: "Pathology" },
];

const SORT_OPTIONS = [
  { value: "name", label: "A–Z" },
  { value: "price-low", label: "Price: low to high" },
  { value: "price-high", label: "Price: high to low" },
];

const FASTING_OPTIONS = [
  { value: "all", label: "Fasting: any" },
  { value: "required", label: "Fasting required" },
  { value: "not-required", label: "No fasting" },
];

const PAGE_SIZE = 30;

export default function TestsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-paper">
          <Navbar />
          <main className="pt-below-nav-tall shell py-16 text-sm text-ink-500">
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

  const [diseaseLabel, setDiseaseLabel] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [fastingFilter, setFastingFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [selectedTests, setSelectedTests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [bookingBusy, setBookingBusy] = useState(false);

  // Local catalogue — narrowed to a disease area when ?category= is present.
  const tests = useMemo(() => {
    if (!diseaseSlug) return allTests;
    const area = diseaseCategories.find((c) => c.slug === diseaseSlug);
    if (!area) return allTests;
    const matched = allTests.filter((t) => {
      const haystack = `${t.name} ${t.description ?? ""}`.toLowerCase();
      return area.match.some((kw) => haystack.includes(kw));
    });
    return matched.length > 0 ? matched : allTests;
  }, [diseaseSlug]);

  useEffect(() => {
    const area = diseaseCategories.find((c) => c.slug === diseaseSlug);
    setDiseaseLabel(diseaseSlug ? area?.label || diseaseSlug : "");
    setActiveCategory("all");
    setSelectedTests([]);
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
      if (exists) return prev.filter((t) => t.id !== test.id);
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

    if (fastingFilter === "required") {
      result = result.filter((test) => test.fastingRequired);
    } else if (fastingFilter === "not-required") {
      result = result.filter((test) => !test.fastingRequired);
    }

    result.sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      return 0;
    });

    return result;
  }, [activeCategory, searchQuery, fastingFilter, sortBy, testsWithIcons]);

  // Reset to first page whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, searchQuery, fastingFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredTests.length / PAGE_SIZE));

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const paginatedTests = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredTests.slice(start, start + PAGE_SIZE);
  }, [filteredTests, currentPage]);

  const pageNumbers = useMemo(() => {
    const pages = [];
    const windowSize = 5;
    let start = Math.max(1, currentPage - Math.floor(windowSize / 2));
    const end = Math.min(totalPages, start + windowSize - 1);
    start = Math.max(1, end - windowSize + 1);
    for (let i = start; i <= end; i += 1) pages.push(i);
    return pages;
  }, [currentPage, totalPages]);

  const rangeStart =
    filteredTests.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(currentPage * PAGE_SIZE, filteredTests.length);

  return (
    <div className="min-h-screen bg-paper">
      <Navbar />
      <main className="pt-below-nav-tall pb-28 lg:pb-0">
        <PagePosterHero
          src="/images/posters/tests-hero.png"
          alt="Cutis Path Lab Tests"
          width={6667}
          height={654}
        />

        <div className="shell py-10 lg:py-14">
          <SectionHeader
            eyebrow={
              diseaseSlug
                ? `Condition · ${diseaseLabel || diseaseSlug}`
                : "Catalogue"
            }
            title={
              diseaseSlug
                ? `Tests for ${diseaseLabel || diseaseSlug}`
                : "Every test we run"
            }
            lede="Select as many as you need. The total updates as you go, and a 10% bundle discount applies to multi-test requests."
            action={
              diseaseSlug ? (
                <Link
                  href="/tests"
                  className="hidden shrink-0 text-[13px] font-medium text-clinical-700 hover:text-clinical-600 sm:inline-flex"
                >
                  Clear filter
                </Link>
              ) : null
            }
          />

          {/* Filter bar — search + category chips, top of page, every breakpoint */}
          <div className="card mt-7 overflow-hidden">
            <div className="flex flex-col gap-3 border-b border-line p-3 sm:flex-row sm:items-center sm:gap-4 sm:p-4">
              <div className="relative w-full sm:max-w-xs">
                <svg
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search tests…"
                  aria-label="Search tests"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-md border border-line bg-paper py-2 pl-9 pr-3 text-sm text-ink-800 placeholder:text-ink-400 focus:border-clinical-500 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-clinical-100"
                />
              </div>
              <div className="scrollbar-hide -mx-3 flex gap-2 overflow-x-auto px-3 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
                {CATEGORIES.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setActiveCategory(category.id)}
                    className={`shrink-0 whitespace-nowrap rounded-md px-3 py-2 text-[13px] font-medium transition ${
                      activeCategory === category.id
                        ? "bg-clinical-600 text-white"
                        : "border border-line bg-surface text-ink-600 hover:border-clinical-200 hover:text-clinical-700"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>

              <select
                value={fastingFilter}
                onChange={(e) => setFastingFilter(e.target.value)}
                aria-label="Filter by fasting requirement"
                className="cursor-pointer rounded-md border border-line bg-paper px-3 py-2 text-[13px] text-ink-700 focus:border-clinical-500 focus:outline-none sm:shrink-0"
              >
                {FASTING_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:gap-8">
            {/* Results */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-3 rounded-md border border-line bg-surface px-4 py-2.5">
                <p className="mono text-[11px] text-ink-500">
                  {filteredTests.length === 0
                    ? "0 tests"
                    : `${rangeStart}–${rangeEnd} of ${filteredTests.length}`}
                </p>
                <div className="flex items-center gap-2">
                  <label htmlFor="sort" className="label hidden sm:block">
                    Sort
                  </label>
                  <select
                    id="sort"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="cursor-pointer rounded-md border border-line bg-paper px-2 py-1.5 text-[13px] text-ink-700 focus:border-clinical-500 focus:outline-none"
                  >
                    {SORT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {filteredTests.length === 0 ? (
                <div className="mt-4 rounded-lg border border-dashed border-line-strong bg-surface px-6 py-14 text-center">
                  <p className="text-sm font-medium text-ink-700">
                    No tests match this filter
                  </p>
                  <p className="mt-1 text-[13px] text-ink-500">
                    Clear the search box or pick a different category.
                  </p>
                </div>
              ) : (
                <div className="mt-4 overflow-hidden rounded-lg border border-line bg-surface">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-line bg-surface-sunk">
                          <th className="w-11 px-3 py-2.5" scope="col">
                            <span className="sr-only">Select</span>
                          </th>
                          <th className="label px-3 py-2.5" scope="col">Test</th>
                          <th className="label px-3 py-2.5 text-right" scope="col">Price</th>
                          <th className="label hidden px-3 py-2.5 sm:table-cell" scope="col">Category</th>
                          <th className="label hidden px-3 py-2.5 md:table-cell" scope="col">Sample</th>
                          <th className="label hidden px-3 py-2.5 lg:table-cell" scope="col">Fasting</th>
                          <th className="label hidden px-3 py-2.5 lg:table-cell" scope="col">Report</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-line">
                        {paginatedTests.map((item) => {
                          const isSelected = Boolean(
                            selectedTests.find((t) => t.id === item.id),
                          );
                          const tone = categoryTone(item.category);
                          return (
                            <tr
                              key={item.id}
                              onClick={() => toggleTest(item)}
                              aria-selected={isSelected}
                              className={`cursor-pointer transition-colors ${
                                isSelected ? "bg-clinical-50" : "hover:bg-paper"
                              }`}
                            >
                              <td className="px-3 py-2.5">
                                <span
                                  className={`flex h-4 w-4 items-center justify-center rounded-xs border transition ${
                                    isSelected
                                      ? "border-clinical-600 bg-clinical-600 text-white"
                                      : "border-line-strong text-transparent"
                                  }`}
                                  aria-hidden="true"
                                >
                                  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                </span>
                              </td>
                              <td className="px-3 py-2.5">
                                <div className="flex items-center gap-2.5">
                                  <span
                                    className={`flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-md ${TONE_TILE_BG[tone]}`}
                                  >
                                    <TestIconView test={item} size={18} />
                                  </span>
                                  <span className="truncate text-[13px] font-semibold text-ink-900">
                                    {item.text}
                                  </span>
                                </div>
                              </td>
                              <td className="mono whitespace-nowrap px-3 py-2.5 text-right text-[13px] font-semibold text-ink-900">
                                Rs {item.price.toLocaleString("en-IN")}
                              </td>
                              <td className="hidden px-3 py-2.5 sm:table-cell">
                                <span className={categoryChipClass(item.category)}>
                                  {item.category}
                                </span>
                              </td>
                              <td className="hidden whitespace-nowrap px-3 py-2.5 text-[13px] text-ink-600 md:table-cell">
                                {item.sampleType}
                              </td>
                              <td className="hidden whitespace-nowrap px-3 py-2.5 text-[13px] text-ink-600 lg:table-cell">
                                {item.fastingRequired ? "Required" : "Not required"}
                              </td>
                              <td className="mono hidden whitespace-nowrap px-3 py-2.5 text-[12px] text-ink-600 lg:table-cell">
                                {item.reportTime}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {filteredTests.length > 0 && (
                <nav
                  className="mt-6 flex flex-col items-center justify-between gap-3 rounded-md border border-line bg-surface px-4 py-3 sm:flex-row"
                  aria-label="Pagination"
                >
                  <p className="mono text-[11px] text-ink-500">
                    Page {currentPage} of {totalPages}
                  </p>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="rounded-md border border-line px-3 py-1.5 text-[13px] font-medium text-ink-600 transition hover:border-clinical-500 hover:text-clinical-700 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Prev
                    </button>

                    {pageNumbers.map((page) => (
                      <button
                        key={page}
                        type="button"
                        onClick={() => setCurrentPage(page)}
                        aria-current={page === currentPage ? "page" : undefined}
                        className={`mono h-8 min-w-8 rounded-md text-[13px] font-medium transition ${
                          page === currentPage
                            ? "bg-clinical-600 text-white"
                            : "border border-line text-ink-600 hover:border-clinical-500 hover:text-clinical-700"
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
                      className="rounded-md border border-line px-3 py-1.5 text-[13px] font-medium text-ink-600 transition hover:border-clinical-500 hover:text-clinical-700 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                </nav>
              )}
            </div>

            {/* Basket */}
            <aside className="hidden w-72 shrink-0 lg:block">
              <div className="card sticky top-28 overflow-hidden">
                <div className="flex items-center justify-between border-b border-line px-4 py-3">
                  <h2 className="label">Selected</h2>
                  <span className="mono text-[11px] text-ink-500">
                    {selectedTests.length}
                  </span>
                </div>

                {selectedTests.length === 0 ? (
                  <p className="px-4 py-8 text-center text-[13px] text-ink-400">
                    Pick a test to start building a request.
                  </p>
                ) : (
                  <>
                    <ul className="max-h-80 divide-y divide-line overflow-y-auto">
                      {selectedTests.map((test) => (
                        <li
                          key={test.id}
                          className="flex items-start justify-between gap-2 px-4 py-2.5"
                        >
                          <div className="min-w-0">
                            <p className="truncate text-[13px] font-medium text-ink-800">
                              {test.text}
                            </p>
                            <p className="mono mt-0.5 text-[11px] text-ink-400">
                              Rs {test.price.toLocaleString("en-IN")}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => toggleTest(test)}
                            className="shrink-0 text-[11px] font-medium text-flag-700 hover:underline"
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>

                    <div className="border-t border-line bg-paper p-4">
                      <dl className="space-y-1.5">
                        <div className="flex justify-between">
                          <dt className="text-[13px] text-ink-500">Subtotal</dt>
                          <dd className="mono text-[13px] text-ink-700">
                            Rs {totalPrice.toLocaleString("en-IN")}
                          </dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-[13px] text-ink-500">
                            Bundle discount
                          </dt>
                          <dd className="mono text-[13px] text-assay-700">
                            −Rs {discount.toLocaleString("en-IN")}
                          </dd>
                        </div>
                        <div className="flex justify-between border-t border-line pt-1.5">
                          <dt className="text-[13px] font-semibold text-ink-900">
                            Total
                          </dt>
                          <dd className="mono text-[15px] font-semibold text-ink-900">
                            Rs {finalPrice.toLocaleString("en-IN")}
                          </dd>
                        </div>
                      </dl>

                      <button
                        type="button"
                        onClick={handleBookNow}
                        disabled={bookingBusy}
                        className="btn-primary mt-4 w-full !py-2.5"
                      >
                        {bookingBusy ? "Opening booking…" : "Book selected"}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </aside>
          </div>
        </div>

        {/* Sticky basket bar — phones and tablets */}
        {selectedTests.length > 0 && (
          <div className="fixed bottom-[4.25rem] left-0 right-0 z-[60] border-t border-line bg-surface px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-3 lg:hidden">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[13px] text-ink-600">
                {selectedTests.length} test
                {selectedTests.length > 1 ? "s" : ""} selected
              </span>
              <span className="mono text-[13px] font-semibold text-ink-900">
                Rs {finalPrice.toLocaleString("en-IN")}
              </span>
            </div>
            <button
              type="button"
              onClick={handleBookNow}
              disabled={bookingBusy}
              className="btn-primary w-full !py-2.5"
            >
              {bookingBusy ? "Opening booking…" : "Book selected"}
            </button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
