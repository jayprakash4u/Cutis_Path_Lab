"use client";

import Link from "next/link";
import {
  useFullCardCarousel,
  CAROUSEL_BREAKPOINTS,
} from "@/lib/useFullCardCarousel";

const technologies = [
  {
    title: "AI Diagnostics",
    highlight: "Smarter review",
    support: "Consistent reads",
    features: [
      {
        label: "Clinical support",
        items: ["Pattern recognition", "Priority flagging", "Review assist"],
      },
      {
        label: "Quality outcomes",
        items: ["Fewer missed findings", "Faster second opinions"],
      },
    ],
  },
  {
    title: "Digital Pathology",
    highlight: "Slide imaging",
    support: "HD clarity",
    features: [
      {
        label: "Imaging workflow",
        items: ["Whole-slide scanning", "Remote review", "Case sharing"],
      },
      {
        label: "Storage & archive",
        items: ["Secure digital archive", "Easy retrieval"],
      },
    ],
  },
  {
    title: "Molecular Testing",
    highlight: "Genetic depth",
    support: "Targeted assays",
    features: [
      {
        label: "Assay types",
        items: ["DNA/RNA panels", "Infectious targets", "Oncology markers"],
      },
      {
        label: "Reporting",
        items: ["Clinician-ready results", "Actionable insights"],
      },
    ],
  },
  {
    title: "Lab Automation",
    highlight: "Faster flow",
    support: "Less manual error",
    features: [
      {
        label: "Process control",
        items: ["Automated aliquoting", "Barcode tracking", "Queue management"],
      },
      {
        label: "Turnaround",
        items: ["Reduced handling time", "Stable throughput"],
      },
    ],
  },
  {
    title: "PCR Technology",
    highlight: "Quick detection",
    support: "High sensitivity",
    features: [
      {
        label: "Detection",
        items: ["Real-time PCR", "Pathogen ID", "Viral load support"],
      },
      {
        label: "Use cases",
        items: ["Infection workups", "Outbreak response"],
      },
    ],
  },
  {
    title: "Smart Sample Tracking",
    highlight: "Full visibility",
    support: "Collection to report",
    features: [
      {
        label: "Chain of custody",
        items: ["Barcode scan points", "Status updates", "Location history"],
      },
      {
        label: "Patient confidence",
        items: ["Transparent progress", "Fewer lost samples"],
      },
    ],
  },
];

function TechIcon({ index }) {
  const stroke = "#0284C7";
  const accent = "#FF6B6B";

  const icons = [
    <svg key="ai" viewBox="0 0 80 80" fill="none" aria-hidden="true">
      <circle cx="40" cy="22" r="7" stroke={stroke} strokeWidth="2" />
      <circle cx="25" cy="40" r="6" stroke={stroke} strokeWidth="2" />
      <circle cx="55" cy="40" r="6" stroke={stroke} strokeWidth="2" />
      <circle cx="40" cy="58" r="7" stroke={stroke} strokeWidth="2" />
      <path d="M38 28 L27 36" stroke={stroke} strokeWidth="1.5" />
      <path d="M42 28 L53 36" stroke={stroke} strokeWidth="1.5" />
      <path d="M25 46 L40 52" stroke={stroke} strokeWidth="1.5" />
      <path d="M55 46 L40 52" stroke={stroke} strokeWidth="1.5" />
      <circle cx="40" cy="22" r="3" fill={accent} />
    </svg>,
    <svg key="digital" viewBox="0 0 80 80" fill="none" aria-hidden="true">
      <rect x="22" y="12" width="36" height="30" rx="2" stroke={stroke} strokeWidth="2" />
      <circle cx="40" cy="30" r="10" stroke={stroke} strokeWidth="1.5" />
      <circle cx="40" cy="30" r="5" fill={accent} opacity="0.25" />
      <line x1="28" y1="20" x2="52" y2="20" stroke={stroke} strokeWidth="1" opacity="0.6" />
      <line x1="30" y1="50" x2="30" y2="60" stroke={stroke} strokeWidth="2" />
      <line x1="40" y1="50" x2="40" y2="60" stroke={stroke} strokeWidth="2" />
      <line x1="50" y1="50" x2="50" y2="60" stroke={stroke} strokeWidth="2" />
      <rect x="25" y="58" width="30" height="6" rx="1" stroke={stroke} strokeWidth="1.5" />
    </svg>,
    <svg key="molecular" viewBox="0 0 80 80" fill="none" aria-hidden="true">
      <path
        d="M32 12 Q26 18 32 26 Q40 32 32 40 Q26 48 32 56 Q40 64 32 72"
        stroke={stroke}
        strokeWidth="2"
      />
      <path
        d="M48 12 Q54 18 48 26 Q40 32 48 40 Q54 48 48 56 Q40 64 48 72"
        stroke={stroke}
        strokeWidth="2"
      />
      <circle cx="32" cy="20" r="2.5" fill={accent} />
      <circle cx="48" cy="28" r="2.5" fill={accent} />
      <circle cx="32" cy="44" r="2.5" fill={accent} />
      <circle cx="48" cy="52" r="2.5" fill={accent} />
      <line x1="32" y1="20" x2="48" y2="28" stroke={stroke} strokeWidth="1" opacity="0.5" />
      <line x1="32" y1="44" x2="48" y2="52" stroke={stroke} strokeWidth="1" opacity="0.5" />
    </svg>,
    <svg key="automation" viewBox="0 0 80 80" fill="none" aria-hidden="true">
      <circle cx="20" cy="20" r="5" stroke={stroke} strokeWidth="2" />
      <circle cx="40" cy="20" r="5" stroke={stroke} strokeWidth="2" />
      <circle cx="60" cy="20" r="5" stroke={stroke} strokeWidth="2" />
      <circle cx="20" cy="50" r="5" stroke={stroke} strokeWidth="2" />
      <circle cx="40" cy="60" r="6" stroke={stroke} strokeWidth="2" />
      <circle cx="60" cy="50" r="5" stroke={stroke} strokeWidth="2" />
      <line x1="25" y1="20" x2="35" y2="20" stroke={stroke} strokeWidth="1.5" />
      <line x1="45" y1="20" x2="55" y2="20" stroke={stroke} strokeWidth="1.5" />
      <line x1="20" y1="25" x2="20" y2="45" stroke={stroke} strokeWidth="1.5" />
      <line x1="40" y1="25" x2="40" y2="54" stroke={stroke} strokeWidth="1.5" />
      <line x1="60" y1="25" x2="60" y2="45" stroke={stroke} strokeWidth="1.5" />
      <circle cx="40" cy="60" r="2.5" fill={accent} />
    </svg>,
    <svg key="pcr" viewBox="0 0 80 80" fill="none" aria-hidden="true">
      <path d="M12 55 Q16 48 20 55 Q24 62 28 55" stroke={stroke} strokeWidth="2" />
      <path d="M28 42 Q34 30 40 42 Q46 54 52 42" stroke={stroke} strokeWidth="2" />
      <path d="M48 30 Q56 14 64 30 Q72 46 80 30" stroke={stroke} strokeWidth="2" />
      <line x1="10" y1="60" x2="80" y2="60" stroke={stroke} strokeWidth="1.5" />
      <circle cx="20" cy="55" r="2" fill={accent} />
      <circle cx="40" cy="42" r="2" fill={accent} />
      <circle cx="64" cy="30" r="2" fill={accent} />
    </svg>,
    <svg key="tracking" viewBox="0 0 80 80" fill="none" aria-hidden="true">
      <rect x="14" y="22" width="40" height="42" rx="2" stroke={stroke} strokeWidth="2" />
      <rect x="20" y="28" width="28" height="8" rx="1" stroke={stroke} strokeWidth="1.5" />
      <circle cx="34" cy="48" r="8" stroke={stroke} strokeWidth="1.5" />
      <circle cx="34" cy="48" r="4" fill={accent} opacity="0.25" />
      <circle cx="58" cy="26" r="4" stroke={stroke} strokeWidth="1.5" />
      <circle cx="68" cy="16" r="3" stroke={stroke} strokeWidth="1.5" />
      <path d="M56 29 Q62 22 68 14" stroke={stroke} strokeWidth="1.5" opacity="0.7" />
      <path d="M66 64 L74 72" stroke={accent} strokeWidth="2" />
    </svg>,
  ];

  return icons[index] ?? icons[0];
}

export default function LabTechnology() {
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
    gap: 28,
    breakpoints: CAROUSEL_BREAKPOINTS.lab,
    itemCount: technologies.length,
    deps: [technologies.length],
  });

  return (
    <section className="section-y relative w-full overflow-hidden bg-gradient-to-b from-sky-50 via-white to-slate-50">
      <div
        className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-sky-200/40 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-16 left-0 h-64 w-64 rounded-full bg-[#FF6B6B]/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="section-shell relative">
        <div className="section-head">
          <div className="mb-3 inline-block rounded-tr-2xl rounded-bl-2xl bg-sky-600 px-4 py-2">
            <h2 className="t-badge font-bold text-white">
              Our Lab Technology
            </h2>
          </div>
          <p className="max-w-2xl t-lead text-slate-600">
            Modern diagnostics powered by precision instruments, digital
            workflows, and trusted laboratory science.
          </p>
        </div>

        <div className="relative sm:px-10 md:px-12 lg:px-14">
          <button
            type="button"
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-md transition-all duration-300 hover:border-sky-300 hover:text-sky-600 hover:shadow-lg sm:flex md:h-12 md:w-12"
            aria-label="Previous"
          >
            <svg className="h-4 w-4 md:h-5 md:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div ref={viewportRef} className="w-full overflow-hidden py-4 sm:py-8 lg:py-10">
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className={scrollClassName}
              style={{
                gap: `${gap}px`,
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {technologies.map((tech, idx) => (
                <article
                  key={tech.title}
                  data-tech-card
                  style={cardWidthStyle}
                  className={`relative ${cardClassName}`}
                >
                <div className="tech-card flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-slate-200/80 transition-shadow duration-300 hover:shadow-lg">
                  <div className="relative shrink-0 bg-[#FF6B6B] px-5 pb-6 pt-5 sm:px-7 sm:pb-9 sm:pt-7">
                    <h3 className="pr-14 text-base font-bold leading-tight text-white sm:pr-20 sm:text-2xl">
                      {tech.title}
                    </h3>
                    <div className="mt-1.5 flex flex-wrap items-baseline gap-x-2 gap-y-0.5 sm:mt-2 sm:gap-x-3">
                      <span className="text-base font-semibold text-white sm:text-lg">
                        {tech.highlight}
                      </span>
                      <span className="t-meta text-white/80 sm:text-sm">{tech.support}</span>
                    </div>

                    <Link
                      href="/services"
                      className="absolute bottom-0 right-4 flex h-14 w-14 translate-y-1/2 items-center justify-center rounded-xl border-2 border-sky-600 bg-white shadow-md transition-transform hover:scale-105 sm:right-5 sm:h-20 sm:w-20 sm:rounded-2xl"
                      aria-label={`${tech.title} — view services`}
                    >
                      <div className="h-9 w-9 sm:h-14 sm:w-14">
                        <TechIcon index={idx} />
                      </div>
                    </Link>
                  </div>

                  <div className="flex-1 px-4 pb-5 pt-8 t-body text-slate-700 sm:px-7 sm:pb-8 sm:pt-14 sm:text-base">
                    <ul className="space-y-4 sm:space-y-5">
                      {tech.features.map((group) => (
                        <li key={group.label}>
                          <p className="font-medium text-slate-800">
                            <span className="mr-1.5 text-[#FF6B6B]">•</span>
                            {group.label}
                          </p>
                          {group.items?.length > 0 && (
                            <ul className="mt-2 space-y-1.5 pl-4 text-slate-600">
                              {group.items.map((item) => (
                                <li key={item} className="flex gap-2">
                                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-sky-500" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-md transition-all duration-300 hover:border-sky-300 hover:text-sky-600 hover:shadow-lg sm:flex md:h-12 md:w-12"
            aria-label="Next"
          >
            <svg className="h-4 w-4 md:h-5 md:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="mt-5 flex items-center justify-center gap-3 sm:mt-8">
          <button
            type="button"
            onClick={() => scroll("left")}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-md sm:hidden"
            aria-label="Previous"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            {Array.from({ length: totalDots }).map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => scrollToDot(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === activeIndex ? "w-8 bg-sky-600" : "w-2 bg-slate-300"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => scroll("right")}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-md sm:hidden"
            aria-label="Next"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
