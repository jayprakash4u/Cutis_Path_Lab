"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useFullCardCarousel, CAROUSEL_BREAKPOINTS } from "@/lib/useFullCardCarousel";
import {
  Section,
  SectionHeading,
  CarouselButton,
  CarouselDots,
} from "@/components/ui/Section";

export default function PopularTestsPackages({ section }) {
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
          category: t.category,
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
            category: p.category,
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
    <Section tone="tint">
      <SectionHeading
        title={section?.title || "Most booked tests and packages"}
        subtitle={section?.subtitle || "Frequently chosen tests and health packages, with transparent pricing."}
        actions={
          <div className="hidden items-center gap-3 sm:flex">
            <CarouselButton
              direction="left"
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              label="Scroll left"
            />
            <CarouselButton
              direction="right"
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              label="Scroll right"
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
                <p className="px-4 py-8 text-sm text-slate-500">Loading popular items…</p>
              )}
              {!loading && items.length === 0 && (
                <p className="px-4 py-8 text-sm text-slate-500">
                  No popular tests or packages available.{" "}
                  <Link href="/tests" className="text-brand-600 underline">
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
                      className={`flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card transition-shadow duration-300 hover:shadow-card-hover ${cardClassName}`}
                    >
                      <div className="flex items-center justify-between gap-2 bg-brand-600 px-3 py-2">
                        <h3 className="w-full truncate text-xs font-semibold text-white sm:text-sm">
                          {item.name}
                        </h3>
                        <span className="shrink-0 rounded bg-white/20 px-1.5 py-0.5 text-[11px] font-medium text-white">
                          {item.kind === "package" ? "Package" : "Test"}
                        </span>
                      </div>

                      <div className="flex flex-1 flex-col p-3 md:p-5">
                        {/* Category tag — same treatment as the one on Tests in
                            Offers and package cards, so it reads the same way
                            sitewide. */}
                        {item.category && (
                          <span className="mb-2 inline-block w-fit truncate rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-medium text-accent-500">
                            {item.category}
                          </span>
                        )}

                        {/* Labels shown at every width — on mobile these read as
                            three unlabelled values otherwise. */}
                        <div className="mb-3 flex flex-col gap-1.5 text-xs text-slate-500">
                          <span className="flex items-center gap-1.5">
                            <svg className="h-4 w-4 shrink-0 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            Reports: {item.reportsTime}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <svg className="h-4 w-4 shrink-0 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Fasting: {item.fasting}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <svg className="h-4 w-4 shrink-0 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                            </svg>
                            Sample: {item.sampleType}
                          </span>
                        </div>

                        <div className="mt-auto border-t border-brand-600 pt-3">
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <div className="flex items-baseline gap-1.5">
                                <span className="text-base font-bold text-slate-900 md:text-xl">
                                  ₹{item.price}
                                </span>
                                {item.originalPrice && (
                                  <span className="text-xs text-slate-500 line-through">
                                    ₹{item.originalPrice}
                                  </span>
                                )}
                              </div>
                              {discount > 0 && (
                                <span className="text-xs font-semibold text-green-600">
                                  {discount}% OFF
                                </span>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => handleBook(item)}
                              className="w-full rounded-lg bg-brand-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-brand-700 sm:w-auto md:px-4 md:text-sm"
                            >
                              Book
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

        </div>

        {!loading && items.length > 0 && (
          <div className="mt-8 flex items-center justify-center gap-3">
            <div className="sm:hidden">
              <CarouselButton
                direction="left"
                onClick={() => scroll("left")}
                disabled={!canScrollLeft}
                label="Scroll left"
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
                label="Scroll right"
              />
            </div>
          </div>
        )}
      </div>
    </Section>
  );
}
