"use client";

import Image from "next/image";
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

/* Shown when the section has no rows — an empty table must not blank the page.
   Images match the real files in public/images/disease-categories (PascalCase,
   .png — the folder the client supplied), and each row carries a short
   "why get tested" line the card needs but the DB rows don't have yet. */
const DEFAULT_CATEGORIES = [
  { slug: "anemia", title: "Anemia", file: "Anemia.png", description: "Detect low haemoglobin levels" },
  { slug: "diabetes", title: "Diabetes", file: "Diabetes.png", description: "Manage your blood sugar" },
  { slug: "heart", title: "Heart", file: "Heart.png", description: "Track your heart health" },
  { slug: "thyroid", title: "Thyroid", file: "Thyroid.png", description: "Monitor your hormone balance" },
  { slug: "kidney", title: "Kidney", file: "Kidney.png", description: "Keep your kidneys healthy" },
  { slug: "liver", title: "Liver", file: "Liver.png", description: "A healthy liver keeps you healthy" },
  { slug: "bone", title: "Bone", file: "Bone.png", description: "Strengthen your bone health" },
  { slug: "fever", title: "Fever", file: "Fever.png", description: "Identify the cause of fever" },
  { slug: "cancer", title: "Cancer", file: "Cancer.png", description: "Early detection saves lives" },
  { slug: "gut-health", title: "Gut Health", file: "GutHealth.png", description: "Support your digestive wellness" },
].map((c) => ({
  title: c.title,
  description: c.description,
  imageUrl: `/images/disease-categories/${c.file}`,
  linkUrl: `/tests?category=${c.slug}`,
}));

function CategoryCard({ category }) {
  return (
    <Link
      href={category.linkUrl || "/tests"}
      className="group flex h-full flex-col items-center rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-card-hover"
    >
      <span className="relative aspect-square w-full max-w-[140px] overflow-hidden">
        <Image
          src={category.imageUrl || "/images/disease-categories/Anemia.png"}
          alt=""
          fill
          sizes="140px"
          className="object-contain"
        />
      </span>

      {/* Category name — the caption naming what the card is, same red as the
          doctor-specialty and testimonial-role captions elsewhere on the site. */}
      <span className="mt-3 text-sm font-bold uppercase tracking-wide text-accent-500">
        {category.title}
      </span>
      <span className="mt-1 text-xs leading-snug text-slate-600 sm:text-[13px]">
        {category.description}
      </span>
    </Link>
  );
}

export default function TestByDiseaseCategories({ section, items }) {
  const categories = items?.length ? items : DEFAULT_CATEGORIES;

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
    breakpoints: CAROUSEL_BREAKPOINTS.diseaseCategories,
    itemCount: categories.length,
    deps: [categories.length],
  });

  return (
    <Section tone="tint" size="compact">
      <SectionHeading
        title={section?.title || "Find the right test for your condition"}
        subtitle={section?.subtitle || "Browse our most requested diagnostic panels by health concern."}
        actions={
          <div className="hidden items-center gap-3 sm:flex">
            <CarouselButton
              direction="left"
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              label="Previous conditions"
            />
            <CarouselButton
              direction="right"
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              label="Next conditions"
            />
          </div>
        }
      />

      <div ref={viewportRef} className="w-full overflow-hidden py-2">
        <ul
          ref={scrollRef}
          onScroll={handleScroll}
          className={`${scrollClassName} items-stretch`}
          style={{ gap: `${gap}px`, scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {categories.map((cat) => (
            <li key={cat.id || cat.linkUrl} style={cardWidthStyle} className={cardClassName}>
              <CategoryCard category={cat} />
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 flex items-center justify-center gap-3">
        <div className="sm:hidden">
          <CarouselButton
            direction="left"
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            label="Previous conditions"
          />
        </div>
        <CarouselDots total={totalDots} activeIndex={activeIndex} onSelect={scrollToDot} />
        <div className="sm:hidden">
          <CarouselButton
            direction="right"
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            label="Next conditions"
          />
        </div>
      </div>
    </Section>
  );
}
