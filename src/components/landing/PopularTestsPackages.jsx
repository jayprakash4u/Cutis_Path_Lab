"use client";

import Link from "next/link";
import SectionHeader from "@/components/ui/SectionHeader";
import { popularItems } from "@/data/landingData";
import {
  useFullCardCarousel,
  CAROUSEL_BREAKPOINTS,
} from "@/lib/useFullCardCarousel";

function RailButton({ direction, onClick, disabled = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex h-9 w-9 items-center justify-center rounded-md border border-line bg-surface text-ink-500 transition
        hover:border-clinical-500 hover:text-clinical-700
        disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-line disabled:hover:text-ink-500"
      aria-label={direction === "left" ? "Previous items" : "Next items"}
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

export default function PopularTestsPackages() {
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
    itemCount: popularItems.length,
    deps: [popularItems.length],
  });

  return (
    <section className="section border-y border-line bg-surface">
      <div className="shell">
        <SectionHeader
          eyebrow="Most ordered"
          title="Tests and panels people book"
          lede="Individual assays and bundled panels, priced up front. Nothing is added at the counter."
          action={
            <div className="hidden items-center gap-2 sm:flex">
              <RailButton direction="left" onClick={() => scroll("left")} disabled={!canScrollLeft} />
              <RailButton direction="right" onClick={() => scroll("right")} disabled={!canScrollRight} />
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
            {popularItems.map((item) => {
              const saving = item.originalPrice - item.price;
              const percent = Math.round((saving / item.originalPrice) * 100);
              const href =
                item.kind === "package"
                  ? `/book-package/${encodeURIComponent(item.id)}`
                  : `/book?testIds=${encodeURIComponent(item.id)}`;

              return (
                <article
                  key={`${item.kind}-${item.id}`}
                  style={cardWidthStyle}
                  className={`card card-hover flex flex-col ${cardClassName}`}
                >
                  <div className="border-b border-line px-4 py-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="label">{item.code}</p>
                      <span
                        className={item.kind === "package" ? "chip-assay" : "chip-clinical"}
                      >
                        {item.kind}
                      </span>
                    </div>
                    <h3 className="mt-1.5 truncate text-sm font-semibold text-ink-900">
                      {item.name}
                    </h3>
                  </div>

                  <dl className="flex-1 divide-y divide-line px-4 text-[12px]">
                    {[
                      ["Parameters", item.parameters],
                      ["Report", item.reportsTime],
                      ["Fasting", item.fasting],
                      ["Sample", item.sampleType],
                    ].map(([k, v]) => (
                      <div key={k} className="flex items-baseline justify-between gap-3 py-2">
                        <dt className="label">{k}</dt>
                        <dd className="mono text-right text-[11px] text-ink-700">{v}</dd>
                      </div>
                    ))}
                  </dl>

                  <div className="flex items-end justify-between gap-3 border-t border-line px-4 py-3">
                    <div>
                      <p className="mono text-lg font-semibold leading-none text-ink-900">
                        Rs {item.price.toLocaleString("en-IN")}
                      </p>
                      <p className="mt-1 flex items-center gap-1.5">
                        <span className="mono text-[11px] text-ink-400 line-through">
                          Rs {item.originalPrice.toLocaleString("en-IN")}
                        </span>
                        {percent > 0 && (
                          <span className="mono text-[11px] font-medium text-assay-700">
                            save {percent}%
                          </span>
                        )}
                      </p>
                    </div>
                    <Link href={href} className="btn-outline !px-3 !py-1.5 !text-[13px]">
                      Book
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-3 sm:hidden">
          <RailButton direction="left" onClick={() => scroll("left")} disabled={!canScrollLeft} />
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
          <RailButton direction="right" onClick={() => scroll("right")} disabled={!canScrollRight} />
        </div>
      </div>
    </section>
  );
}
