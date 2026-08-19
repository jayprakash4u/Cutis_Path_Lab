"use client";

import Link from "next/link";
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
import { toLines } from "@/lib/homeSections";

/* Shown when the section has no rows — an empty table must not blank the page. */
const DEFAULT_TECHNOLOGIES = [
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

const ICON_ORDER = ["ai", "digital", "molecular", "automation", "pcr", "tracking"];

function TechIcon({ iconKey, index }) {
  // Two-tone, matching the site: sky line work with coral detail accents.
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

  // Rows carry an icon key; anything unrecognised falls back to position.
  const byKey = ICON_ORDER.indexOf(iconKey);
  return icons[byKey >= 0 ? byKey : index] ?? icons[0];
}


export default function LabTechnology({ section, items }) {
  const technologies = items?.length ? items : DEFAULT_TECHNOLOGIES;

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
    gap: 20,
    breakpoints: CAROUSEL_BREAKPOINTS.lab,
    itemCount: technologies.length,
    deps: [technologies.length],
  });

  return (
    <Section
      tone="white"
      backdrop={
        <>
          {/*
            Third panel in the family, and deliberately the odd one: the other
            two are cut across the top, this one across the bottom. Same
            gradient and coral glow, so it reads as a sibling rather than a
            repeat. Flat below `sm`.
          */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-sky-900 via-sky-800 to-sky-600 [clip-path:polygon(0_0,100%_0,100%_100%,0_100%)] sm:[clip-path:polygon(0_0,100%_0,100%_84%,0_100%)] lg:rounded-tr-[8rem]"
            aria-hidden="true"
          />

          {/* Coral warmth, top-left — the corner the other two leave empty */}
          <div
            className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-[#FF6B6B]/25 blur-3xl"
            aria-hidden="true"
          />

          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
            <span className="absolute -right-16 top-20 h-64 w-64 rounded-full bg-white/[0.06]" />
            <span className="absolute left-1/3 top-10 h-40 w-40 rounded-full bg-white/[0.05]" />
            <span className="absolute bottom-10 right-1/4 h-72 w-72 rounded-full bg-white/[0.04]" />
            <span className="absolute bottom-16 left-16 h-48 w-48 rounded-full bg-[#FF6B6B]/[0.12]" />
          </div>
        </>
      }
    >
      <SectionHeading
        onDark
        title={section?.title || "Precision instruments, trusted science"}
        subtitle={section?.subtitle || "Modern diagnostics powered by digital workflows and accredited laboratory practice."}
        actions={
          <div className="hidden items-center gap-3 sm:flex">
            <CarouselButton
              direction="left"
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              label="Previous technologies"
            />
            <CarouselButton
              direction="right"
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              label="Next technologies"
            />
          </div>
        }
      />

      <div ref={viewportRef} className="w-full overflow-hidden py-2">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className={`${scrollClassName} items-stretch`}
          style={{ gap: `${gap}px`, scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {technologies.map((tech, idx) => (
            <article
              key={tech.id || tech.title}
              data-tech-card
              style={cardWidthStyle}
              className={cardClassName}
            >
              <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-sky-200 hover:shadow-card-hover">
                {/* Compact head: icon and title side by side on a light tint, so
                    the card leads with its name instead of a block of colour. */}
                <div className="flex items-center gap-3.5 border-b border-slate-100 bg-sky-50/60 px-5 py-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white shadow-card ring-1 ring-sky-100 transition-transform duration-300 group-hover:scale-105">
                    <span className="h-7 w-7">
                      <TechIcon iconKey={tech.iconKey} index={idx} />
                    </span>
                  </span>

                  <div className="min-w-0">
                    <h3 className="truncate text-base font-bold leading-snug text-slate-900">
                      {tech.title}
                    </h3>
                    <p className="mt-0.5 flex flex-wrap items-center gap-x-1.5 text-xs">
                      <span className="font-semibold text-sky-600">
                        {tech.badge || tech.highlight}
                      </span>
                      <span className="h-1 w-1 rounded-full bg-[#FF6B6B]" aria-hidden="true" />
                      <span className="text-slate-500">{tech.note || tech.support}</span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <ul className="flex-1 space-y-2.5">
                    {/* Edited rows store one bullet per line; the built-in
                        fallback still carries its grouped feature lists. */}
                    {(tech.features
                      ? tech.features.flatMap((group) => group.items)
                      : toLines(tech.description)
                    ).map((item) => (
                        <li key={item} className="flex items-start gap-3 text-sm text-slate-600">
                          <span
                            className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FF6B6B]"
                            aria-hidden="true"
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                  </ul>
                </div>

                {/* Coral foot — the site's established card close */}
                <span className="block h-1 w-full bg-[#FF6B6B]" aria-hidden="true" />
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-center gap-3">
        <div className="sm:hidden">
          <CarouselButton
            direction="left"
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            label="Previous technologies"
          />
        </div>
        <CarouselDots onDark total={totalDots} activeIndex={activeIndex} onSelect={scrollToDot} />
        <div className="sm:hidden">
          <CarouselButton
            direction="right"
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            label="Next technologies"
          />
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <Link
          href="/services"
          className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-sky-700 shadow-card transition-all duration-300 hover:bg-sky-50 hover:shadow-card-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          Explore all services
          <svg
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7-7 7M21 12H3" />
          </svg>
        </Link>
      </div>
    </Section>
  );
}
