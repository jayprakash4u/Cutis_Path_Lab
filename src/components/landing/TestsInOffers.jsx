"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";

const offerTests = [
  {
    id: 1,
    name: "Complete Body Checkup",
    category: "Full Body",
    originalPrice: 3500,
    discountedPrice: 2499,
    discount: 28,
    reportsTime: "24 hrs",
    fasting: "10-12 hrs",
    sampleType: "Blood",
  },
  {
    id: 2,
    name: "Diabetes Screening",
    category: "Diabetes",
    originalPrice: 1200,
    discountedPrice: 799,
    discount: 33,
    reportsTime: "24 hrs",
    fasting: "8-10 hrs",
    sampleType: "Blood",
  },
  {
    id: 3,
    name: "Heart Health Package",
    category: "Cardiology",
    originalPrice: 2800,
    discountedPrice: 1999,
    discount: 28,
    reportsTime: "24 hrs",
    fasting: "10-12 hrs",
    sampleType: "Blood",
  },
  {
    id: 4,
    name: "Thyroid Profile",
    category: "Hormone",
    originalPrice: 1200,
    discountedPrice: 899,
    discount: 25,
    reportsTime: "24 hrs",
    fasting: "8-10 hrs",
    sampleType: "Blood",
  },
  {
    id: 5,
    name: "Iron Deficiency Test",
    category: "Hematology",
    originalPrice: 900,
    discountedPrice: 599,
    discount: 33,
    reportsTime: "24 hrs",
    fasting: "8-10 hrs",
    sampleType: "Blood",
  },
  {
    id: 6,
    name: "Liver Function Test",
    category: "Liver",
    originalPrice: 1800,
    discountedPrice: 1299,
    discount: 28,
    reportsTime: "24 hrs",
    fasting: "10-12 hrs",
    sampleType: "Blood",
  },
  {
    id: 7,
    name: "Kidney Function Test",
    category: "Kidney",
    originalPrice: 1500,
    discountedPrice: 999,
    discount: 33,
    reportsTime: "24 hrs",
    fasting: "10-12 hrs",
    sampleType: "Blood",
  },
  {
    id: 8,
    name: "Lipid Profile",
    category: "Cardiology",
    originalPrice: 1100,
    discountedPrice: 749,
    discount: 32,
    reportsTime: "24 hrs",
    fasting: "10-12 hrs",
    sampleType: "Blood",
  },
  {
    id: 9,
    name: "CBC Test",
    category: "Hematology",
    originalPrice: 800,
    discountedPrice: 549,
    discount: 31,
    reportsTime: "24 hrs",
    fasting: "8-10 hrs",
    sampleType: "Blood",
  },
  {
    id: 10,
    name: "Vitamin D Test",
    category: "Hormone",
    originalPrice: 2000,
    discountedPrice: 1499,
    discount: 25,
    reportsTime: "48 hrs",
    fasting: "8-10 hrs",
    sampleType: "Blood",
  },
];

export default function TestsInOffers() {
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const cardsPerView = 2;

  const totalDots = Math.ceil(offerTests.length / cardsPerView);

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollLeft = scrollRef.current.scrollLeft;
      const cardWidth = scrollRef.current.offsetWidth / cardsPerView;
      const newIndex = Math.round(scrollLeft / (cardWidth * cardsPerView));
      setActiveIndex(newIndex);
    }
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const scrollToDot = (index) => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.offsetWidth / cardsPerView;
      scrollRef.current.scrollTo({ left: index * cardWidth * cardsPerView, behavior: "smooth" });
    }
  };

  return (
    <section className="py-4 sm:py-6 lg:py-8 bg-white relative">
      <div className="max-w-full mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
        {/* Section Header */}
        <div className="relative mb-3 sm:mb-4 md:mb-6">
          <div className="top-0 absolute">
            <div className="bg-sky-600 px-4 py-2 rounded-tr-2xl rounded-bl-2xl">
              <h2 className="text-lg md:text-xl font-bold text-white">Special Offers</h2>
            </div>
          </div>
          <div className="pt-12">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900">Flat 25-33% OFF On Lab Tests</h2>
            <p className="mt-1 text-[10px] sm:text-xs text-slate-500">Free home collection</p>
          </div>
        </div>

        {/* Scroll Container with Navigation */}
        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={() => scroll("left")}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border-2 border-slate-300 flex items-center justify-center text-slate-600 hover:border-sky-500 hover:text-white hover:bg-sky-600 transition-all duration-300 shadow-lg"
            aria-label="Scroll left"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Cards Scroll Container */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex gap-3 overflow-x-auto scrollbar-hide px-1 py-2 scroll-smooth"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {offerTests.map((test) => (
              <div
                key={test.id}
                className="flex-shrink-0 w-[95%] sm:w-[30%] md:w-[24%] lg:w-[19%] bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col"
              >
                {/* Card Header */}
                <div className="bg-[#FF6B6B] px-3 sm:px-3 py-1.5 sm:py-1 rounded-t-lg">
                  <h3 className="text-xs sm:text-sm font-semibold text-white text-center truncate">
                    {test.name}
                  </h3>
                </div>

                {/* Content */}
                <div className="p-1.5 sm:p-2 flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] sm:text-xs font-medium text-[#FF6B6B] bg-red-50 px-1.5 sm:px-2 py-0.5 rounded-full">
                      {test.category}
                    </span>
                    <span className="text-[10px] sm:text-xs font-bold text-sky-600 bg-sky-50 px-1.5 sm:px-2 py-0.5 rounded-full">
                      {test.discount}% OFF
                    </span>
                  </div>

                  {/* Details */}
                  <div className="space-y-0.5 mb-2">
                    <div className="flex items-center gap-1 text-[9px] sm:text-xs text-slate-500">
                      <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <span className="hidden sm:inline">Reports: {test.reportsTime}</span>
                      <span className="sm:hidden">{test.reportsTime}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[9px] sm:text-xs text-slate-500">
                      <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="hidden sm:inline">Fasting: {test.fasting}</span>
                      <span className="sm:hidden">{test.fasting}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[9px] sm:text-xs text-slate-500">
                      <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                      <span className="hidden sm:inline">Sample: {test.sampleType}</span>
                      <span className="sm:hidden">{test.sampleType}</span>
                    </div>
                  </div>

                  {/* Separator */}
                  <div className="border-t border-sky-300 my-1 sm:my-2"></div>

                  {/* Price & Button */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <span className="text-xs sm:text-base font-bold text-sky-600">₹{test.discountedPrice}</span>
                      <span className="text-[9px] sm:text-xs text-slate-400 line-through">₹{test.originalPrice}</span>
                    </div>
                    <Link
                      href="/book"
                      className="px-2 sm:px-3 py-1 bg-sky-600 text-white text-center font-semibold rounded-md hover:bg-sky-700 transition-all text-[10px] sm:text-xs"
                    >
                      Book
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => scroll("right")}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border-2 border-slate-300 flex items-center justify-center text-slate-600 hover:border-sky-500 hover:text-white hover:bg-sky-600 transition-all duration-300 shadow-lg"
            aria-label="Scroll right"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Scroll Dots Indicator */}
        <div className="flex justify-center gap-2 mt-4 md:hidden">
          {Array.from({ length: totalDots }).map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToDot(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? "bg-sky-600 w-6"
                  : "bg-slate-300"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}