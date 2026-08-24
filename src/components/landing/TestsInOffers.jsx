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

export default function TestsInOffers({ section }) {
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
        title={section?.title || "Flat 25–33% off on lab tests"}
        subtitle={section?.subtitle || "Free home sample collection on every booking."}
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
                    <div className="bg-brand-600 px-3 py-2">
                      <h3 className="truncate text-center text-xs font-semibold text-white sm:text-sm">
                        {test.name}
                      </h3>
                    </div>

                    <div className="flex flex-1 flex-col p-3">
                      <div className="mb-2 flex items-center justify-between gap-1.5">
                        <span className="truncate rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-medium text-accent-500">
                          {test.category}
                        </span>
                        <span className="shrink-0 rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-bold text-brand-600">
                          {test.discount}% OFF
                        </span>
                      </div>

                      {/* Labels stay on at every width — without them a phone
                          showed three bare values with no idea what they meant. */}
                      <div className="mb-2 space-y-1 text-xs text-slate-500">
                        <div>Reports: {test.reportsTime}</div>
                        <div>Fasting: {test.fasting}</div>
                        <div>Sample: {test.sampleType}</div>
                      </div>

                      <div className="mt-auto border-t border-brand-300 pt-2">
                        {/* Stacked on mobile so the button gets a full-width
                            tap target instead of a ~40x22px one. */}
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-base font-bold text-brand-600">
                              ₹{test.discountedPrice}
                            </span>
                            <span className="text-xs text-slate-400 line-through">
                              ₹{test.originalPrice}
                            </span>
                          </div>
                          <Link
                            href={bookHref(test)}
                            className="block w-full rounded-md bg-brand-600 px-3 py-2 text-center text-xs font-semibold text-white transition-all hover:bg-brand-700 sm:w-auto"
                          >
                            Book
                          </Link>
                        </div>
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
