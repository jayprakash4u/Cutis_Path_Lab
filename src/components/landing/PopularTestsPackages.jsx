"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useFullCardCarousel, CAROUSEL_BREAKPOINTS } from "@/lib/useFullCardCarousel";

export default function PopularTestsPackages() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const {
    scrollRef,
    viewportRef,
    activeIndex,
    cardWidthStyle,
    scrollClassName,
    cardClassName,
    totalDots,
    handleScroll,
    scroll,
    scrollToDot,
    canScrollLeft,
    canScrollRight,
    gap,
  } = useFullCardCarousel({
    gap: 12,
    breakpoints: CAROUSEL_BREAKPOINTS.compact,
    itemCount: items.length,
    deps: [items.length, loading],
  });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        const [testsRes, packagesRes] = await Promise.all([
          fetch("/api/tests?popular=true&limit=8"),
          fetch("/api/packages?limit=8"),
        ]);
        const [testsJson, packagesJson] = await Promise.all([
          testsRes.json(),
          packagesRes.json(),
        ]);

        const tests = (testsJson.success ? testsJson.data : []).map((t) => ({
          id: t.id,
          name: t.name,
          price: t.price,
          originalPrice: t.originalPrice,
          reportsTime: t.reportTime || "24-48 hrs",
          fasting: t.fastingRequired ? "Required" : "Not required",
          sampleType: t.sampleType || "Blood",
          kind: "test",
        }));

        const packages = (packagesJson.success ? packagesJson.data : []).map(
          (p) => ({
            id: p.id,
            name: p.name,
            price: p.price,
            originalPrice: p.originalPrice,
            reportsTime: p.reportsTime || "24-48 hrs",
            fasting: p.fasting || "10-12 hrs",
            sampleType: p.sampleType || "Blood",
            kind: "package",
          }),
        );

        const mixed = [];
        const max = Math.max(tests.length, packages.length);
        for (let i = 0; i < max; i += 1) {
          if (tests[i]) mixed.push(tests[i]);
          if (packages[i]) mixed.push(packages[i]);
        }

        if (!cancelled) setItems(mixed);
      } catch {
        if (!cancelled) setItems([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const getDiscount = (price, originalPrice) => {
    if (originalPrice && originalPrice > price) {
      return Math.round(((originalPrice - price) / originalPrice) * 100);
    }
    return 0;
  };

  const handleBook = (item) => {
    if (item.kind === "package") {
      router.push(`/book-package/${encodeURIComponent(item.id)}`);
      return;
    }
    router.push(`/book?testIds=${encodeURIComponent(item.id)}`);
  };

  return (
    <section className="section-y relative bg-gradient-to-br from-sky-50 to-white shadow-lg shadow-slate-200/50">
      <div className="section-shell">
        <div className="section-head">
          <div className="mb-3 inline-block rounded-tr-xl rounded-bl-xl bg-sky-600 px-3 py-1.5 sm:rounded-tr-2xl sm:rounded-bl-2xl sm:px-4 sm:py-2">
            <h2 className="t-badge font-bold text-white">
              Popular Tests &amp; Packages
            </h2>
          </div>
          <p className="max-w-2xl t-lead text-slate-600">
            The tests and health packages patients book most, with reporting
            time and fasting details up front.
          </p>
        </div>
        <div className="relative sm:px-10 md:px-12 lg:px-14">
          <button
            type="button"
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={`absolute left-0 top-1/2 z-20 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border shadow-md transition-all duration-300 sm:flex md:h-11 md:w-11 ${
              canScrollLeft
                ? "border-slate-200 bg-white text-slate-500 hover:border-sky-300 hover:text-sky-600 hover:shadow-lg"
                : "cursor-not-allowed border-slate-100 bg-white text-slate-300 opacity-50"
            }`}
            aria-label="Scroll left"
          >
            <svg className="h-4 w-4 md:h-5 md:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div ref={viewportRef} className="w-full overflow-hidden py-2">
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className={scrollClassName}
              style={{ gap: `${gap}px`, scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {loading && (
                <p className="px-4 py-8 text-sm text-slate-500">Loading popular items…</p>
              )}
              {!loading && items.length === 0 && (
                <p className="px-4 py-8 text-sm text-slate-500">
                  No popular tests or packages available.{" "}
                  <Link href="/tests" className="text-sky-600 underline">
                    Browse all tests
                  </Link>
                </p>
              )}
              {!loading &&
                items.map((item) => {
                  const discount = getDiscount(item.price, item.originalPrice);
                  return (
                    <div
                      key={`${item.kind}-${item.id}`}
                      data-popular-card
                      style={cardWidthStyle}
                      className={`flex flex-col overflow-hidden rounded-xl bg-white shadow-sm sm:rounded-2xl ${cardClassName}`}
                    >
                      <div className="flex min-h-[24px] items-center justify-between gap-2 bg-[#FF6B6B] px-2 py-1 sm:min-h-[28px] sm:px-3 md:min-h-[32px] md:px-4">
                        <h3 className="w-full truncate t-caption font-semibold text-white sm:text-xs md:text-sm">
                          {item.name}
                        </h3>
                        <span className="shrink-0 rounded bg-white/20 px-1.5 py-0.5 t-caption font-medium text-white sm:t-caption">
                          {item.kind === "package" ? "Package" : "Test"}
                        </span>
                      </div>

                      <div className="flex flex-1 flex-col p-2 sm:p-3 md:p-5">
                        <div className="mb-2 flex flex-col gap-1 sm:mb-3 sm:gap-2">
                          <span className="flex items-center gap-1 t-caption text-slate-500 sm:text-xs">
                            <svg className="h-3 w-3 text-sky-600 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <span className="hidden sm:inline">Reports: </span>
                            {item.reportsTime}
                          </span>
                          <span className="flex items-center gap-1 t-caption text-slate-500 sm:text-xs">
                            <svg className="h-3 w-3 text-sky-600 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="hidden sm:inline">Fasting: </span>
                            {item.fasting}
                          </span>
                          <span className="flex items-center gap-1 t-caption text-slate-500 sm:text-xs">
                            <svg className="h-3 w-3 text-sky-600 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                            </svg>
                            <span className="hidden sm:inline">Sample: </span>
                            {item.sampleType}
                          </span>
                        </div>

                        <div className="mt-auto flex items-center justify-between border-t border-sky-600 pt-2 sm:pt-3">
                          <div>
                            <div className="flex items-center gap-1 sm:gap-2">
                              <span className="text-sm font-bold text-slate-900 sm:text-base md:text-xl">
                                ₹{item.price}
                              </span>
                              {item.originalPrice && (
                                <span className="t-caption text-slate-500 line-through sm:text-xs">
                                  ₹{item.originalPrice}
                                </span>
                              )}
                            </div>
                            {discount > 0 && (
                              <span className="t-caption font-semibold text-green-600 sm:text-xs">
                                {discount}% OFF
                              </span>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => handleBook(item)}
                            className="rounded-lg bg-sky-600 px-2 py-1 t-caption font-medium text-white transition-colors hover:bg-sky-700 sm:px-3 sm:py-2 sm:text-xs md:px-4 md:text-sm"
                          >
                            Book
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          <button
            type="button"
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={`absolute right-0 top-1/2 z-20 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border shadow-md transition-all duration-300 sm:flex md:h-11 md:w-11 ${
              canScrollRight
                ? "border-slate-200 bg-white text-slate-500 hover:border-sky-300 hover:text-sky-600 hover:shadow-lg"
                : "cursor-not-allowed border-slate-100 bg-white text-slate-300 opacity-50"
            }`}
            aria-label="Scroll right"
          >
            <svg className="h-4 w-4 md:h-5 md:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {!loading && items.length > 0 && (
          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className={`flex h-9 w-9 items-center justify-center rounded-full border shadow sm:hidden ${
                canScrollLeft
                  ? "border-slate-200 bg-white text-slate-500"
                  : "cursor-not-allowed border-slate-100 text-slate-300 opacity-50"
              }`}
              aria-label="Scroll left"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex items-center gap-2">
              {Array.from({ length: totalDots }).map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => scrollToDot(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === activeIndex ? "w-6 bg-sky-600" : "w-2 bg-slate-300"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className={`flex h-9 w-9 items-center justify-center rounded-full border shadow sm:hidden ${
                canScrollRight
                  ? "border-slate-200 bg-white text-slate-500"
                  : "cursor-not-allowed border-slate-100 text-slate-300 opacity-50"
              }`}
              aria-label="Scroll right"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
