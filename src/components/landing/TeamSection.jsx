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
import { canUseNextImage } from "@/lib/optimisableImage";

/** Two letters from the name, for members added before their photo is ready. */
function initials(name) {
  return String(name || "")
    .replace(/^(dr|prof|mr|mrs|ms)\.?\s+/i, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");
}

function MemberPhoto({ src, name }) {
  if (!src) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-brand-50">
        <span className="text-2xl font-bold tracking-wide text-brand-600" aria-hidden="true">
          {initials(name) || "•"}
        </span>
      </div>
    );
  }

  if (canUseNextImage(src)) {
    return (
      <Image
        src={src}
        alt={name || ""}
        fill
        className="object-cover object-top"
        /* Matches the carousel's real card widths: 4 across in the 1440 shell,
           then 3, then 2, and on a phone one card plus a half-card peek, so
           roughly 100vw / 1.5. The old 100vw made phones fetch a file half as
           wide again as the slot it lands in. */
        sizes="(min-width: 1280px) 340px, (min-width: 900px) 33vw, (min-width: 620px) 50vw, 67vw"
      />
    );
  }

  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={name || ""} className="h-full w-full object-cover object-top" />;
}

function MemberCard({ member }) {
  const card = (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 border-t-4 border-t-brand-500 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-card-hover">
      {/*
        Square, not the 4:5 portrait this used to be. At a card width of ~250px
        on a phone that ratio made a 312px-tall photo before a word of text had
        been placed, which is what made these cards tower over every other band
        on the page. `object-top` keeps faces in frame through the tighter crop.
      */}
      <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
        <MemberPhoto src={member.imageUrl} name={member.title} />
      </div>

      <div className="flex flex-1 flex-col p-3.5 sm:p-4">
        <h3 className="text-sm font-bold leading-snug text-slate-900 transition-colors duration-300 group-hover:text-brand-700">
          {member.title}
        </h3>

        {member.badge ? (
          <p className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-accent-500">{member.badge}</p>
        ) : null}

        {member.note ? (
          <p className="mt-0.5 text-[0.7rem] uppercase tracking-wide text-slate-400">
            {member.note}
          </p>
        ) : null}

        {/* Clamped so one long bio can't set the height of the whole row */}
        {member.description ? (
          <p className="mt-2 flex-1 text-xs leading-relaxed text-slate-500 line-clamp-3">
            {member.description}
          </p>
        ) : null}
      </div>
    </article>
  );

  if (!member.linkUrl) return card;

  return (
    <Link
      href={member.linkUrl}
      className="block h-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
    >
      {card}
    </Link>
  );
}

/**
 * The people band. Unlike the other sections this has no built-in fallback
 * copy — inventing staff would be worse than showing nothing — so it renders
 * only once members are added in Admin → Home page → Our team.
 */
export default function TeamSection({ section, items }) {
  const members = items || [];

  /*
    Same carousel as the other card bands. On a phone this shows one card plus
    half of the next (peekRatio defaults to 0.5), so it reads as a row that
    scrolls rather than a single stranded card. The grid it replaces stacked
    one per row on mobile, which gave no hint there were more people below.

    Hooks run before the early return below — calling them conditionally would
    break the rules of hooks the moment `items` arrives empty.
  */
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
    breakpoints: CAROUSEL_BREAKPOINTS.referrals,
    itemCount: members.length,
    deps: [members.length],
  });

  if (members.length === 0) return null;

  return (
    <Section tone="tint">
      <SectionHeading
        title={section?.title || "Meet the team behind your reports"}
        subtitle={
          section?.subtitle ||
          "Pathologists, technologists and support staff who review every sample that comes through the lab."
        }
        actions={
          <div className="hidden items-center gap-3 sm:flex">
            <CarouselButton
              direction="left"
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              label="Previous team members"
            />
            <CarouselButton
              direction="right"
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              label="Next team members"
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
          {members.map((member) => (
            <li
              key={member.id || member.title}
              style={cardWidthStyle}
              className={cardClassName}
            >
              <MemberCard member={member} />
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 flex items-center justify-center gap-3">
        <div className="sm:hidden">
          <CarouselButton
            direction="left"
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            label="Previous team members"
          />
        </div>
        <CarouselDots total={totalDots} activeIndex={activeIndex} onSelect={scrollToDot} />
        <div className="sm:hidden">
          <CarouselButton
            direction="right"
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            label="Next team members"
          />
        </div>
      </div>

      {section?.ctaLabel && section?.ctaHref ? (
        <div className="mt-8 flex justify-center">
          <Link
            href={section.ctaHref}
            className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors duration-300 hover:bg-brand-700"
          >
            {section.ctaLabel}
          </Link>
        </div>
      ) : null}
    </Section>
  );
}
