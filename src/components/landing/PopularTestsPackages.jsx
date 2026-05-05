"use client";

import { useRef, useState, useEffect } from "react";
import { tests } from "@/data/staticData";
import Link from "next/link";

export default function PopularTestsPackages() {
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const popularTests = tests.slice(0, 12);
  const cardsPerView = 2;
  const totalDots = Math.ceil(popularTests.length / cardsPerView);

  const getDiscount = (price, originalPrice) => {
    if (originalPrice && originalPrice > price) {
      return Math.round(((originalPrice - price) / originalPrice) * 100);
    }
    return 0;
  };

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
    <section className="py-6 sm:py-8 md:py-10 lg:py-12 bg-gradient-to-br from-sky-50 to-white shadow-lg shadow-slate-200/50 relative">
      <div className="absolute top-0 left-0">
        <div className="bg-sky-600 px-3 sm:px-4 py-1.5 sm:py-2 rounded-tr-xl sm:rounded-tr-2xl rounded-bl-xl sm:rounded-bl-2xl">
          <h2 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-white">
            Popular Tests & Packages
          </h2>
        </div>
      </div>

      <div className="max-w-full pt-1 sm:pt-2">
        <div className="flex items-center justify-end mb-4 sm:mb-6 md:mb-8 lg:mb-10 px-4 sm:px-6 md:px-8">
          <Link
            href="/tests"
            className="text-sky-600 hover:text-sky-700 text-xs sm:text-sm font-medium flex items-center gap-1 transition-colors whitespace-nowrap"
          >
            View All
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Scroll Container with Navigation */}
        <div className="relative">
          {/* Left Arrow - hidden on mobile */}
          <button
            onClick={() => scroll("left")}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white shadow-lg border border-slate-200 items-center justify-center hover:bg-sky-50 hover:border-sky-400 transition-all duration-300"
            aria-label="Scroll left"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Cards Scroll Container */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex gap-3 overflow-x-auto scrollbar-hide px-2 sm:px-4 md:px-8 lg:px-16 py-2 scroll-smooth"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {popularTests.map((test) => {
              const discount = getDiscount(test.price, test.originalPrice);
              return (
                <div 
                  key={test.id}
                  className="flex-shrink-0 w-[85%] sm:w-[30%] md:w-[24%] lg:w-[19%] bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-sm flex flex-col"
                >
                  <div className="bg-[#FF6B6B] px-2 sm:px-3 md:px-4 py-1 min-h-[24px] sm:min-h-[28px] md:min-h-[32px] flex items-center">
                    <h3 className="text-[10px] sm:text-xs md:text-sm font-semibold text-white truncate w-full">
                      {test.name}
                    </h3>
                  </div>

                  <div className="p-2 sm:p-3 md:p-5 flex-1">
                    <div className="flex flex-col gap-1 sm:gap-2 mb-2 sm:mb-3">
                      <span className="flex items-center gap-1 text-[10px] sm:text-xs text-slate-500">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <span className="hidden sm:inline">Reports: </span>{test.reportsTime || "24-48 hrs"}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] sm:text-xs text-slate-500">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="hidden sm:inline">Fasting: </span>{test.fasting ? test.fasting : "10-12 hrs"}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] sm:text-xs text-slate-500">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                        <span className="hidden sm:inline">Sample: </span>{test.sampleType || "Blood"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-sky-600">
                      <div>
                        <div className="flex items-center gap-1 sm:gap-2">
                          <span className="text-sm sm:text-base md:text-xl font-bold text-slate-900">₹{test.price}</span>
                          {test.originalPrice && (
                            <span className="text-[10px] sm:text-xs text-slate-500 line-through">₹{test.originalPrice}</span>
                          )}
                        </div>
                        {discount > 0 && (
                          <span className="text-[10px] sm:text-xs font-semibold text-green-600">{discount}% OFF</span>
                        )}
                      </div>
                      <button className="px-2 sm:px-3 md:px-4 py-1 sm:py-2 bg-sky-600 text-white text-[10px] sm:text-xs md:text-sm font-medium rounded-lg hover:bg-sky-700 transition-colors">
                        Book
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Arrow - hidden on mobile */}
          <button
            onClick={() => scroll("right")}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white shadow-lg border border-slate-200 items-center justify-center hover:bg-sky-50 hover:border-sky-400 transition-all duration-300"
            aria-label="Scroll right"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
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