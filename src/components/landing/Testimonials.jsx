"use client";

import SectionHeader from "@/components/ui/SectionHeader";
import { testimonials } from "@/data/landingData";
import {
  useFullCardCarousel,
  CAROUSEL_BREAKPOINTS,
} from "@/lib/useFullCardCarousel";

function Stars({ rating }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5`}>
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`h-3.5 w-3.5 ${i < rating ? "text-clinical-600" : "text-line-strong"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
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
      aria-label={direction === "left" ? "Previous reviews" : "Next reviews"}
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

export default function Testimonials() {
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
    breakpoints: CAROUSEL_BREAKPOINTS.testimonials,
    itemCount: testimonials.length,
    deps: [testimonials.length],
  });

  return (
    <section className="section bg-paper">
      <div className="shell">
        <SectionHeader
          eyebrow="Feedback"
          title="What people say afterwards"
          lede="Unedited comments from patients and referring physicians."
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
            {testimonials.map((review) => (
              <article
                key={review.id}
                style={cardWidthStyle}
                className={cardClassName}
              >
                <div className="card card-hover flex h-full flex-col p-5 sm:p-6">
                  <Stars rating={review.rating} />

                  <p className="mt-4 flex-1 text-[13px] leading-relaxed text-ink-600 sm:text-sm">
                    {review.content}
                  </p>

                  <div className="mt-5 border-t border-line pt-4">
                    <p className="text-[13px] font-semibold text-ink-900">
                      {review.name}
                    </p>
                    <p className="label mt-1">{review.role}</p>
                  </div>
                </div>
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
                aria-label={`Go to review set ${index + 1}`}
              />
            ))}
          </div>
          <RailButton direction="right" onClick={() => scroll("right")} disabled={!canScrollRight} />
        </div>
      </div>
    </section>
  );
}
