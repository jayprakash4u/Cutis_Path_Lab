"use client";

import { useState } from "react";
import { tests } from "@/data/staticData";
import Link from "next/link";

export default function PopularTestsPackages() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const popularTests = tests.slice(0, 12);
  const cardsPerView = 4;
  const totalSlides = Math.ceil(popularTests.length / cardsPerView);

  const getDiscount = (price, originalPrice) => {
    if (originalPrice && originalPrice > price) {
      return Math.round(((originalPrice - price) / originalPrice) * 100);
    }
    return 0;
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const visibleTests = popularTests.slice(
    currentIndex * cardsPerView,
    (currentIndex + 1) * cardsPerView
  );

  return (
    <section className="py-12 bg-gradient-to-br from-sky-50 to-white shadow-lg shadow-slate-200/50 relative">
      <div className="absolute top-0 left-0">
        <div className="bg-sky-600 px-4 py-2 rounded-tr-2xl rounded-bl-2xl">
          <h2 className="text-lg md:text-xl font-bold text-white">
            Popular Tests & Packages
          </h2>
        </div>
      </div>

      <div className="max-w-full pt-2">
        <div className="flex items-center justify-end mb-12 px-8">
          <Link
            href="/tests"
            className="text-sky-600 hover:text-sky-700 font-medium flex items-center gap-1 transition-colors text-small-bold whitespace-nowrap ml-4"
          >
            View All
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Carousel Container */}
        <div className="max-w-full">
          <div className="relative">
            {/* Previous Button */}
            <button
              onClick={handlePrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white shadow-lg border border-slate-200 flex items-center justify-center hover:bg-sky-50 hover:border-sky-400 transition-all duration-300"
            >
              <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Cards Container */}
            <div className="overflow-hidden mx-16">
              <div 
                className="flex gap-6 transition-transform duration-500"
                style={{ 
                  transform: `translateX(-${currentIndex * (100 / cardsPerView)}%)`,
                  width: `${(popularTests.length / cardsPerView) * 100}%`
                }}
              >
                {popularTests.map((test) => {
                  const discount = getDiscount(test.price, test.originalPrice);
                  return (
                    <div 
                      key={test.id}
                      className="w-96 bg-white rounded-2xl overflow-hidden shadow-sm flex-shrink-0"
                    >
                      <div className="bg-[#FF6B6B] px-4 py-1 min-h-[32px] flex items-center">
                        <div className="flex items-center justify-between w-full">
                          <h3 className="text-md font-semibold text-white truncate w-full">
                            {test.name}
                          </h3>
                        </div>
                      </div>

                      <div className="p-5">
                        <div className="flex items-center gap-4 mb-3">
                          <span className="flex items-center gap-2 text-sm text-slate-500">
                            <svg className="w-4 h-4 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            {test.reportsTime || "24-48 hrs"}
                          </span>
                          <span className="flex items-center gap-2 text-sm text-slate-500">
                            <svg className="w-4 h-4 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Fasting: {test.fasting ? test.fasting : "10-12 hrs"}
                          </span>
                        </div>

                        <div className="mb-4">
                          <div className="flex flex-col gap-2">
                            <span className="flex items-center gap-2 text-xs text-slate-600">
                              <svg className="w-3.5 h-3.5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                              </svg>
                              Sample: {test.sampleType || "Blood"}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-sky-600">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xl font-bold text-slate-900">₹{test.price}</span>
                              {test.originalPrice && (
                                <span className="text-sm text-slate-500 line-through">₹{test.originalPrice}</span>
                              )}
                            </div>
                            {discount > 0 && (
                              <span className="text-xs font-semibold text-green-600">{discount}% OFF</span>
                            )}
                          </div>
                          <button className="px-4 py-2 bg-sky-600 text-white text-sm font-medium rounded-lg hover:bg-sky-700 transition-colors">
                            Book Now
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Next Button */}
            <button
              onClick={handleNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white shadow-lg border border-slate-200 flex items-center justify-center hover:bg-sky-50 hover:border-sky-400 transition-all duration-300"
            >
              <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
