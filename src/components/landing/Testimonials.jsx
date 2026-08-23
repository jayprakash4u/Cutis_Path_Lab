"use client";

import { useState, useEffect } from "react";
import {
  useFullCardCarousel,
  CAROUSEL_BREAKPOINTS,
} from "@/lib/useFullCardCarousel";
import {
  Section,
  SectionHeading,
  CarouselButton,
  CarouselDots,
} from "@/components/ui/Section";

function Stars({ rating }) {
  return (
    <div className="mb-3 flex gap-1 sm:mb-4" aria-label={`${rating} out of 5 stars`}>
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`h-4 w-4 ${i < rating ? "text-amber-400" : "text-slate-200"}`}
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

export default function Reviews({ section }) {
  const [reviews, setReviews] = useState([]);
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
    gap: 16,
    breakpoints: CAROUSEL_BREAKPOINTS.testimonials,
    itemCount: reviews.length,
    deps: [reviews.length, loading],
    autoPlay: true,
    autoPlayInterval: 5000,
  });

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        const res = await fetch("/api/testimonials?featured=true");
        const json = await res.json();
        if (!cancelled && json.success && Array.isArray(json.data)) {
          setReviews(json.data);
        }
      } catch {
        if (!cancelled) setReviews([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Section
      tone="white"
      backdrop={
        <>
          {/*
            The angled panel. `clip-path` cuts a diagonal across the top edge:
            the top-left corner stays at y=0 while the top-right drops, so the
            white page shows through as a wedge. Kept flat below `sm` — a steep
            diagonal on a narrow screen eats the headline.
          */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-brand-900 via-brand-800 to-brand-600 [clip-path:polygon(0_0,100%_0,100%_100%,0_100%)] sm:[clip-path:polygon(0_0,100%_18%,100%_100%,0_100%)] lg:rounded-br-[8rem]"
            aria-hidden="true"
          />

          {/* Coral warmth — the second brand colour, kept as a diffuse glow so
              the panel stays sky-led rather than turning muddy in a blend. */}
          <div
            className="absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-accent-500/25 blur-3xl"
            aria-hidden="true"
          />

          {/* Bokeh — oversized circles at very low opacity for depth */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
            <span className="absolute -left-16 top-24 h-64 w-64 rounded-full bg-white/[0.06]" />
            <span className="absolute left-1/4 top-12 h-40 w-40 rounded-full bg-white/[0.05]" />
            <span className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-white/[0.04]" />
            <span className="absolute -bottom-10 right-1/4 h-56 w-56 rounded-full bg-accent-500/[0.12]" />
            <span className="absolute right-10 top-1/3 h-32 w-32 rounded-full bg-white/[0.06]" />
          </div>
        </>
      }
    >
      <SectionHeading
        onDark
        title={section?.title || "What our patients say"}
        subtitle={section?.subtitle || "Patients, physicians, and partners who trust our laboratory every day."}
        actions={
          <div className="hidden items-center gap-3 sm:flex">
            <CarouselButton
              direction="left"
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              label="Previous testimonials"
            />
            <CarouselButton
              direction="right"
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              label="Next testimonials"
            />
          </div>
        }
      />

      <div>

        {loading && (
          <p className="py-8 text-sm text-slate-500">Loading testimonials…</p>
        )}

        {!loading && reviews.length === 0 && (
          <p className="py-8 text-sm text-slate-500">No testimonials yet.</p>
        )}

        {!loading && reviews.length > 0 && (
          <>
            <div className="relative">
              <div ref={viewportRef} className="w-full overflow-hidden py-2">
                <div
                  ref={scrollRef}
                  onScroll={handleScroll}
                  className={scrollClassName}
                  style={{ gap: `${gap}px`, scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  {reviews.map((review) => (
                    <article
                      key={review.id}
                      data-review-card
                      style={cardWidthStyle}
                      className={cardClassName}
                    >
                      <div className="flex h-full flex-col rounded-2xl border border-slate-200 border-b-4 border-b-accent-500 bg-white p-5 shadow-card transition-shadow duration-300 hover:shadow-card-hover sm:p-6">
                        <Stars rating={review.rating} />

                        <p className="mb-4 line-clamp-4 flex-1 text-xs leading-snug text-slate-600 sm:mb-6 sm:line-clamp-none sm:text-[15px] sm:leading-relaxed">
                          &ldquo;{review.content}&rdquo;
                        </p>

                        <div className="mt-auto flex items-center gap-2.5 border-t border-brand-100 pt-3 sm:gap-3 sm:pt-4">
                          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl sm:h-11 sm:w-11">
                            <img
                              src={review.image}
                              alt={review.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <h3 className="truncate text-sm font-bold text-slate-900 sm:text-base">
                              {review.name}
                            </h3>
                            <p className="truncate text-xs font-medium uppercase tracking-wider text-brand-600">
                              {review.role}
                            </p>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

            </div>

            <div className="mt-8 flex items-center justify-center gap-3">
              <div className="sm:hidden">
                <CarouselButton
                  direction="left"
                  onClick={() => scroll("left")}
                  disabled={!canScrollLeft}
                  label="Previous testimonials"
                />
              </div>
              <CarouselDots
                onDark
                total={totalDots}
                activeIndex={activeIndex}
                onSelect={scrollToDot}
              />
              <div className="sm:hidden">
                <CarouselButton
                  direction="right"
                  onClick={() => scroll("right")}
                  disabled={!canScrollRight}
                  label="Next testimonials"
                />
              </div>
            </div>
          </>
        )}
      </div>
    </Section>
  );
}
