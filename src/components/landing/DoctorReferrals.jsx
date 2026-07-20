"use client";

import { useEffect, useState } from "react";
import {
  useFullCardCarousel,
  CAROUSEL_BREAKPOINTS,
} from "@/lib/useFullCardCarousel";

function DoctorCardMobile({ doctor }) {
  const image = doctor.image || doctor.imageUrl || "/images/cutis.png";
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-[0_4px_20px_rgba(15,23,42,0.07)]">
      <div className="h-1 shrink-0 bg-gradient-to-r from-sky-600 via-sky-500 to-sky-400" />

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-3 flex items-start gap-3.5">
          <div className="relative shrink-0">
            <div className="h-[72px] w-[72px] overflow-hidden rounded-2xl border-2 border-[#FF6B6B] bg-slate-100 shadow-sm">
              <img src={image} alt={doctor.name} className="h-full w-full object-cover" />
            </div>
            <span className="absolute -bottom-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-sky-600 text-white shadow-md">
              <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </span>
          </div>

          <div className="min-w-0 flex-1 pt-0.5">
            <h3 className="text-[15px] font-bold leading-tight text-slate-900">{doctor.name}</h3>
            <p className="mt-0.5 text-xs font-semibold text-sky-600">{doctor.specialization}</p>
            <p className="mt-0.5 text-[11px] leading-snug text-slate-500">{doctor.hospital}</p>
          </div>
        </div>

        <blockquote className="relative flex-1 rounded-xl bg-slate-50 px-3.5 py-3">
          <svg className="absolute left-3 top-2.5 h-4 w-4 text-[#FF6B6B]/40" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
          </svg>
          <p className="line-clamp-3 pl-5 text-xs leading-relaxed text-slate-600">{doctor.quote}</p>
        </blockquote>
      </div>

      <div className="h-1 shrink-0 bg-[#FF6B6B]" />
    </div>
  );
}

function DoctorCardDesktop({ doctor }) {
  const image = doctor.image || doctor.imageUrl || "/images/cutis.png";
  return (
    <div className="relative w-full pt-11 md:pt-11">
      <div className="relative rounded-[20px] border-t-[3px] border-t-sky-600 border-b-4 border-b-[#FF6B6B] bg-white px-6 pb-8 pt-14 text-center shadow-[0_4px_24px_rgba(15,23,42,0.08)] md:pt-16">
        <div className="absolute left-1/2 top-3 z-20 -translate-x-1/2 -translate-y-1/2 md:top-4">
          <div className="h-[88px] w-[88px] overflow-hidden rounded-[20px] border-[3px] border-[#FF6B6B] bg-white shadow-lg md:h-[96px] md:w-[96px]">
            <img src={image} alt={doctor.name} className="h-full w-full object-cover" />
          </div>
        </div>

        <h3 className="mb-1.5 text-base font-bold text-slate-900 md:text-lg">{doctor.name}</h3>
        <p className="mb-5 text-sm text-slate-500">
          {doctor.specialization}
          {doctor.hospital ? `, ${doctor.hospital}` : ""}
        </p>
        <p className="text-sm leading-relaxed text-slate-600 md:text-[15px]">&ldquo;{doctor.quote}&rdquo;</p>
      </div>
    </div>
  );
}

function DoctorCard({ doctor }) {
  return (
    <>
      <div className="sm:hidden">
        <DoctorCardMobile doctor={doctor} />
      </div>
      <div className="hidden sm:block">
        <DoctorCardDesktop doctor={doctor} />
      </div>
    </>
  );
}

export default function DoctorReferrals() {
  const [doctors, setDoctors] = useState([]);
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
    breakpoints: CAROUSEL_BREAKPOINTS.standard,
    itemCount: doctors.length,
    deps: [doctors.length, loading],
  });

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        const res = await fetch("/api/referrals");
        const json = await res.json();
        if (!cancelled && json.success && Array.isArray(json.data)) {
          setDoctors(json.data);
        } else if (!cancelled) {
          setDoctors([]);
        }
      } catch {
        if (!cancelled) setDoctors([]);
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
    <section className="relative w-full overflow-hidden bg-white py-6 sm:py-14 md:py-20">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-5 sm:mb-10 md:mb-14">
          <div className="mb-4 inline-block rounded-tr-2xl rounded-bl-2xl bg-sky-600 px-4 py-2">
            <h2 className="text-base font-bold text-white sm:text-lg md:text-xl">
              Our Referral Network
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base md:text-lg">
            Trusted specialists across specialties who partner with Cutis Path
            Lab for accurate diagnostics and patient care.
          </p>
        </div>

        {loading && (
          <p className="py-8 text-center text-sm text-slate-500">Loading referral network…</p>
        )}

        {!loading && doctors.length === 0 && (
          <p className="py-8 text-center text-sm text-slate-500">
            Referral partners will appear here soon.
          </p>
        )}

        {!loading && doctors.length > 0 && (
          <>
            <div className="relative sm:px-10 md:px-12">
              <button
                type="button"
                onClick={() => scroll("left")}
                className="absolute left-0 top-1/2 z-20 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-sky-600 shadow-sm transition-all duration-200 hover:border-sky-300 hover:shadow-md sm:flex md:h-10 md:w-10"
                aria-label="Previous doctors"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <div ref={viewportRef} className="w-full overflow-hidden py-2 sm:py-2 sm:pt-4">
                <div
                  ref={scrollRef}
                  onScroll={handleScroll}
                  className={scrollClassName}
                  style={{ gap: `${gap}px`, scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  {doctors.map((doctor) => (
                    <article
                      key={doctor.id}
                      data-doctor-card
                      style={cardWidthStyle}
                      className={cardClassName}
                    >
                      <DoctorCard doctor={doctor} />
                    </article>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => scroll("right")}
                className="absolute right-0 top-1/2 z-20 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-sky-600 shadow-sm transition-all duration-200 hover:border-sky-300 hover:shadow-md sm:flex md:h-10 md:w-10"
                aria-label="Next doctors"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <div className="mt-5 flex items-center justify-center gap-3 sm:mt-10">
              <button
                type="button"
                onClick={() => scroll("left")}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-sky-600 shadow-sm sm:hidden"
                aria-label="Previous doctors"
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
                    className={`rounded-full transition-all duration-300 ${
                      index === activeIndex
                        ? "h-2.5 w-8 bg-sky-600"
                        : "h-2 w-2 bg-slate-300 hover:bg-slate-400"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() => scroll("right")}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-sky-600 shadow-sm sm:hidden"
                aria-label="Next doctors"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
