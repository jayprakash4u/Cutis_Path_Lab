"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";

const AUTOPLAY_MS = 6500;

const slides = [
  {
    image: "/images/banners/hero-main.png",
    width: 6400,
    height: 1428,
    label: "Results you can act on",
    headline: (
      <>
        Results your doctor{" "}
        <span className="text-assay-400">can act on.</span>
      </>
    ),
    lede: "Pathology, haematology and molecular testing under one roof. We collect at your door and send the report back within 24 hours.",
  },
  {
    image: "/images/banners/1.jpg",
    width: 880,
    height: 586,
    label: "Diagnostic precision",
    headline: (
      <>
        Every sample, read with{" "}
        <span className="text-assay-400">precision.</span>
      </>
    ),
    lede: "NABL-accredited technologists and calibrated instruments behind every slide we examine and every panel we run.",
  },
  {
    image: "/images/banners/2.jpg",
    width: 960,
    height: 640,
    label: "Home collection, fast reports",
    headline: (
      <>
        From your doorstep to your{" "}
        <span className="text-assay-400">inbox in 24 hours.</span>
      </>
    ),
    lede: "Free home collection and careful handling, with a report delivered the same day it's ready — no clinic visit required.",
  },
  {
    image: "/images/banners/5.jpg",
    width: 1200,
    height: 675,
    label: "Our specialists",
    headline: (
      <>
        A full team of <span className="text-assay-400">specialists</span>{" "}
        behind every report.
      </>
    ),
    lede: "Pathologists and consultants review anything flagged before it ever reaches your doctor's desk.",
  },
];

const accreditations = ["NABL accredited", "ISO 15189:2012", "Open 365 days"];

const promises = [
  { k: "Turnaround", v: "24 hours" },
  { k: "Collection", v: "At your door" },
  { k: "Delivery", v: "WhatsApp or email" },
];

/**
 * A single line off a finished report, rendered the way the lab renders it.
 * It is the most characteristic thing this business produces, so it opens
 * the page — and it doubles as an explanation of what a patient receives.
 */
function SpecimenCard() {
  const low = 13.0;
  const high = 17.0;
  const value = 14.2;
  const position = ((value - low) / (high - low)) * 100;

  return (
    <figure className="on-light rise [animation-delay:320ms] w-full max-w-md rounded-lg bg-surface shadow-3 lg:justify-self-end">
      <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3">
        <p className="label !text-ink-500">
          Specimen{" "}
          <span className="mono text-[11px] font-medium tracking-normal text-ink-800">
            CPL-4471-08
          </span>
        </p>
        <span className="chip-assay">
          <span className="h-1.5 w-1.5 rounded-full bg-assay-600" aria-hidden="true" />
          Verified
        </span>
      </div>

      <div className="px-5 py-5">
        <p className="text-sm font-semibold text-ink-800">Haemoglobin</p>

        <p className="mt-1 flex items-baseline gap-1.5">
          <span className="mono text-[2.5rem] font-semibold leading-none text-ink-900">
            14.2
          </span>
          <span className="mono text-xs text-ink-400">g/dL</span>
        </p>

        {/* The reference interval, drawn. */}
        <div className="mt-6">
          <div className="relative h-1.5">
            <span className="absolute inset-0 rounded-full bg-surface-sunk" />
            <span className="trace absolute inset-y-0 left-0 right-0 rounded-full bg-assay-100" />
            <span
              className="assay-settle absolute top-1/2 h-3.5 w-3.5 rounded-full border-2 border-surface bg-assay-600 shadow-1"
              style={{ left: `${position}%` }}
              aria-hidden="true"
            />
          </div>

          <div className="mt-2 flex items-center justify-between">
            <span className="mono text-[11px] text-ink-400">{low.toFixed(1)}</span>
            <span className="label">Reference interval</span>
            <span className="mono text-[11px] text-ink-400">{high.toFixed(1)}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-b-lg border-t border-line bg-line">
        <div className="bg-surface px-5 py-3">
          <p className="label">Collected</p>
          <p className="mono mt-0.5 text-xs text-ink-700">07:20</p>
        </div>
        <div className="bg-surface px-5 py-3">
          <p className="label">Reported</p>
          <p className="mono mt-0.5 text-xs text-ink-700">13:05</p>
        </div>
      </div>
    </figure>
  );
}

function ArrowButton({ direction, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-9 w-9 items-center justify-center rounded-md border border-clinical-300/45 text-clinical-100 transition
        hover:border-clinical-300 hover:bg-clinical-300/10 hover:text-white"
      aria-label={direction === "left" ? "Previous highlight" : "Next highlight"}
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

export default function Hero() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;

  const goTo = useCallback(
    (i) => setIndex(((i % count) + count) % count),
    [count],
  );

  useEffect(() => {
    if (paused) return undefined;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return undefined;
    }
    const id = setInterval(() => setIndex((i) => (i + 1) % count), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [paused, count]);

  const slide = slides[index];

  return (
    <section
      className="band-deep relative isolate overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {/* Photographs as texture — stacked and crossfaded, blended so the blue stays blue */}
      <div className="absolute inset-0" aria-hidden="true">
        {slides.map((s, i) => (
          <Image
            key={s.image}
            src={s.image}
            alt=""
            width={s.width}
            height={s.height}
            priority={i === 0}
            unoptimized
            sizes="100vw"
            className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-1000 ease-in-out ${
              i === index ? "opacity-90" : "opacity-0"
            }`}
          />
        ))}
      </div>

      {/* Colour wash: cyan light from the right, teal lift at the base */}
      <div
        className="absolute -right-24 top-[-30%] h-[36rem] w-[36rem] rounded-full bg-clinical-500/35 blur-[120px]"
        aria-hidden="true"
      />
      <div
        className="absolute -left-32 bottom-[-40%] h-[30rem] w-[30rem] rounded-full bg-assay-600/25 blur-[130px]"
        aria-hidden="true"
      />

      {/* Legibility scrim on the text side only */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-deep-900/70 via-deep-900/25 to-transparent"
        aria-hidden="true"
      />

      {/* Faint ruling, like report stock */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, rgba(255,255,255,.6) 0 1px, transparent 1px 34px)",
        }}
        aria-hidden="true"
      />

      <div className="shell relative grid gap-12 py-14 sm:py-20 lg:grid-cols-[minmax(0,1fr)_26rem] lg:items-center lg:gap-16 lg:py-28">
        <div>
          <p className="rise eyebrow !text-clinical-300">
            Cutis Path Lab · Mid-Baneshwor, Kathmandu
          </p>

          <div key={index} aria-live="polite">
            <h1 className="rise mt-4 max-w-[16ch] text-[2.125rem] font-bold leading-[1.05] text-white sm:text-[2.75rem] lg:text-[3.5rem]">
              {slide.headline}
            </h1>

            <p className="rise [animation-delay:70ms] mt-5 max-w-[48ch] text-[0.9375rem] leading-relaxed text-clinical-100/85 sm:text-base">
              {slide.lede}
            </p>
          </div>

          <div className="rise [animation-delay:220ms] mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/book"
              className="btn-primary !bg-white !px-6 !py-3 !text-deep-900 hover:!bg-clinical-100"
            >
              Book a test
            </Link>
            <Link
              href="/tests"
              className="btn !border !border-clinical-300/45 !px-6 !py-3 !text-clinical-100 hover:!border-clinical-300 hover:!bg-clinical-300/10 hover:!text-white"
            >
              Browse all tests
            </Link>
          </div>

          {/* Carousel controls */}
          <div className="rise [animation-delay:260ms] mt-8 flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              {slides.map((s, i) => (
                <button
                  key={s.image}
                  type="button"
                  onClick={() => goTo(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === index ? "w-6 bg-assay-400" : "w-1.5 bg-clinical-300/35 hover:bg-clinical-300/60"
                  }`}
                  aria-label={`Show highlight: ${s.label}`}
                  aria-current={i === index}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <ArrowButton direction="left" onClick={() => goTo(index - 1)} />
              <ArrowButton direction="right" onClick={() => goTo(index + 1)} />
            </div>
          </div>

          <dl className="rise [animation-delay:290ms] mt-8 grid max-w-lg grid-cols-1 gap-px overflow-hidden rounded-md bg-clinical-300/25 sm:grid-cols-3">
            {promises.map((p) => (
              <div
                key={p.k}
                className="bg-deep-900/55 px-4 py-3 backdrop-blur-sm"
              >
                <dt className="label !text-clinical-300">{p.k}</dt>
                <dd className="mt-1 text-[13px] font-semibold text-white">
                  {p.v}
                </dd>
              </div>
            ))}
          </dl>

          <ul className="rise [animation-delay:360ms] mono mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] uppercase tracking-[0.14em] text-clinical-200">
            {accreditations.map((a) => (
              <li key={a} className="flex items-center gap-2">
                <span
                  className="h-1.5 w-1.5 rounded-full bg-assay-400"
                  aria-hidden="true"
                />
                {a}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <SpecimenCard />
          <p className="rise [animation-delay:420ms] ml-auto mt-4 max-w-md text-xs leading-relaxed text-clinical-100/70">
            Every result arrives like this — the value, its units, and the
            reference interval it sits in. No guesswork.
          </p>
        </div>
      </div>
    </section>
  );
}
