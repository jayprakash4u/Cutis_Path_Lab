"use client";

import { useState } from "react";
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(offerTests.length / itemsPerPage);

  const nextPage = () => {
    setCurrentIndex((prev) => (prev + itemsPerPage) % offerTests.length);
  };

  const prevPage = () => {
    setCurrentIndex((prev) => (prev - itemsPerPage + offerTests.length) % offerTests.length);
  };

  const visibleTests = [];
  for (let i = 0; i < itemsPerPage; i++) {
    const index = (currentIndex + i) % offerTests.length;
    visibleTests.push(offerTests[index]);
  }

  return (
    <section className="py-6 lg:py-8 bg-white">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-3">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-slate-900">
            Flat 25-33% OFF On Lab Tests
          </h2>
          <p className="text-slate-600 text-xs mt-0.5 font-medium">
            🔥 Free home collection
          </p>
        </div>

        {/* Container with Left/Right Navigation */}
        <div className="flex items-center gap-4">
          {/* Previous Button */}
          <button
            onClick={prevPage}
            className="hidden md:flex w-10 h-10 rounded-full border-2 border-slate-300 flex items-center justify-center text-slate-600 hover:border-sky-500 hover:text-white hover:bg-sky-600 transition-all duration-300 flex-shrink-0"
            aria-label="Previous"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Cards Grid - 5 per row */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 px-4 flex-1">
            {visibleTests.map((test) => (
              <div 
                key={test.id}
                className="bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col"
              >
                {/* Card Header - Name at top */}
                <div className="bg-[#FF6B6B] px-3 py-1 rounded-t-lg">
                  <h3 className="text-sm font-semibold text-white text-center">
                    {test.name}
                  </h3>
                </div>
                
                {/* Content */}
                <div className="p-2 flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-[#FF6B6B] bg-red-50 px-2 py-0.5 rounded-full">
                      {test.category}
                  </span>
                  <span className="text-xs font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full">
                    {test.discount}% OFF
                  </span>
                </div>

                {/* Additional Details */}
                <div className="space-y-0.5 mb-2">
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <svg className="w-3.5 h-3.5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <span>Reports: {test.reportsTime}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <svg className="w-3.5 h-3.5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Fasting: {test.fasting}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <svg className="w-3.5 h-3.5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                    <span>Sample: {test.sampleType}</span>
                  </div>
                </div>
                
                {/* Separator Line */}
                <div className="border-t border-sky-300 my-2"></div>

                {/* Price & Action Button */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-sky-600">₹{test.discountedPrice}</span>
                    <span className="text-xs text-slate-400 line-through">₹{test.originalPrice}</span>
                  </div>
                  <Link 
                    href="/book"
                    className="px-3 py-1 bg-sky-600 text-white text-center font-semibold rounded-md hover:bg-sky-700 transition-all text-xs"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
          </div>

          {/* Next Button */}
          <button
            onClick={nextPage}
            className="hidden md:flex w-10 h-10 rounded-full border-2 border-slate-300 flex items-center justify-center text-slate-600 hover:border-sky-500 hover:text-white hover:bg-sky-600 transition-all duration-300 flex-shrink-0"
            aria-label="Next"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation Buttons */}
        <div className="flex justify-center gap-4 mt-4 md:hidden">
          <button
            onClick={prevPage}
            className="w-10 h-10 rounded-full border-2 border-slate-300 flex items-center justify-center text-slate-600 hover:border-sky-500 hover:text-white hover:bg-sky-600 transition-all duration-300"
            aria-label="Previous"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextPage}
            className="w-10 h-10 rounded-full border-2 border-slate-300 flex items-center justify-center text-slate-600 hover:border-sky-500 hover:text-white hover:bg-sky-600 transition-all duration-300"
            aria-label="Next"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}