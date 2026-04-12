"use client";

import { useState } from "react";

const reviews = [
  {
    id: 1,
    name: "Ramesh Kumar",
    role: "Patient",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    rating: 5,
    content: "Excellent service! The staff was very professional and the test results were delivered on time. Highly recommend Cutis Path Lab for all diagnostic needs.",
  },
  {
    id: 2,
    name: "Sita Devi",
    role: "Regular Patient",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    rating: 5,
    content: "I've been using Cutis Path Lab for years. The home collection service is very convenient and the reports are always accurate. Great experience every time.",
  },
  {
    id: 3,
    name: "Dr. Amit Sharma",
    role: "Physician",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop",
    rating: 5,
    content: "As a referring physician, I trust Cutis Path Lab for all my patients. Their accuracy and turnaround time are exceptional. Highly recommended.",
  },
  {
    id: 4,
    name: "Priya Patel",
    role: "Patient",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    rating: 4,
    content: "Very clean and well-maintained facility. The staff was friendly and explained everything clearly. Will definitely come back for future tests.",
  },
  {
    id: 5,
    name: "Mahesh Thapa",
    role: "Corporate Client",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    rating: 5,
    content: "We use Cutis Path Lab for our employee health checkups. Professional service, competitive pricing, and excellent reporting. Very satisfied with their service.",
  },
  {
    id: 6,
    name: "Anita Gurung",
    role: "Patient",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
    rating: 5,
    content: "The online booking system is so convenient! Got my appointment easily and the sample collection was done at my home. Great experience overall.",
  },
];

export default function Reviews() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextReview = () => {
    setCurrentIndex((prev) => (prev + 3) % reviews.length);
  };

  const prevReview = () => {
    setCurrentIndex((prev) => (prev - 3 + reviews.length) % reviews.length);
  };

  const visibleReviews = reviews.slice(currentIndex, currentIndex + 3);

  return (
    <section className="py-8 sm:py-10 lg:py-12 bg-slate-50 relative overflow-hidden">
      {/* Animated background accents */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-sky-500/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-sky-400/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-4 sm:mb-6">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-slate-900 mb-1">
            What Our Patients Say
          </h2>
          <p className="text-xs text-slate-600 max-w-xl mx-auto">Trusted by thousands of satisfied patients</p>
        </div>

        {/* Reviews Grid */}
        <div className="grid md:grid-cols-3 gap-3 lg:gap-4 mb-6">
          {visibleReviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-b-4 border-b-[#FF6B6B] group"
            >
              {/* Rating Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${i < review.rating ? "text-amber-400" : "text-slate-300"}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Content */}
              <p className="text-slate-600 mb-4 leading-relaxed group-hover:text-slate-700 transition-colors">
                "{review.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <img
                  src={review.image}
                  alt={review.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#FF6B6B]"
                />
                <div>
                  <h4 className="font-semibold text-slate-900">{review.name}</h4>
                  <p className="text-sm text-slate-500">{review.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={prevReview}
            className="w-12 h-12 rounded-full border-2 border-slate-300 flex items-center justify-center text-slate-600 hover:border-sky-500 hover:text-white hover:bg-sky-600 transition-all duration-300 hover:shadow-lg hover:shadow-sky-500/30"
            aria-label="Previous reviews"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextReview}
            className="w-12 h-12 rounded-full border-2 border-slate-300 flex items-center justify-center text-slate-600 hover:border-sky-500 hover:text-white hover:bg-sky-600 transition-all duration-300 hover:shadow-lg hover:shadow-sky-500/30"
            aria-label="Next reviews"
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