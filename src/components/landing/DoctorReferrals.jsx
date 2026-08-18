"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
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

// Admins can paste an arbitrary image URL (see admin/referrals `resolveImageUrl`),
// and next/image throws on a host that isn't in next.config remotePatterns.
// Optimise the sources we know are configured; fall back to a plain <img> for
// anything else so one bad URL can't take the homepage down.
const OPTIMISED_IMAGE_HOSTS = ["images.unsplash.com", "plus.unsplash.com"];

function canUseNextImage(src) {
  if (!src) return false;
  if (src.startsWith("/")) return true;
  try {
    return OPTIMISED_IMAGE_HOSTS.includes(new URL(src).hostname);
  } catch {
    return false;
  }
}

function DoctorAvatar({ src, alt }) {
  if (canUseNextImage(src)) {
    return <Image src={src} alt={alt} fill className="object-cover" sizes="88px" />;
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} className="h-full w-full object-cover" />;
}

function VerifiedBadge() {
  return (
    <span className="absolute -bottom-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-sky-600 text-white shadow-md ring-2 ring-white">
      <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
        <path
          fillRule="evenodd"
          d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      </svg>
    </span>
  );
}

/**
 * One card for every breakpoint — row layout on mobile, centred portrait from
 * `sm` up. Previously this was two separate components toggled with
 * `sm:hidden` / `hidden sm:block`, which put both in the DOM and fetched every
 * doctor's photo twice.
 */
function DoctorCard({ doctor }) {
  const image = doctor.image || doctor.imageUrl || "/images/cutis.png";

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 border-t-[3px] border-t-sky-600 bg-white shadow-card transition-shadow duration-300 hover:shadow-card-hover">
      <div className="flex flex-1 flex-col p-4 sm:items-center sm:p-5 sm:text-center">
        <div className="mb-3 flex items-start gap-3.5 sm:mb-4 sm:flex-col sm:items-center sm:gap-3">
          <div className="relative shrink-0">
            <div className="relative h-[72px] w-[72px] overflow-hidden rounded-2xl border-2 border-[#FF6B6B] bg-slate-100 shadow-sm sm:h-[88px] sm:w-[88px]">
              <DoctorAvatar src={image} alt={doctor.name} />
            </div>
            <VerifiedBadge />
          </div>

          <div className="min-w-0 flex-1 pt-0.5 sm:flex-none sm:pt-0">
            <h3 className="text-[15px] font-bold leading-tight text-slate-900 sm:text-base">
              {doctor.name}
            </h3>
            <p className="mt-0.5 text-xs font-semibold text-sky-600 sm:text-[13px]">
              {doctor.specialization}
            </p>
            {doctor.hospital && (
              <p className="mt-0.5 text-xs leading-snug text-slate-500">
                {doctor.hospital}
              </p>
            )}
          </div>
        </div>

        {/* flex-1 + clamp keeps every card the same height */}
        <blockquote className="relative flex-1 rounded-xl bg-slate-50 px-3.5 py-3 sm:w-full">
          <svg
            className="absolute left-3 top-2.5 h-4 w-4 text-[#FF6B6B]/40"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
          </svg>
          <p className="line-clamp-4 pl-5 text-xs leading-relaxed text-slate-600 sm:pl-0 sm:pt-3.5 sm:text-[13px]">
            {doctor.quote}
          </p>
        </blockquote>
      </div>

      <div className="h-1 shrink-0 bg-[#FF6B6B]" />
    </div>
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
    canScrollLeft,
    canScrollRight,
    gap,
  } = useFullCardCarousel({
    gap: 16,
    breakpoints: CAROUSEL_BREAKPOINTS.referrals,
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
    <Section tone="tint">
      <SectionHeading
        title="Trusted by specialists across the city"
        subtitle="Consultants who partner with Cutis Path Lab for accurate diagnostics and patient care."
        actions={
          <div className="hidden items-center gap-3 sm:flex">
            <CarouselButton
              direction="left"
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              label="Previous doctors"
            />
            <CarouselButton
              direction="right"
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              label="Next doctors"
            />
          </div>
        }
      />

      <div>

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
            <div className="relative">
              <div ref={viewportRef} className="w-full overflow-hidden py-2">
                <div
                  ref={scrollRef}
                  onScroll={handleScroll}
                  className={`${scrollClassName} items-stretch`}
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

            </div>

            <div className="mt-8 flex items-center justify-center gap-3">
              <div className="sm:hidden">
                <CarouselButton
                  direction="left"
                  onClick={() => scroll("left")}
                  disabled={!canScrollLeft}
                  label="Previous doctors"
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
                  label="Next doctors"
                />
              </div>
            </div>
          </>
        )}
      </div>
    </Section>
  );
}
