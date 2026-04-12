"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Link from "next/link";

const popularTests = [
  {
    id: "P001",
    name: "Complete Blood Count",
    category: "Hematology",
    price: 350,
    originalPrice: 450,
    image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&h=300&fit=crop",
    rating: 4.9,
    reviews: 2847,
  },
  {
    id: "P002",
    name: "Thyroid Profile",
    category: "Hormone",
    price: 1200,
    originalPrice: 1500,
    image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=400&h=300&fit=crop",
    rating: 4.8,
    reviews: 1923,
  },
  {
    id: "P003",
    name: "Lipid Profile",
    category: "Biochemistry",
    price: 600,
    originalPrice: 750,
    image: "https://images.unsplash.com/photo-1581093458791-9d3a7c86d86f?w=400&h=300&fit=crop",
    rating: 4.7,
    reviews: 1654,
  },
  {
    id: "P004",
    name: "Blood Sugar Fasting",
    category: "Biochemistry",
    price: 200,
    originalPrice: 250,
    image: "https://images.unsplash.com/photo-1579165466991-467135ad3114?w=400&h=300&fit=crop",
    rating: 4.8,
    reviews: 2156,
  },
  {
    id: "P005",
    name: "Liver Function Test",
    category: "Biochemistry",
    price: 800,
    originalPrice: 1000,
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop",
    rating: 4.6,
    reviews: 1432,
  },
  {
    id: "P006",
    name: "Vitamin D3",
    category: "Vitamins",
    price: 1500,
    originalPrice: 1800,
    image: "https://plus.unsplash.com/premium_photo-1663011406193-7beb9d225d31?w=400&h=300&fit=crop",
    rating: 4.9,
    reviews: 1876,
  },
  {
    id: "P007",
    name: "Kidney Function Test",
    category: "Biochemistry",
    price: 700,
    originalPrice: 900,
    image: "https://images.unsplash.com/photo-1609825488888-3a766db0551a?w=400&h=300&fit=crop",
    rating: 4.7,
    reviews: 1234,
  },
  {
    id: "P008",
    name: "Hemoglobin A1C",
    category: "Diabetes",
    price: 500,
    originalPrice: 650,
    image: "https://images.unsplash.com/photo-1614935151651-0bea6508db6b?w=400&h=300&fit=crop",
    rating: 4.8,
    reviews: 1567,
  },
  {
    id: "P009",
    name: "Iron Studies",
    category: "Hematology",
    price: 900,
    originalPrice: 1100,
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&h=300&fit=crop",
    rating: 4.6,
    reviews: 987,
  },
  {
    id: "P010",
    name: "Vitamin B12",
    category: "Vitamins",
    price: 800,
    originalPrice: 1000,
    image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=400&h=300&fit=crop",
    rating: 4.7,
    reviews: 1345,
  },
  {
    id: "P011",
    name: "Urine Analysis",
    category: "Pathology",
    price: 250,
    originalPrice: 350,
    image: "https://images.unsplash.com/photo-1628595351029-c2bf17511435?w=400&h=300&fit=crop",
    rating: 4.5,
    reviews: 2100,
  },
  {
    id: "P012",
    name: "ECG",
    category: "Cardiology",
    price: 400,
    originalPrice: 500,
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop",
    rating: 4.9,
    reviews: 1890,
  },
];

export default function PopularTests() {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollPosition = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollWidth > container.clientWidth + container.scrollLeft
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
      container.scrollBy({ left: -380, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollBy({ left: 380, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-10 lg:py-12 bg-slate-50">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
            Popular Tests
            </h2>
            <p className="mt-1 text-slate-500 text-sm">
              Most booked tests by our customers
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
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 px-2"
          >
            {popularTests.map((test, index) => (
              <Link 
                key={test.id}
                href={`/tests/${test.id}`}
                className="flex-shrink-0 w-48 bg-white border border-slate-200 hover:border-sky-600 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group/card"
              >
                {/* Full Width Image at Top */}
                <div className="w-full h-20 overflow-hidden border-b border-slate-200">
                  <img 
                    src={test.image} 
                    alt={test.name}
                    className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-500"
                  />
                </div>
                
                {/* Details Below */}
                <div className="p-4">
                  {/* Category Badge */}
                  <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-sky-50 text-sky-700 mb-2">
                    {test.category}
                  </span>

                  {/* Test Name */}
                  <h3 className="text-base font-semibold text-slate-900 mb-2 group-hover/card:text-sky-600 transition-colors">
                    {test.name}
                  </h3>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-3">
                    <svg className="w-3.5 h-3.5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-xs font-semibold text-slate-900">{test.rating}</span>
                    <span className="text-xs text-slate-400">({test.reviews})</span>
                  </div>
                  
                  {/* Price Section */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-lg font-bold text-slate-900">₹{test.price}</span>
                      <span className="text-xs text-slate-400 line-through">₹{test.originalPrice}</span>
                    </div>
                    <span className="text-xs font-medium text-sky-600 bg-sky-50 px-2 py-0.5 rounded">
                      {Math.round((1 - test.price / test.originalPrice) * 100)}% OFF
                    </span>
                  </div>
                </div>
              </Link>
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
