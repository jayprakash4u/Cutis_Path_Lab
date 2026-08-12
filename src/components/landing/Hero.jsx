"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import FloatingSidebar from "./FloatingSidebar";

/**
 * The imagery rotates while the message stays put — the headline and CTA are
 * the one thing every visitor needs, so they shouldn't slide away mid-read.
 */
const SLIDES = [
  {
    url: "/images/banners/1.jpg",
    alt: "Lab technician examining a sample under a microscope",
  },
  {
    url: "/images/banners/2.jpg",
    alt: "Scientists handling a blood sample in the laboratory",
  },
  {
    url: "/images/banners/4.jpg",
    alt: "Blood collection tubes held up for testing",
  },
  {
    url: "/images/banners/3.jpg",
    alt: "Laboratory staff checking reagents at the bench",
  },
  {
    url: "/images/banners/5.jpg",
    alt: "The Cutis Path Lab team of pathologists and technicians",
  },
];

const INTERVAL_MS = 6000;

function Arrow({ direction, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="pointer-events-auto hidden h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-slate-900/30 text-white backdrop-blur-sm transition-colors hover:border-white/50 hover:bg-slate-900/55 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 sm:flex lg:h-11 lg:w-11"
      aria-label={direction === "left" ? "Previous slide" : "Next slide"}
    >
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d={direction === "left" ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
        />
      </svg>
    </button>
  );
}

export default function Hero() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotion.current = mq.matches;
    const onChange = (e) => {
      reducedMotion.current = e.matches;
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const go = useCallback((next) => {
    setIndex((current) => (next + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    if (paused || reducedMotion.current) return undefined;
    const id = setInterval(() => {
      setIndex((current) => (current + 1) % SLIDES.length);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, [paused, index]);

  return (
    <section
      className="relative w-full overflow-hidden"
      aria-roledescription="carousel"
      aria-label="Cutis Path Lab highlights"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <FloatingSidebar />

      <div className="hero-frame">
        {SLIDES.map((slide, i) => (
          <div
            key={slide.url}
            className={`absolute inset-0 transition-opacity duration-700 ease-out motion-reduce:transition-none ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden={i !== index}
          >
            <Image
              src={slide.url}
              alt={slide.alt}
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>
        ))}

        {/* Contrast pool sits behind the copy — see .hero-scrim in globals.css */}
        <div className="hero-scrim" aria-hidden="true" />

        {/* Message — fixed while the imagery rotates */}
        <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-5 text-center sm:px-6 lg:px-8">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-sky-100 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
            NABL-accredited diagnostics
          </p>
          <h1 className="hero-title mb-3 max-w-3xl text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl lg:text-5xl">
            Your Trusted Partner in <span className="text-sky-400">Health</span>
          </h1>
          <p className="hero-sub mb-7 max-w-xl text-sm leading-relaxed sm:text-base md:text-lg">
            Accurate diagnostics delivered with speed &amp; precision
          </p>
          <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/book"
              className="whitespace-nowrap rounded-lg bg-gradient-to-r from-sky-500 to-sky-600 px-6 py-2.5 text-sm font-bold text-white shadow-xl shadow-sky-500/40 transition-all duration-300 hover:-translate-y-0.5 hover:from-sky-600 hover:to-sky-700 hover:shadow-sky-500/60 sm:text-base"
            >
              Book Test Now
            </Link>
            <Link
              href="/tests"
              className="whitespace-nowrap rounded-lg border border-white/35 bg-white/10 px-6 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:border-white/60 hover:bg-white/20 sm:text-base"
            >
              Browse tests
            </Link>
          </div>
        </div>

        {/* Arrows */}
        <div className="pointer-events-none absolute inset-y-0 left-0 right-0 z-20 flex items-center justify-between px-3 sm:px-5 lg:px-8">
          <Arrow direction="left" onClick={() => go(index - 1)} />
          <Arrow direction="right" onClick={() => go(index + 1)} />
        </div>

        {/* Dots */}
        <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 sm:bottom-7">
          {SLIDES.map((slide, i) => (
            <button
              key={slide.url}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1} of ${SLIDES.length}`}
              aria-current={i === index}
              className={`h-2 rounded-full transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 ${
                i === index ? "w-7 bg-sky-400" : "w-2 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
