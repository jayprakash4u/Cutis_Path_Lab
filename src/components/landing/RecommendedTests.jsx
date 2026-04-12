"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Link from "next/link";

const recommendedTests = [
  {
    id: "R001",
    name: "Complete Blood Count",
    category: "Hematology",
    price: 350,
    originalPrice: 450,
    image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&h=300&fit=crop",
    reason: "Based on your age group",
  },
  {
    id: "R002",
    name: "Thyroid Profile",
    category: "Hormone",
    price: 1200,
    originalPrice: 1500,
    image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=400&h=300&fit=crop",
    reason: "Popular in your area",
  },
  {
    id: "R003",
    name: "Lipid Profile",
    category: "Biochemistry",
    price: 600,
    originalPrice: 750,
    image: "https://images.unsplash.com/photo-1581093458791-9d3a7c86d86f?w=400&h=300&fit=crop",
    reason: "Recommended for your lifestyle",
  },
  {
    id: "R004",
    name: "Vitamin D3",
    category: "Vitamins",
    price: 1500,
    originalPrice: 1800,
    image: "https://plus.unsplash.com/premium_photo-1663011406193-7beb9d225d31?w=400&h=300&fit=crop",
    reason: "Trending this season",
  },
  {
    id: "R005",
    name: "Blood Sugar Fasting",
    category: "Biochemistry",
    price: 200,
    originalPrice: 250,
    image: "https://images.unsplash.com/photo-1579165466991-467135ad3114?w=400&h=300&fit=crop",
    reason: "Essential health check",
  },
  {
    id: "R006",
    name: "Liver Function Test",
    category: "Biochemistry",
    price: 800,
    originalPrice: 1000,
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop",
    reason: "Based on your profile",
  },
  {
    id: "R007",
    name: "Kidney Function Test",
    category: "Biochemistry",
    price: 700,
    originalPrice: 900,
    image: "https://images.unsplash.com/photo-1609825488888-3a766db0551a?w=400&h=300&fit=crop",
    reason: "Recommended for your age",
  },
  {
    id: "R008",
    name: "Hemoglobin A1C",
    category: "Diabetes",
    price: 500,
    originalPrice: 650,
    image: "https://images.unsplash.com/photo-1614935151651-0bea6508db6b?w=400&h=300&fit=crop",
    reason: "Important for diabetes monitoring",
  },
  {
    id: "R009",
    name: "Iron Studies",
    category: "Hematology",
    price: 900,
    originalPrice: 1100,
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&h=300&fit=crop",
    reason: "Based on your health profile",
  },
  {
    id: "R010",
    name: "Vitamin B12",
    category: "Vitamins",
    price: 800,
    originalPrice: 1000,
    image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=400&h=300&fit=crop",
    reason: "Recommended for vegetarians",
  },
  {
    id: "R011",
    name: "Urine Analysis",
    category: "Pathology",
    price: 250,
    originalPrice: 350,
    image: "https://images.unsplash.com/photo-1628595351029-c2bf17511435?w=400&h=300&fit=crop",
    reason: "Basic health screening",
  },
  {
    id: "R012",
    name: "ECG",
    category: "Cardiology",
    price: 400,
    originalPrice: 500,
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop",
    reason: "Heart health monitoring",
  },
];

export default function RecommendedTests() {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollPosition = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 10
    );
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener('scroll', checkScrollPosition);
    checkScrollPosition();

    return () => container.removeEventListener('scroll', checkScrollPosition);
  }, [checkScrollPosition]);

  const scrollLeft = () => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-10 lg:py-12 bg-white">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
            Recommended Tests
            </h2>
            <p className="mt-2 text-slate-500 text-sm">
              Personalized recommendations based on your health profile
            </p>
          </div>
          <Link 
            href="/tests" 
            className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-sky-600 hover:text-sky-700 transition-colors"
          >
            View all
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Carousel Container with Navigation */}
        <div className="relative group">
          {/* Left Navigation Button */}
          <button
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-lg border border-slate-200 transition-all duration-200 ${
              canScrollLeft
                ? 'opacity-0 group-hover:opacity-100 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                : 'opacity-0 cursor-not-allowed'
            }`}
            aria-label="Scroll left"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          {/* Right Navigation Button */}
          <button
            onClick={scrollRight}
            disabled={!canScrollRight}
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-lg border border-slate-200 transition-all duration-200 ${
              canScrollRight
                ? 'opacity-0 group-hover:opacity-100 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                : 'opacity-0 cursor-not-allowed'
            }`}
            aria-label="Scroll right"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>

          {/* Scroll Container */}
          <div 
            ref={scrollContainerRef}
            className="flex gap-5 overflow-x-auto scrollbar-hide pb-4"
          >
            {recommendedTests.map((test) => (
              <div 
                key={test.id}
                className="flex-shrink-0 w-72 bg-white rounded-xl border border-slate-200 overflow-hidden hover:border-slate-300 hover:shadow-lg transition-all duration-300 cursor-pointer group/card"
              >
                {/* Image Container */}
                <div className="relative h-40 overflow-hidden">
                  <img 
                    src={test.image} 
                    alt={test.name}
                    className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                  />
                  {/* Category Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-white/95 backdrop-blur-sm text-slate-700 shadow-sm">
                      {test.category}
                    </span>
                  </div>
                  {/* Recommendation Badge */}
                  <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-sky-600/95 backdrop-blur-sm text-white shadow-sm">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Recommended
                    </span>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-5">
                  {/* Test Name */}
                  <h3 className="text-base font-semibold text-slate-900 mb-1 group-hover/card:text-sky-600 transition-colors">
                    {test.name}
                  </h3>
                  
                  {/* Reason */}
                  <p className="text-sm text-slate-500 mb-4 flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {test.reason}
                  </p>
                  
                  {/* Price Section */}
                  <div className="flex items-end justify-between pt-4 border-t border-slate-100">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-slate-900">₹{test.price}</span>
                        <span className="text-sm text-slate-400 line-through">₹{test.originalPrice}</span>
                      </div>
                      <span className="inline-block mt-1 text-xs font-medium text-sky-600 bg-sky-50 px-2 py-0.5 rounded">
                        {Math.round((1 - test.price / test.originalPrice) * 100)}% OFF
                      </span>
                    </div>
                    <Link 
                      href="/book" 
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-sky-600 text-white text-sm font-medium rounded-lg hover:bg-sky-700 transition-colors shadow-sm"
                    >
                      Book Now
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile View All Link */}
        <div className="sm:hidden text-center mt-8">
          <Link 
            href="/tests" 
            className="inline-flex items-center gap-2 text-sm font-medium text-sky-600 hover:text-sky-700 transition-colors"
          >
            View all tests
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
