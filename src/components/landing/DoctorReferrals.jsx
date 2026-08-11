"use client";

import SectionHeader from "@/components/ui/SectionHeader";
import { referrals } from "@/data/landingData";
import {
  useFullCardCarousel,
  CAROUSEL_BREAKPOINTS,
} from "@/lib/useFullCardCarousel";

function initials(name) {
  return name
    .replace(/^Dr\.?\s+/i, "")
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function RailButton({ direction, onClick, disabled = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex h-9 w-9 items-center justify-center rounded-md border border-line bg-surface text-ink-500 transition
        hover:border-clinical-500 hover:text-clinical-700
        disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-line disabled:hover:text-ink-500"
      aria-label={direction === "left" ? "Previous clinicians" : "Next clinicians"}
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

export default function DoctorReferrals() {
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
    breakpoints: CAROUSEL_BREAKPOINTS.standard,
    itemCount: referrals.length,
    deps: [referrals.length],
  });

  return (
    <section className="section border-y border-line bg-surface">
      <div className="shell">
        <SectionHeader
          eyebrow="Referring clinicians"
          title="Who sends us their patients"
          lede="Specialists across Kathmandu who order from us regularly, and what keeps them doing it."
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
            {referrals.map((doctor) => (
              <article
                key={doctor.id}
                style={cardWidthStyle}
                className={`card card-hover flex h-full flex-col p-5 sm:p-6 ${cardClassName}`}
              >
                <div className="flex items-start gap-3.5">
                  <span className="mono flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-clinical-50 text-sm font-semibold text-clinical-700">
                    {initials(doctor.name)}
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-[0.9375rem] font-semibold leading-tight text-ink-900">
                      {doctor.name}
                    </h3>
                    <p className="mt-0.5 text-[13px] text-clinical-700">
                      {doctor.specialization}
                    </p>
                    <p className="mt-0.5 text-xs text-ink-400">{doctor.hospital}</p>
                  </div>
                </div>

                <blockquote className="mt-5 flex-1 border-t border-line pt-4 text-[13px] leading-relaxed text-ink-600">
                  {doctor.quote}
                </blockquote>

                <p className="label mt-4">Referring since {doctor.since}</p>
              </article>
            ))}
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
