"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";

const categories = [
  { label: "Anemia", image: "/images/disease-categories/anemia.jpg", slug: "anemia" },
  { label: "Diabetes", image: "/images/disease-categories/diabetes.jpg", slug: "diabetes" },
  { label: "Heart", image: "/images/disease-categories/heart.jpg", slug: "heart" },
  { label: "Thyroid", image: "/images/disease-categories/thyroid.jpg", slug: "thyroid" },
  { label: "Kidney", image: "/images/disease-categories/kidney.jpg", slug: "kidney" },
  { label: "Liver", image: "/images/disease-categories/liver.jpg", slug: "liver" },
  { label: "Bone", image: "/images/disease-categories/bone.jpg", slug: "bone" },
  { label: "Fever", image: "/images/disease-categories/fever.jpg", slug: "fever" },
  { label: "Cancer", image: "/images/disease-categories/cancer.jpg", slug: "cancer" },
  { label: "Gut Health", image: "/images/disease-categories/gut-health.jpg", slug: "gut-health" },
];

export default function TestByDiseaseCategories() {
  const scrollRef = useRef(null);

  const scrollBy = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: direction === "left" ? -280 : 280, behavior: "smooth" });
  };

  return (
    <section className="section-y relative bg-slate-50 shadow-lg shadow-slate-200/50">
      <div className="section-shell">
        <div className="section-head">
          <div className="mb-3 inline-block rounded-tr-2xl rounded-bl-2xl bg-sky-600 px-4 py-2">
            <h2 className="t-badge font-bold text-white">
              Test by Disease Categories
            </h2>
          </div>
          <p className="max-w-2xl t-lead text-slate-600">
            Pick a condition to see the tests doctors commonly order for it.
          </p>
        </div>

        <div className="relative">
          <div
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-6 bg-gradient-to-r from-slate-50 to-transparent sm:w-14"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-6 bg-gradient-to-l from-slate-50 to-transparent sm:w-14"
            aria-hidden="true"
          />

          <button
            type="button"
            onClick={() => scrollBy("left")}
            className="absolute left-0 top-1/2 z-20 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-md transition-all duration-300 hover:border-sky-300 hover:text-sky-600 hover:shadow-lg sm:flex"
            aria-label="Scroll categories left"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div
            ref={scrollRef}
            className="scrollbar-hide flex items-center gap-5 overflow-x-auto scroll-smooth px-1 py-6 sm:gap-7 sm:px-10 lg:py-10"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {categories.map((cat) => (
              <Link
                href={`/tests?category=${cat.slug}`}
                key={cat.slug}
                className="group flex shrink-0 items-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
              >
                <div className="relative z-10 h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-white bg-white shadow-md ring-1 ring-slate-200 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:ring-sky-300 sm:h-20 sm:w-20">
                  <Image src={cat.image} alt={cat.label} fill sizes="80px" className="object-cover" />
                </div>
                <span className="-ml-3 flex h-11 items-center whitespace-nowrap rounded-r-full bg-[#FF6B6B] py-0 pl-7 pr-4 t-meta font-semibold text-white shadow-sm transition-colors duration-300 group-hover:bg-sky-600 sm:h-12 sm:pl-8 sm:pr-5 sm:text-base">
                  {cat.label}
                </span>
              </Link>
            ))}
          </div>

          <button
            type="button"
            onClick={() => scrollBy("right")}
            className="absolute right-0 top-1/2 z-20 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-md transition-all duration-300 hover:border-sky-300 hover:text-sky-600 hover:shadow-lg sm:flex"
            aria-label="Scroll categories right"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}


