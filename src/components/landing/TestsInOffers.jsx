"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useFullCardCarousel, CAROUSEL_BREAKPOINTS } from "@/lib/useFullCardCarousel";

export default function TestsInOffers() {
  const [offerTests, setOfferTests] = useState([]);
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
    itemCount: offerTests.length,
    deps: [offerTests.length, loading],
  });

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        const res = await fetch("/api/offers");
        const json = await res.json();
        if (!cancelled && json.success && Array.isArray(json.data)) {
          setOfferTests(json.data);
        }
      } catch {
        if (!cancelled) setOfferTests([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const bookHref = (test) => `/book-offer/${encodeURIComponent(test.id)}`;

  return (
    <section className="section-y-compact relative overflow-x-hidden bg-gradient-to-b from-sky-50/70 via-white to-white">
      <div
        className="pointer-events-none absolute -left-16 -top-10 h-56 w-56 rounded-full bg-sky-100/60 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-16 bottom-0 h-56 w-56 rounded-full bg-[#FF6B6B]/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="section-shell relative">
        <div className="section-head-compact">
          <span className="mb-3 inline-block rounded-tr-2xl rounded-bl-2xl bg-sky-600 px-4 py-2">
            <span className="t-badge font-bold text-white">Special Offers</span>
          </span>
          <h2 className="t-h2 font-bold text-slate-900">
            Flat 25-33% <span className="text-[#FF6B6B]">OFF</span> On Lab Tests
          </h2>
          <p className="mt-1.5 flex items-center gap-1.5 t-caption font-medium text-slate-500">
            <svg className="h-3.5 w-3.5 shrink-0 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75l2.25 2.25L15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Free home sample collection
          </p>
        </div>

        <div className="relative sm:px-10 md:px-12">
          <button
            type="button"
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={`absolute left-0 top-1/2 z-20 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border shadow-md transition-all duration-300 sm:flex md:h-10 md:w-10 ${
              canScrollLeft
                ? "border-slate-200 bg-white text-slate-500 hover:border-sky-300 hover:text-sky-600 hover:shadow-lg"
                : "cursor-not-allowed border-slate-100 bg-white text-slate-300 opacity-50"
            }`}
            aria-label="Scroll left"
          >
            <svg className="h-4 w-4 md:h-5 md:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
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
                <p className="w-full px-4 py-8 text-center text-sm text-slate-500">Loading offers…</p>
              )}
              {!loading && offerTests.length === 0 && (
                <p className="w-full px-4 py-8 text-center text-sm text-slate-500">
                  No offers available right now.
                </p>
              )}
              {!loading &&
                offerTests.map((test) => (
                  <div
                    key={test.id}
                    data-offer-card
                    style={cardWidthStyle}
                    className={`group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-lg ${cardClassName}`}
                  >
                    <span className="absolute right-2 top-2 z-10 rounded-full bg-white px-2 py-0.5 t-caption font-extrabold text-[#FF6B6B] shadow-md ring-1 ring-black/5 sm:right-2.5 sm:top-2.5">
                      {test.discount}% OFF
                    </span>

                    <div className="bg-[#FF6B6B] px-3 py-2 pr-16 sm:px-3.5 sm:py-2.5 sm:pr-20">
                      <span className="mb-1 inline-block rounded-full bg-white/20 px-1.5 py-0.5 t-caption font-medium text-white">
                        {test.category}
                      </span>
                      <h3 className="truncate t-caption font-bold text-white sm:text-sm">
                        {test.name}
                      </h3>
                    </div>

                    <div className="flex flex-1 flex-col p-2.5 sm:p-3">
                      <div className="mb-2 space-y-1">
                        <div className="flex items-center gap-1 t-caption text-slate-500">
                          <svg className="h-3 w-3 shrink-0 text-sky-600 sm:h-3.5 sm:w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          <span className="hidden sm:inline">Reports: </span>
                          {test.reportsTime}
                        </div>
                        <div className="flex items-center gap-1 t-caption text-slate-500">
                          <svg className="h-3 w-3 shrink-0 text-sky-600 sm:h-3.5 sm:w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="hidden sm:inline">Fasting: </span>
                          {test.fasting}
                        </div>
                        <div className="flex items-center gap-1 t-caption text-slate-500">
                          <svg className="h-3 w-3 shrink-0 text-sky-600 sm:h-3.5 sm:w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                          </svg>
                          <span className="hidden sm:inline">Sample: </span>
                          {test.sampleType}
                        </div>
                      </div>

                      <div className="my-1.5 border-t border-dashed border-slate-300 sm:my-2" />

                      <div className="mt-auto flex items-center justify-between gap-2">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-sm font-bold text-sky-700 sm:text-base">
                            ₹{test.discountedPrice}
                          </span>
                          <span className="t-caption text-slate-400 line-through">
                            ₹{test.originalPrice}
                          </span>
                        </div>
                        <Link
                          href={bookHref(test)}
                          className="shrink-0 rounded-lg bg-sky-600 px-2.5 py-1.5 text-center t-caption font-semibold text-white transition-colors hover:bg-sky-700 sm:px-3"
                        >
                          Book
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={`absolute right-0 top-1/2 z-20 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border shadow-md transition-all duration-300 sm:flex md:h-10 md:w-10 ${
              canScrollRight
                ? "border-slate-200 bg-white text-slate-500 hover:border-sky-300 hover:text-sky-600 hover:shadow-lg"
                : "cursor-not-allowed border-slate-100 bg-white text-slate-300 opacity-50"
            }`}
            aria-label="Scroll right"
          >
            <svg className="h-4 w-4 md:h-5 md:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {!loading && offerTests.length > 0 && (
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
