"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Link from "next/link";

const tests = [
  {
    id: 1,
    name: "Complete Blood Count",
    category: "Hematology",
    price: 350,
    image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&h=300&fit=crop",
    popular: true,
  },
  {
    id: 2,
    name: "Liver Function Test",
    category: "Biochemistry",
    price: 800,
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop",
  },
  {
    id: 3,
    name: "Kidney Function Test",
    category: "Biochemistry",
    price: 700,
    image: "https://images.unsplash.com/photo-1609825488888-3a766db0551a?w=400&h=300&fit=crop",
  },
  {
    id: 4,
    name: "Thyroid Profile",
    category: "Hormone",
    price: 1200,
    image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=400&h=300&fit=crop",
    popular: true,
  },
  {
    id: 5,
    name: "Blood Sugar Fasting",
    category: "Biochemistry",
    price: 200,
    image: "https://images.unsplash.com/photo-1579165466991-467135ad3114?w=400&h=300&fit=crop",
  },
  {
    id: 6,
    name: "Lipid Profile",
    category: "Biochemistry",
    price: 600,
    image: "https://images.unsplash.com/photo-1581093458791-9d3a7c86d86f?w=400&h=300&fit=crop",
  },
  {
    id: 7,
    name: "Hemoglobin A1C",
    category: "Diabetes",
    price: 500,
    image: "https://images.unsplash.com/photo-1614935151651-0bea6508db6b?w=400&h=300&fit=crop",
  },
  {
    id: 8,
    name: "Vitamin D3",
    category: "Vitamins",
    price: 1500,
    image: "https://plus.unsplash.com/premium_photo-1663011406193-7beb9d225d31?w=400&h=300&fit=crop",
    popular: true,
  },
  {
    id: 9,
    name: "Iron Studies",
    category: "Hematology",
    price: 900,
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&h=300&fit=crop",
  },
  {
    id: 10,
    name: "Dengue NS1 Antigen",
    category: "Microbiology",
    price: 800,
    image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=400&h=300&fit=crop",
  },
  {
    id: 11,
    name: "Urine Analysis",
    category: "Pathology",
    price: 250,
    image: "https://images.unsplash.com/photo-1628595351029-c2bf17511435?w=400&h=300&fit=crop",
  },
  {
    id: 12,
    name: "ECG",
    category: "Cardiology",
    price: 400,
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop",
  },
];

const categoryColors = {
  Hematology: "bg-red-500",
  Biochemistry: "bg-blue-500",
  Hormone: "bg-purple-500",
  Diabetes: "bg-orange-500",
  Vitamins: "bg-yellow-500",
  Microbiology: "bg-green-500",
  Pathology: "bg-pink-500",
  Cardiology: "bg-indigo-500",
};

export default function TestPricing() {
  const scrollContainerRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
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

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || isPaused) return;

    let scrollAmount = 0;
    const cardWidth = 400;
    const totalCards = tests.length;
    const maxScroll = cardWidth * totalCards;

    const autoScroll = setInterval(() => {
      scrollAmount += 1;
      if (scrollAmount >= maxScroll) {
        scrollAmount = 0;
      }
      if (container) {
        container.scrollLeft = scrollAmount;
        checkScrollPosition();
      }
    }, 30);

    return () => clearInterval(autoScroll);
  }, [isPaused, checkScrollPosition]);

  const scrollLeft = () => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col">
      <div className="flex-1 flex flex-col justify-center py-12 lg:py-16">
        {/* Section Header */}
        <div className="text-center mb-10 px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Our <span className="text-sky-600">Test Pricing</span>
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">
            Get accurate pathology results at competitive prices. 
            Book your test today and get results within 24 hours.
          </p>
        </div>

        {/* Carousel Container with Navigation */}
        <div className="relative group flex-1 flex items-center">
          {/* Left Navigation Button */}
          <button
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            className={`absolute left-4 top-1/2 -translate-y-1/2 z-10 w-14 h-14 flex items-center justify-center rounded-full shadow-xl transition-all duration-300 ${
              canScrollLeft
                ? 'bg-white text-sky-600 hover:bg-sky-50 hover:shadow-2xl opacity-0 group-hover:opacity-100'
                : 'bg-slate-100 text-slate-300 cursor-not-allowed opacity-0 group-hover:opacity-50'
            }`}
            aria-label="Scroll left"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          {/* Right Navigation Button */}
          <button
            onClick={scrollRight}
            disabled={!canScrollRight}
            className={`absolute right-4 top-1/2 -translate-y-1/2 z-10 w-14 h-14 flex items-center justify-center rounded-full shadow-xl transition-all duration-300 ${
              canScrollRight
                ? 'bg-white text-sky-600 hover:bg-sky-50 hover:shadow-2xl opacity-0 group-hover:opacity-100'
                : 'bg-slate-100 text-slate-300 cursor-not-allowed opacity-0 group-hover:opacity-50'
            }`}
            aria-label="Scroll right"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>

          {/* Scroll Container */}
          <div 
            ref={scrollContainerRef}
            className="flex gap-8 overflow-x-hidden px-20 py-8"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {tests.map((test) => (
              <div 
                key={test.id}
                className="flex-shrink-0 w-80 bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 hover:shadow-2xl hover:border-sky-300 hover:-translate-y-3 transition-all duration-300 cursor-pointer group"
              >
                {/* Image */}
                <div className="h-52 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
                  <img 
                    src={test.image} 
                    alt={test.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
                    <span className={`px-4 py-1.5 ${categoryColors[test.category] || 'bg-sky-600'} text-white text-xs font-semibold rounded-full shadow-lg`}>
                      {test.category}
                    </span>
                    {test.popular && (
                      <span className="px-4 py-1.5 bg-amber-500 text-white text-xs font-semibold rounded-full shadow-lg flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        Popular
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-sky-600 transition-colors">
                    {test.name}
                  </h3>
                  
                  <div className="flex items-center justify-between mt-5">
                    <div>
                      <span className="text-sm text-slate-500">Starting from</span>
                      <p className="text-3xl font-bold text-sky-600">₹{test.price}</p>
                    </div>
                    <Link 
                      href="/book" 
                      className="px-6 py-3 bg-gradient-to-r from-sky-600 to-sky-500 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:from-sky-700 hover:to-sky-600 transition-all"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* View All Link */}
        <div className="text-center mt-8 px-4">
          <Link href="/tests" className="inline-flex items-center gap-2 px-8 py-4 bg-sky-600 text-white font-semibold rounded-xl hover:bg-sky-700 transition-all duration-300 shadow-lg hover:shadow-xl group">
            View all tests
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
