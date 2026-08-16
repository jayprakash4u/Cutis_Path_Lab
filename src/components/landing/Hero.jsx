"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import FloatingSidebar from "./FloatingSidebar";

const heroImages = [
  {
    url: "/images/banners/herohomepagebanner/1.png",
    alt: "Homepage Banner 1",
  },
  {
    url: "/images/banners/herohomepagebanner/2.png",
    alt: "Homepage Banner 2",
  },
  {
    url: "/images/banners/herohomepagebanner/3.png",
    alt: "Homepage Banner 3",
  },
  {
    url: "/images/banners/herohomepagebanner/4.png",
    alt: "Homepage Banner 4",
  },
  {
    url: "/images/banners/herohomepagebanner/5.png",
    alt: "Homepage Banner 5",
  },
];

export default function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full overflow-hidden">
      <FloatingSidebar />

      <div className="relative mx-auto w-full max-w-[1920px] bg-[#eef5fb] leading-none sm:bg-slate-900 aspect-[3/1]">
        {heroImages.map((img, i) => (
          <Image
            key={img.url}
            src={img.url}
            alt={img.alt}
            width={2172}
            height={724}
            priority={i === 0}
            unoptimized
            sizes="(min-width: 1920px) 1920px, 100vw"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        <div className="absolute inset-0 hidden bg-gradient-to-r from-slate-800/70 via-slate-900/50 to-slate-900/60 sm:block" />
        <div className="absolute inset-0 hidden bg-gradient-to-b from-transparent via-transparent to-slate-900/80 sm:block" />

        <div className="absolute inset-0 hidden overflow-hidden sm:block">
          <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-sky-500/8 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 h-72 w-72 rounded-full bg-sky-400/5 blur-3xl" />
        </div>
      </div>

      <div className="absolute inset-0 z-10 hidden flex-col items-center justify-center px-4 text-center sm:flex sm:px-6 lg:px-8">
        <h1 className="mb-2 text-xl text-white drop-shadow-lg sm:mb-3 sm:text-2xl md:text-3xl lg:text-4xl">
          Your Trusted Partner in <span className="text-sky-400">Health</span>
        </h1>
        <p className="mb-3 max-w-xl text-xs text-slate-200 drop-shadow-lg sm:mb-4 sm:text-sm md:text-base">
          Accurate diagnostics delivered with speed & precision
        </p>
        <Link
          href="/book"
          className="whitespace-nowrap rounded-lg bg-gradient-to-r from-sky-500 to-sky-600 px-4 py-1.5 text-xs font-bold text-white shadow-xl shadow-sky-500/40 transition-all duration-300 hover:-translate-y-1 hover:from-sky-600 hover:to-sky-700 hover:shadow-sky-500/60 sm:px-5 sm:py-2 sm:text-sm"
        >
          Book Test Now
        </Link>
      </div>

      <div className="absolute bottom-6 left-1/2 z-20 hidden -translate-x-1/2 animate-bounce sm:block sm:bottom-12 lg:bottom-16">
        <svg
          className="h-4 w-4 text-sky-400 sm:h-5 sm:w-5"
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

      <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2 sm:bottom-8">
        {heroImages.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-2 w-2 rounded-full transition-all duration-300 ${
              i === index ? "bg-sky-400 w-4" : "bg-white/60 hover:bg-white"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
