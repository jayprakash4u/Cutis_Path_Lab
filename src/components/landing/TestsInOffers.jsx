"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useFullCardCarousel, CAROUSEL_BREAKPOINTS } from "@/lib/useFullCardCarousel";
import {
  Section,
  SectionHeading,
  CarouselButton,
  CarouselDots,
} from "@/components/ui/Section";

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
    <Section tone="tint" size="compact">
      <SectionHeading
        title="Flat 25–33% off on lab tests"
        subtitle="Free home sample collection on every booking."
        actions={
          <div className="hidden items-center gap-3 sm:flex">
            <CarouselButton
              direction="left"
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              label="Previous offers"
            />
            <CarouselButton
              direction="right"
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              label="Next offers"
            />
          </div>
        }
      />

      <div>
        <div className="relative">
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
                    className={`flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card transition-all duration-300 hover:shadow-card-hover ${cardClassName}`}
                  >
                    <div className="bg-[#FF6B6B] px-3 py-1.5 sm:py-1">
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

        </div>

        {!loading && offerTests.length > 0 && (
          <div className="mt-8 flex items-center justify-center gap-3">
            <div className="sm:hidden">
              <CarouselButton
                direction="left"
                onClick={() => scroll("left")}
                disabled={!canScrollLeft}
                label="Previous offers"
              />
            </div>
            <CarouselDots
              total={totalDots}
              activeIndex={activeIndex}
              onSelect={scrollToDot}
            />
            <div className="sm:hidden">
              <CarouselButton
                direction="right"
                onClick={() => scroll("right")}
                disabled={!canScrollRight}
                label="Next offers"
              />
            </div>
          </div>
        )}
      </div>
    </Section>
  );
}
