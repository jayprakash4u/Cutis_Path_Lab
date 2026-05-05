"use client";

import { useRef, useState } from "react";

const doctors = [
  { id: 1, name: "Dr. Rajesh Kumar", specialization: "Cardiologist", hospital: "City Heart Hospital", image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop" },
  { id: 2, name: "Dr. Priya Sharma", specialization: "Gynecologist", hospital: "Women Care Medical Center", image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop" },
  { id: 3, name: "Dr. Amit Patel", specialization: "Orthopedic Surgeon", hospital: "Bone & Joint Institute", image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop" },
  { id: 4, name: "Dr. Sunita Devi", specialization: "Pediatrician", hospital: "Children's Health Center", image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop" },
  { id: 5, name: "Dr. Mahesh Gupta", specialization: "Neurologist", hospital: "Brain & Spine Clinic", image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop" },
  { id: 6, name: "Dr. Anjali Singh", specialization: "Dermatologist", hospital: "Skin Care Institute", image: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=400&h=400&fit=crop" },
  { id: 7, name: "Dr. Vikram Joshi", specialization: "Gastroenterologist", hospital: "Digestive Health Center", image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop" },
  { id: 8, name: "Dr. Meera Nair", specialization: "Endocrinologist", hospital: "Diabetes & Hormone Clinic", image: "https://images.unsplash.com/photo-1643297654416-05795d62e39c?w=400&h=400&fit=crop" },
  { id: 9, name: "Dr. Suresh Reddy", specialization: "Pulmonologist", hospital: "Respiratory Care Center", image: "https://images.unsplash.com/photo-1612349316228-5942a9b489c4?w=400&h=400&fit=crop" },
  { id: 10, name: "Dr. Kavita Mishra", specialization: "Oncologist", hospital: "Cancer Care Hospital", image: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=400&h=400&fit=crop" },
];

export default function DoctorReferrals() {
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const cardsPerView = 4;

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollLeft = scrollRef.current.scrollLeft;
      const cardWidth = scrollRef.current.scrollWidth / doctors.length;
      const newIndex = Math.round(scrollLeft / (cardWidth * cardsPerView));
      setActiveIndex(Math.min(newIndex, Math.ceil(doctors.length / cardsPerView) - 1));
    }
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.scrollWidth / doctors.length;
      const scrollAmount = direction === "left" ? -cardWidth * 2 : cardWidth * 2;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const scrollToDot = (index) => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.scrollWidth / doctors.length;
      scrollRef.current.scrollTo({ left: index * cardWidth * cardsPerView, behavior: "smooth" });
    }
  };

  const totalDots = Math.ceil(doctors.length / cardsPerView);

  return (
    <section className="py-10 md:py-14 lg:py-16 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-12">
          <span className="inline-block px-4 py-1.5 bg-sky-100 text-sky-700 text-sm font-semibold rounded-full mb-3">
            Partner Network
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            Our Referral Network
          </h2>
          <p className="text-slate-500 text-sm md:text-base max-w-2xl mx-auto">
            Trusted healthcare professionals who trust us with their patients
          </p>
        </div>

        {/* Scroll Container */}
        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={() => scroll("left")}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 items-center justify-center rounded-full bg-white shadow-xl border border-slate-200 text-slate-400 hover:text-sky-600 hover:border-sky-300 hover:shadow-2xl transition-all duration-300 -translate-x-4"
            aria-label="Scroll left"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Cards Container */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide px-2 py-4 scroll-smooth"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {doctors.map((doctor) => (
              <div 
                key={doctor.id}
                className="flex-shrink-0 w-48 sm:w-56 md:w-64 group"
              >
                <div className="bg-white rounded-2xl p-5 shadow-md border border-slate-100 hover:shadow-xl hover:border-sky-200 hover:-translate-y-1 transition-all duration-300">
                  {/* Doctor Image */}
                  <div className="relative mb-4">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full overflow-hidden ring-4 ring-sky-50 group-hover:ring-sky-100 transition-all duration-300">
                      <img 
                        src={doctor.image} 
                        alt={doctor.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Status indicator */}
                    <div className="absolute bottom-1 right-1/2 translate-x-6 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>

                  {/* Doctor Info */}
                  <div className="text-center">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1 group-hover:text-sky-600 transition-colors">
                      {doctor.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-sky-600 font-medium mb-1">
                      {doctor.specialization}
                    </p>
                    <p className="text-xs text-slate-500 line-clamp-1">
                      {doctor.hospital}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => scroll("right")}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 items-center justify-center rounded-full bg-white shadow-xl border border-slate-200 text-slate-400 hover:text-sky-600 hover:border-sky-300 hover:shadow-2xl transition-all duration-300 translate-x-4"
            aria-label="Scroll right"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Navigation Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalDots }).map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToDot(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? "bg-sky-600 w-8"
                  : "bg-slate-300 w-2 hover:bg-slate-400"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}