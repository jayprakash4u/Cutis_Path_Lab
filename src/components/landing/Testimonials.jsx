"use client";

import { useRef, useState, useEffect, useCallback } from "react";

const reviews = [
  { id: 1, name: "Ramesh Kumar", role: "Patient", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop", rating: 5, content: "Excellent service! The staff was very professional and the test results were delivered on time. Highly recommend Cutis Path Lab for all diagnostic needs." },
  { id: 2, name: "Sita Devi", role: "Regular Patient", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop", rating: 5, content: "I've been using Cutis Path Lab for years. The home collection service is very convenient and the reports are always accurate. Great experience every time." },
  { id: 3, name: "Dr. Amit Sharma", role: "Physician", image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop", rating: 5, content: "As a referring physician, I trust Cutis Path Lab for all my patients. Their accuracy and turnaround time are exceptional. Highly recommended." },
  { id: 4, name: "Priya Patel", role: "Patient", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop", rating: 4, content: "Very clean and well-maintained facility. The staff was friendly and explained everything clearly. Will definitely come back for future tests." },
  { id: 5, name: "Mahesh Thapa", role: "Corporate Client", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop", rating: 5, content: "We use Cutis Path Lab for our employee health checkups. Professional service, competitive pricing, and excellent reporting. Very satisfied with their service." },
  { id: 6, name: "Anita Gurung", role: "Patient", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop", rating: 5, content: "The online booking system is so convenient! Got my appointment easily and the sample collection was done at my home. Great experience overall." },
];

export default function Reviews() {
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(2);
  const scrollAmountRef = useRef(0);
  const prevCardsRef = useRef(2);
  const GAP = 12; // matches gap-3  (3 × 4px)

  /**
   * Recalculate how many cards fit in the visible area.
   * Called on mount, after every scroll (to catch when scrolling finishes),
   * and when the window is resized.
   *
   * cardW   = border-box width of one card element  (offsetWidth includes padding+border)
   * cards   = floor(containerInner / (cardW + gap)), clamped to ≥ 1
   * scroll  = cardW * cards + gap*(cards-1)  – pixels to advance by one full "page"
   * totalDots = ceil(totalReviews / cards); used for the dot indicator
   */
  const recalc = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;
    const containerInner = container.offsetWidth;
    if (containerInner === 0) return;

    const firstCard = container.querySelector('[class*="flex-shrink-0"]');
    if (!firstCard) return;

    const cardW = firstCard.offsetWidth;       // border-box px
    const totalSlot = cardW + GAP;
    const cards = Math.max(1, Math.floor(containerInner / totalSlot));

    if (cards !== prevCardsRef.current) {
      prevCardsRef.current = cards;
      // cardW × N + gap × (N − 1)  – scroll just past the visible cards
      scrollAmountRef.current = cardW * cards + GAP * (cards - 1);
      setCardsPerView(cards);
    }
  }, []);

  useEffect(() => { recalc(); }, [recalc]);
  useEffect(() => {
    const onResize = () => recalc();
    window.addEventListener("resize", onResize);
    // ResizeObserver to catch flexbox / font-size changes too
    let ro;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => recalc());
      if (scrollRef.current) ro.observe(scrollRef.current);
    }
    return () => {
      window.removeEventListener("resize", onResize);
      if (ro) ro.disconnect();
    };
  }, [recalc]);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const unit = scrollAmountRef.current / cardsPerView;
    const newIndex = Math.round(scrollRef.current.scrollLeft / unit);
    setActiveIndex(Math.max(0, Math.min(newIndex, reviews.length - cardsPerView)));
  };

  // totalDots must reactively depend on cardsPerView
  const totalDots = Math.ceil(reviews.length / cardsPerView);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const amount = scrollAmountRef.current;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  const scrollToDot = (index) => {
    if (!scrollRef.current) return;
    const unit = scrollAmountRef.current / cardsPerView;
    scrollRef.current.scrollTo({
      left: index * unit,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-4 sm:py-6 md:py-8 lg:py-10 bg-slate-50 relative overflow-hidden">
      {/* Animated background accents */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-sky-500/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-sky-400/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-5xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 relative z-10">
         {/* Section Header */}
         <div className="relative">
           <div className="absolute top-0 left-0">
             <div className="bg-sky-600 px-4 py-2 rounded-tr-2xl rounded-bl-2xl">
               <h2 className="text-lg md:text-xl font-bold text-white">What Our Patients Say</h2>
             </div>
           </div>
         </div>

        {/* Scroll Container with Navigation */}
        <div className="relative pt-12">
          {/* Left Arrow - hidden on mobile */}
          <button
            onClick={() => scroll("left")}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 items-center justify-center rounded-full bg-white shadow-lg border border-slate-200 text-slate-600 hover:bg-sky-50 hover:border-sky-400 transition-all duration-300"
            aria-label="Previous"
          >
            <svg className="w-4 h-4 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Reviews Scroll Container */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex gap-3 overflow-x-auto scrollbar-hide px-2 sm:px-4 md:px-8 py-2 scroll-smooth"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {reviews.map((review) => (
              <div
                key={review.id}
                className="flex-shrink-0 w-[48%] sm:w-[48%] md:w-[32%] lg:w-[32%] bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-b-2 sm:border-b-4 border-b-[#FF6B6B] group"
              >
                {/* Rating Stars */}
                <div className="flex gap-0.5 mb-2 sm:mb-3 md:mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-3 h-3 sm:w-4 sm:w-5 ${i < review.rating ? "text-amber-400" : "text-slate-300"}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                {/* Content */}
                <p className="text-[10px] sm:text-xs md:text-sm text-slate-600 mb-2 sm:mb-3 md:mb-4 leading-tight sm:leading-relaxed group-hover:text-slate-700 transition-colors">
                  &ldquo;{review.content}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                  <img
                    src={review.image}
                    alt={review.name}
                    className="w-8 h-8 sm:w-10 sm:h-12 rounded-full object-cover border border-[#FF6B6B]"
                  />
                  <div>
                    <h4 className="font-semibold text-[10px] sm:text-xs md:text-sm text-slate-900 truncate">{review.name}</h4>
                    <p className="text-[9px] sm:text-xs text-slate-500">{review.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Arrow - hidden on mobile */}
          <button
            onClick={() => scroll("right")}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 items-center justify-center rounded-full bg-white shadow-lg border border-slate-200 text-slate-600 hover:bg-sky-50 hover:border-sky-400 transition-all duration-300"
            aria-label="Next"
          >
            <svg className="w-4 h-4 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              aria-label={`Go to review ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
