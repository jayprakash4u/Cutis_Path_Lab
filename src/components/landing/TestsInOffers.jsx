"use client";

import Link from "next/link";
import SectionHeader from "@/components/ui/SectionHeader";
import { offers } from "@/data/landingData";
import {
  useFullCardCarousel,
  CAROUSEL_BREAKPOINTS,
} from "@/lib/useFullCardCarousel";

function RailButton({ direction, onClick, disabled = false, className = "" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex h-9 w-9 items-center justify-center rounded-md border border-line bg-surface text-ink-500 transition
        hover:border-clinical-500 hover:text-clinical-700
        disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-line disabled:hover:text-ink-500 ${className}`}
      aria-label={direction === "left" ? "Previous offers" : "Next offers"}
    >
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d={direction === "left" ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
        />
      </svg>
    </button>
  );
}

export default function TestsInOffers() {
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
    gap: 16,
    breakpoints: CAROUSEL_BREAKPOINTS.lab,
    itemCount: offers.length,
    deps: [offers.length],
  });

  return (
    <section className="section-tight bg-surface">
      <div className="shell">
        <SectionHeader
          eyebrow="This month"
          title="Tests on offer"
          lede="Reduced pricing on the panels we run most often. Home collection is included at no extra cost."
          action={
            <div className="hidden items-center gap-2 sm:flex">
              <RailButton
                direction="left"
                onClick={() => scroll("left")}
                disabled={!canScrollLeft}
              />
              <RailButton
                direction="right"
                onClick={() => scroll("right")}
                disabled={!canScrollRight}
              />
            </div>
          }
        />

        <div ref={viewportRef} className="mt-8 w-full overflow-hidden">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className={scrollClassName}
            style={{ gap: `${gap}px`, scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {offers.map((offer) => {
              const saving = offer.originalPrice - offer.discountedPrice;
              const percent = Math.round((saving / offer.originalPrice) * 100);

              return (
                <article
                  key={offer.id}
                  style={cardWidthStyle}
                  className={`card card-hover flex flex-col ${cardClassName}`}
                >
                  <div className="flex items-start justify-between gap-2 border-b border-line px-4 py-3">
                    <div className="min-w-0">
                      <p className="label">{offer.code}</p>
                      <h3 className="mt-1 truncate text-sm font-semibold text-ink-900">
                        {offer.name}
                      </h3>
                    </div>
                    <span className="chip shrink-0 bg-flag-700 text-white">
                      −{percent}%
                    </span>
                  </div>

                  <dl className="flex-1 divide-y divide-line px-4 text-[12px]">
                    {[
                      ["Parameters", offer.parameters],
                      ["Report", offer.reportsTime],
                      ["Fasting", offer.fasting],
                      ["Sample", offer.sampleType],
                    ].map(([k, v]) => (
                      <div key={k} className="flex items-baseline justify-between gap-3 py-2">
                        <dt className="label">{k}</dt>
                        <dd className="mono text-right text-[11px] text-ink-700">{v}</dd>
                      </div>
                    ))}
                  </dl>

                  <div className="flex items-end justify-between gap-3 border-t border-line px-4 py-3">
                    <div>
                      <p className="mono text-lg font-semibold leading-none text-clinical-700">
                        Rs {offer.discountedPrice.toLocaleString("en-IN")}
                      </p>
                      <p className="mono mt-1 text-[11px] text-ink-400 line-through">
                        Rs {offer.originalPrice.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <Link
                      href={`/book-offer/${encodeURIComponent(offer.id)}`}
                      className="btn-primary !px-3.5 !py-1.5 !text-[13px]"
                    >
                      Book
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-3 sm:hidden">
          <RailButton
            direction="left"
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
          />
          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalDots }).map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => scrollToDot(index)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === activeIndex ? "w-6 bg-clinical-600" : "w-1.5 bg-line-strong"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
          <RailButton
            direction="right"
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
          />
        </div>
      </div>
    </section>
  );
}
