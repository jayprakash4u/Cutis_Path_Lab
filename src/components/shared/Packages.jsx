"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Link from "next/link";

const packages = [
  {
    id: 1,
    name: "Complete Health Checkup",
    category: "Comprehensive",
    description: "Full body health assessment including blood tests, cardiac screening, and diabetes markers.",
    price: 2999,
    originalPrice: 4500,
    image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&h=300&fit=crop",
    includes: ["CBC", "Lipid Profile", "Liver Function", "Kidney Function", "Thyroid Profile"],
    tests: 45,
  },
  {
    id: 2,
    name: "Diabetes Care Package",
    category: "Diabetes",
    description: "Comprehensive diabetes monitoring and management package with regular tracking.",
    price: 1499,
    originalPrice: 2200,
    image: "https://images.unsplash.com/photo-1579165466991-467135ad3114?w=400&h=300&fit=crop",
    includes: ["HbA1c", "Fasting Glucose", "PP Glucose", "Insulin", "Microalbumin"],
    tests: 12,
  },
  {
    id: 3,
    name: "Cardiac Health Package",
    category: "Cardiology",
    description: "Heart health assessment with ECG, echo, and lipid profiling for cardiac risk evaluation.",
    price: 3499,
    originalPrice: 5000,
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop",
    includes: ["ECG", "Echo", "Lipid Profile", "Troponin", "CRP"],
    tests: 18,
  },
  {
    id: 4,
    name: "Women's Health Package",
    category: "Women's Health",
    description: "Specialized health screening for women including hormonal and nutritional assessment.",
    price: 2499,
    originalPrice: 3800,
    image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=400&h=300&fit=crop",
    includes: ["Thyroid Profile", "Iron Studies", "Vitamin D", "Vitamin B12", "Hormones"],
    tests: 28,
  },
  {
    id: 5,
    name: "Senior Citizen Package",
    category: "Senior Care",
    description: "Comprehensive health package designed for elderly with age-specific tests.",
    price: 3999,
    originalPrice: 6000,
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop",
    includes: ["Complete Blood Count", "Liver Function", "Kidney Function", "Bone Profile", "Cardiac"],
    tests: 52,
  },
  {
    id: 6,
    name: "Executive Health Package",
    category: "Premium",
    description: "Premium health screening for busy professionals with comprehensive diagnostics.",
    price: 5999,
    originalPrice: 9000,
    image: "https://images.unsplash.com/photo-1581093458791-9d3a7c86d86f?w=400&h=300&fit=crop",
    includes: ["Full Body Checkup", "Cardiac Screening", "Cancer Markers", "Hormones", "Vitamins"],
    tests: 75,
  },
  {
    id: 7,
    name: "Fertility Package",
    category: "Fertility",
    description: "Complete fertility assessment for couples with hormonal and genetic testing.",
    price: 4499,
    originalPrice: 6500,
    image: "https://images.unsplash.com/photo-1609825488888-3a766db0551a?w=400&h=300&fit=crop",
    includes: ["Hormone Panel", "Semen Analysis", "Genetic Tests", "Ultrasound", "Consultation"],
    tests: 22,
  },
  {
    id: 8,
    name: "Thyroid Care Package",
    category: "Thyroid",
    description: "Comprehensive thyroid function assessment with regular monitoring and consultation.",
    price: 1799,
    originalPrice: 2600,
    image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=400&h=300&fit=crop",
    includes: ["T3", "T4", "TSH", "Free T3", "Free T4", "Antibodies"],
    tests: 8,
  },
];

export default function Packages() {
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
      container.scrollBy({ left: -360, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollBy({ left: 360, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-10 lg:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              Health <span className="text-sky-600">Packages</span>
            </h2>
            <p className="mt-2 text-slate-500 text-sm">
              Comprehensive health checkups tailored for your needs
            </p>
          </div>
          <Link 
            href="/packages" 
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
            {packages.map((pkg) => (
              <div 
                key={pkg.id}
                className="flex-shrink-0 w-80 bg-white rounded-xl border border-slate-200 overflow-hidden hover:border-slate-300 hover:shadow-lg transition-all duration-300 cursor-pointer group/card"
              >
                {/* Image Container */}
                <div className="relative h-48 overflow-hidden bg-sky-600">
                  <img 
                    src={pkg.image} 
                    alt={pkg.name}
                    className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                  />
                  {/* Category Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium text-white">
                      {pkg.category}
                    </span>
                  </div>
                  {/* Tests Count Badge */}
                  <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-sky-600/95 backdrop-blur-sm text-white shadow-sm">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      {pkg.tests} Tests
                    </span>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-5">
                  {/* Package Name */}
                  <h3 className="text-base font-semibold text-slate-900 mb-2 group-hover/card:text-sky-600 transition-colors">
                    {pkg.name}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-sm text-slate-500 mb-4 line-clamp-2">
                    {pkg.description}
                  </p>
                  
                  {/* Includes */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {pkg.includes.slice(0, 3).map((item, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-slate-50 text-slate-600 text-xs rounded-md">
                        {item}
                      </span>
                    ))}
                    {pkg.includes.length > 3 && (
                      <span className="px-2 py-0.5 bg-slate-50 text-slate-500 text-xs rounded-md">
                        +{pkg.includes.length - 3} more
                      </span>
                    )}
                  </div>
                  
                  {/* Price Section */}
                  <div className="flex items-end justify-between pt-4 border-t border-slate-100">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-slate-900">₹{pkg.price}</span>
                        <span className="text-sm text-slate-400 line-through">₹{pkg.originalPrice}</span>
                      </div>
                      <span className="inline-block mt-1 text-xs font-medium text-sky-600 bg-sky-50 px-2 py-0.5 rounded">
                        {Math.round((1 - pkg.price / pkg.originalPrice) * 100)}% OFF
                      </span>
                    </div>
                    <Link 
                      href={`/packages/${pkg.id}`} 
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-sky-600 text-white text-sm font-medium rounded-lg hover:bg-sky-700 transition-colors shadow-sm"
                    >
                      View Details
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
            href="/packages" 
            className="inline-flex items-center gap-2 text-sm font-medium text-sky-600 hover:text-sky-700 transition-colors"
          >
            View all packages
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
