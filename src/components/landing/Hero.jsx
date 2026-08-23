"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import FloatingSidebar from "./FloatingSidebar";

/*
  Each slide ships a phone-sized companion. The desktop art is 1.4-2.2 MB per
  file; the mobile JPGs are ~100 KB, so a phone pulls roughly 500 KB for the
  whole carousel instead of ~8 MB.

  The slide list is discovered from disk by getHeroBanners() and passed in, so
  re-exporting a banner from PNG to JPG cannot silently 404 the slide.
*/
const MOBILE_UP_TO = 639;

const DEFAULT_TITLE = "Your Trusted Partner in Health";
const DEFAULT_HIGHLIGHT = "Health";

/**
 * Splits the headline around the highlighted word so the accent colour can be
 * edited from the admin panel instead of being baked into the markup.
 */
function splitHeadline(title, highlight) {
  if (!highlight) return [title, null, ""];
  const at = title.toLowerCase().lastIndexOf(highlight.toLowerCase());
  if (at < 0) return [title, null, ""];
  return [title.slice(0, at), title.slice(at, at + highlight.length), title.slice(at + highlight.length)];
}

export default function Hero({ slides = [], section, items }) {
  /* Slides come from the admin screen once any are saved; with none, the disk
     scan passed in as `slides` still runs, which is what shipped before. */
  const heroImages = items?.length
    ? items.map((item) => ({
        url: item.imageUrl,
        mobileUrl: item.mobileImageUrl || null,
        alt: item.title || "",
        href: item.linkUrl || null,
      }))
    : slides;

  const [index, setIndex] = useState(0);

  const [before, accent, after] = splitHeadline(
    section?.title || DEFAULT_TITLE,
    section?.highlight ?? DEFAULT_HIGHLIGHT,
  );

  const count = heroImages.length;

  useEffect(() => {
    // `% 0` is NaN — a single slide needs no timer anyway.
    if (count < 2) return undefined;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % count);
    }, 4000);
    return () => clearInterval(timer);
  }, [count]);

  return (
    <section className="relative w-full overflow-hidden">
      <FloatingSidebar />

      {/*
        Each artwork is held at its own native ratio so nothing is cropped:
        1024x506 for the phone art, 3:1 for the desktop art.
      */}
      <div className="relative mx-auto aspect-[1024/506] w-full max-w-[1920px] bg-brand-50 leading-none sm:aspect-[3/1] sm:bg-slate-900">
        {heroImages.map((img, i) => (
          /*
            <picture> rather than two elements toggled with `hidden` — CSS only
            hides an element, it does not cancel the download, so that would
            fetch both the 1.5 MB desktop PNG and the phone JPG on every device.
            Same approach as PagePosterHero.
          */
          <picture key={img.url}>
            {/* A slide with no phone art falls back to the desktop file. */}
            {img.mobileUrl ? (
              <source
                media={`(max-width: ${MOBILE_UP_TO}px)`}
                srcSet={img.mobileUrl}
                width={1024}
                height={506}
              />
            ) : null}
            <img
              src={img.url}
              alt={img.alt}
              width={2172}
              height={724}
              fetchPriority={i === 0 ? "high" : undefined}
              loading={i === 0 ? "eager" : "lazy"}
              decoding="async"
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
                i === index ? "opacity-100" : "opacity-0"
              }`}
            />
          </picture>
        ))}

        <div className="absolute inset-0 hidden bg-gradient-to-r from-slate-800/70 via-slate-900/50 to-slate-900/60 sm:block" />
        <div className="absolute inset-0 hidden bg-gradient-to-b from-transparent via-transparent to-slate-900/80 sm:block" />

        <div className="absolute inset-0 hidden overflow-hidden sm:block">
          <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-brand-500/8 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 h-72 w-72 rounded-full bg-brand-400/5 blur-3xl" />
        </div>

        {/* Slide dots live on the image, so the mobile copy block below is clear */}
        <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-2 sm:bottom-8">
          {heroImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              /* The phone artwork is light, so white dots would vanish on it —
                 they only go white once the dark desktop overlay is in play. */
              className={`h-2 rounded-full transition-all duration-300 ${
                i === index
                  ? "w-4 bg-brand-600 sm:bg-brand-400"
                  : "w-2 bg-slate-400/70 hover:bg-slate-500 sm:bg-white/60 sm:hover:bg-white"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/*
        One copy block, two behaviours: it sits below the banner on mobile and
        becomes an overlay on the image from `sm` up.

        The phone artwork carries its own headline and strapline, so repeating
        them underneath just says the same thing twice. On mobile this collapses
        to the CTA alone — the one thing the artwork can't provide. The h1 stays
        in the accessibility tree via sr-only rather than being removed with
        `hidden`, so the page still has a heading on phones.
      */}
      <div className="relative z-10 flex flex-col items-center justify-center bg-brand-50 px-4 py-4 text-center sm:absolute sm:inset-0 sm:bg-transparent sm:px-6 sm:py-0 lg:px-8">
        <h1 className="sr-only sm:not-sr-only sm:mb-3 sm:text-2xl sm:text-white sm:drop-shadow-lg md:text-3xl lg:text-4xl">
          {before}
          {accent ? <span className="sm:text-brand-400">{accent}</span> : null}
          {after}
        </h1>
        <p className="hidden max-w-xl sm:mb-4 sm:block sm:text-xs sm:text-slate-200 sm:drop-shadow-lg md:text-base">
          {section?.subtitle || "Accurate diagnostics delivered with speed & precision"}
        </p>
        <Link
          href={section?.ctaHref || "/book"}
          className="whitespace-nowrap rounded-lg bg-gradient-to-r from-brand-500 to-brand-600 px-5 py-2.5 text-sm font-bold text-white shadow-xl shadow-brand-500/40 transition-all duration-300 hover:-translate-y-1 hover:from-brand-600 hover:to-brand-700 hover:shadow-brand-500/60 sm:px-5 sm:py-2 sm:text-sm"
        >
          {section?.ctaLabel || "Book Test Now"}
        </Link>
      </div>

      <div className="absolute bottom-6 left-1/2 z-20 hidden -translate-x-1/2 animate-bounce sm:block sm:bottom-12 lg:bottom-16">
        <svg
          className="h-4 w-4 text-brand-400 sm:h-5 sm:w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>

    </section>
  );
}
