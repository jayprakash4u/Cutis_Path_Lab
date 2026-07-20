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
    <section className="relative bg-white py-4 sm:py-6 lg:py-8">
      <div className="mx-auto max-w-full px-2 sm:px-4 md:px-6 lg:px-8">
        <div className="relative mb-3 sm:mb-4 md:mb-6">
          <div className="absolute top-0">
            <div className="rounded-tr-2xl rounded-bl-2xl bg-sky-600 px-4 py-2">
              <h2 className="text-lg font-bold text-white md:text-xl">Special Offers</h2>
            </div>
          </div>
          <div className="pt-12">
            <h2 className="text-lg font-bold text-slate-900 sm:text-xl md:text-2xl">
              Flat 25-33% OFF On Lab Tests
            </h2>
            <p className="mt-1 text-[10px] text-slate-500 sm:text-xs">Free home collection</p>
          </div>
        </div>

        <div className="relative sm:px-10 md:px-12">
          <button
            type="button"
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border-2 border-slate-300 bg-white text-slate-600 shadow-lg transition-all duration-300 hover:border-sky-500 hover:bg-sky-600 hover:text-white sm:flex md:h-10 md:w-10"
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
                <p className="px-4 py-6 text-sm text-slate-500">Loading offers…</p>
              )}
              {!loading && offerTests.length === 0 && (
                <p className="px-4 py-6 text-sm text-slate-500">No offers available right now.</p>
              )}
              {!loading &&
                offerTests.map((test) => (
                  <div
                    key={test.id}
                    data-offer-card
                    style={cardWidthStyle}
                    className={`flex cursor-pointer flex-col rounded-lg border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md ${cardClassName}`}
                  >
                    <div className="rounded-t-lg bg-[#FF6B6B] px-3 py-1.5 sm:py-1">
                      <h3 className="truncate text-center text-xs font-semibold text-white sm:text-sm">
                        {test.name}
                      </h3>
                    </div>

                    <div className="flex flex-1 flex-col p-1.5 sm:p-2">
                      <div className="mb-1 flex items-center justify-between">
                        <span className="rounded-full bg-red-50 px-1.5 py-0.5 text-[10px] font-medium text-[#FF6B6B] sm:px-2 sm:text-xs">
                          {test.category}
                        </span>
                        <span className="rounded-full bg-sky-50 px-1.5 py-0.5 text-[10px] font-bold text-sky-600 sm:px-2 sm:text-xs">
                          {test.discount}% OFF
                        </span>
                      </div>

                      <div className="mb-2 space-y-0.5">
                        <div className="text-[9px] text-slate-500 sm:text-xs">
                          <span className="hidden sm:inline">Reports: </span>
                          {test.reportsTime}
                        </div>
                        <div className="text-[9px] text-slate-500 sm:text-xs">
                          <span className="hidden sm:inline">Fasting: </span>
                          {test.fasting}
                        </div>
                        <div className="text-[9px] text-slate-500 sm:text-xs">
                          <span className="hidden sm:inline">Sample: </span>
                          {test.sampleType}
                        </div>
                      </div>

                      <div className="my-1 border-t border-sky-300 sm:my-2" />

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <span className="text-xs font-bold text-sky-600 sm:text-base">
                            ₹{test.discountedPrice}
                          </span>
                          <span className="text-[9px] text-slate-400 line-through sm:text-xs">
                            ₹{test.originalPrice}
                          </span>
                        </div>
                        <Link
                          href={bookHref(test)}
                          className="rounded-md bg-sky-600 px-2 py-1 text-center text-[10px] font-semibold text-white transition-all hover:bg-sky-700 sm:px-3 sm:text-xs"
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
            className="absolute right-0 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border-2 border-slate-300 bg-white text-slate-600 shadow-lg transition-all duration-300 hover:border-sky-500 hover:bg-sky-600 hover:text-white sm:flex md:h-10 md:w-10"
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
              className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-slate-300 bg-white text-slate-600 shadow sm:hidden"
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
              className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-slate-300 bg-white text-slate-600 shadow sm:hidden"
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
