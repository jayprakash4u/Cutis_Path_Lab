"use client";

import Image from "next/image";
import Link from "next/link";
import SectionHeader from "@/components/ui/SectionHeader";
import {
  useFullCardCarousel,
  CAROUSEL_BREAKPOINTS,
} from "@/lib/useFullCardCarousel";

const categories = [
  { label: "Anemia", image: "/images/disease-categories/anemia.jpg", slug: "anemia", tone: "flag" },
  { label: "Diabetes", image: "/images/disease-categories/diabetes.jpg", slug: "diabetes", tone: "assay" },
  { label: "Heart", image: "/images/disease-categories/heart.jpg", slug: "heart", tone: "flag" },
  { label: "Thyroid", image: "/images/disease-categories/thyroid.jpg", slug: "thyroid", tone: "bloom" },
  { label: "Kidney", image: "/images/disease-categories/kidney.jpg", slug: "kidney", tone: "clinical" },
  { label: "Liver", image: "/images/disease-categories/liver.jpg", slug: "liver", tone: "assay" },
  { label: "Bone", image: "/images/disease-categories/bone.jpg", slug: "bone", tone: "clinical" },
  { label: "Fever", image: "/images/disease-categories/fever.jpg", slug: "fever", tone: "flag" },
  { label: "Cancer", image: "/images/disease-categories/cancer.jpg", slug: "cancer", tone: "bloom" },
  { label: "Gut Health", image: "/images/disease-categories/gut-health.jpg", slug: "gut-health", tone: "assay" },
];

const TONE_TEXT = {
  clinical: "text-clinical-600 group-hover:text-clinical-700",
  assay: "text-assay-600 group-hover:text-assay-700",
  bloom: "text-bloom-600 group-hover:text-bloom-700",
  flag: "text-flag-600 group-hover:text-flag-700",
};

const TONE_BORDER = {
  clinical: "group-hover:border-t-clinical-500",
  assay: "group-hover:border-t-assay-600",
  bloom: "group-hover:border-t-bloom-600",
  flag: "group-hover:border-t-flag-600",
};

function RailButton({ direction, onClick, disabled = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex h-9 w-9 items-center justify-center rounded-md border border-line bg-surface text-ink-500 shadow-1 transition
        hover:border-clinical-500 hover:text-clinical-700
        disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-line disabled:hover:text-ink-500"
      aria-label={direction === "left" ? "Previous conditions" : "Next conditions"}
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

export default function TestByDiseaseCategories() {
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
    itemCount: categories.length,
    deps: [categories.length],
  });

  return (
    <section className="section-tight border-y border-line bg-surface">
      <div className="shell">
        <SectionHeader
          eyebrow="Browse by condition"
          title="Not sure which test you need?"
          lede="Start from what you are being investigated for. Each area lists the panels a clinician would usually order."
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
            {categories.map((cat) => (
              <div key={cat.slug} style={cardWidthStyle} className={cardClassName}>
                <Link
                  href={`/tests?category=${cat.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-lg border border-line bg-surface transition duration-200 hover:-translate-y-0.5 hover:shadow-2"
                >
                  <span className="relative block h-36 w-full overflow-hidden bg-surface-sunk sm:h-40">
                    <Image
                      src={cat.image}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 45vw, 260px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span
                      className="absolute inset-0 bg-gradient-to-t from-deep-900/45 to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-30"
                      aria-hidden="true"
                    />
                  </span>
                  <span
                    className={`flex items-center justify-between gap-2 border-t-2 border-t-transparent px-4 py-3.5 transition-colors ${TONE_BORDER[cat.tone]}`}
                  >
                    <span className={`text-[15px] font-semibold ${TONE_TEXT[cat.tone]}`}>
                      {cat.label}
                    </span>
                    <svg
                      className={`h-4 w-4 shrink-0 transition group-hover:translate-x-0.5 ${TONE_TEXT[cat.tone]}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </Link>
              </div>
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
