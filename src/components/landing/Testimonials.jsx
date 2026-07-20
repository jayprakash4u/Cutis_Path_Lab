"use client";

import { useState, useEffect } from "react";
import {
  useFullCardCarousel,
  CAROUSEL_BREAKPOINTS,
} from "@/lib/useFullCardCarousel";

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

function NavArrow({ direction, onClick, className = "" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-md transition-all duration-300 hover:border-sky-300 hover:text-sky-600 md:h-11 md:w-11 ${className}`}
      aria-label={direction === "left" ? "Previous reviews" : "Next reviews"}
    >
      <svg className="h-4 w-4 md:h-5 md:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {direction === "left" ? (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        )}
      </svg>
    </button>
  );
}

export default function Reviews() {
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
    gap,
  } = useFullCardCarousel({
    gap: 16,
    breakpoints: CAROUSEL_BREAKPOINTS.testimonials,
    itemCount: reviews.length,
    deps: [reviews.length, loading],
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
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-sky-50/60 via-white to-slate-50 py-6 sm:py-14 md:py-20">
      <div
        className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-sky-200/35 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-20 left-0 h-64 w-64 rounded-full bg-[#FF6B6B]/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-5 sm:mb-10 md:mb-12">
          <div className="mb-4 inline-block rounded-tr-2xl rounded-bl-2xl bg-sky-600 px-4 py-2">
            <h2 className="text-base font-bold text-white sm:text-lg md:text-xl">
              What Our Patients Say
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base md:text-lg">
            Real feedback from patients, physicians, and partners who trust our
            laboratory every day.
          </p>
        </div>

        {loading && (
          <p className="py-8 text-sm text-slate-500">Loading testimonials…</p>
        )}

        {!loading && reviews.length === 0 && (
          <p className="py-8 text-sm text-slate-500">No testimonials yet.</p>
        )}

        {!loading && reviews.length > 0 && (
          <>
            <div className="relative sm:px-10 md:px-12 lg:px-14">
              <NavArrow
                direction="left"
                onClick={() => scroll("left")}
                className="absolute left-0 top-1/2 z-20 hidden -translate-y-1/2 sm:flex"
              />

              <div ref={viewportRef} className="w-full overflow-hidden py-2 sm:py-3">
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
                      <div className="flex h-full flex-col rounded-2xl border-b-4 border-b-[#FF6B6B] bg-white px-3 py-4 shadow-md sm:px-5 sm:py-6 md:px-6 md:py-7">
                        <Stars rating={review.rating} />

                        <p className="mb-4 line-clamp-4 flex-1 text-xs leading-snug text-slate-600 sm:mb-6 sm:line-clamp-none sm:text-[15px] sm:leading-relaxed">
                          &ldquo;{review.content}&rdquo;
                        </p>

                        <div className="mt-auto flex items-center gap-2.5 border-t border-sky-100 pt-3 sm:gap-3 sm:pt-4">
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
                            <p className="truncate text-xs font-medium uppercase tracking-wider text-sky-600">
                              {review.role}
                            </p>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              <NavArrow
                direction="right"
                onClick={() => scroll("right")}
                className="absolute right-0 top-1/2 z-20 hidden -translate-y-1/2 sm:flex"
              />
            </div>

            <div className="mt-4 flex items-center justify-center gap-3 sm:mt-8">
              <NavArrow
                direction="left"
                onClick={() => scroll("left")}
                className="sm:hidden"
              />
              <div className="flex items-center gap-2">
                {Array.from({ length: totalDots }).map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => scrollToDot(index)}
                    className={`rounded-full transition-all duration-300 ${
                      index === activeIndex
                        ? "h-2.5 w-8 bg-sky-600"
                        : "h-2 w-2 bg-slate-300 hover:bg-slate-400"
                    }`}
                    aria-label={`Go to review set ${index + 1}`}
                  />
                ))}
              </div>
              <NavArrow
                direction="right"
                onClick={() => scroll("right")}
                className="sm:hidden"
              />
            </div>
          </>
        )}
      </div>
    </section>
  );
}
