"use client";

import { useState, useEffect } from "react";

const doctors = [
  {
    id: 1,
    name: "Dr. Rajesh Kumar",
    specialization: "Cardiologist",
    hospital: "City Heart Hospital",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop",
  },
  {
    id: 2,
    name: "Dr. Priya Sharma",
    specialization: "Gynecologist",
    hospital: "Women Care Medical Center",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop",
  },
  {
    id: 3,
    name: "Dr. Amit Patel",
    specialization: "Orthopedic Surgeon",
    hospital: "Bone & Joint Institute",
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop",
  },
  {
    id: 4,
    name: "Dr. Sunita Devi",
    specialization: "Pediatrician",
    hospital: "Children's Health Center",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop",
  },
  {
    id: 5,
    name: "Dr. Mahesh Gupta",
    specialization: "Neurologist",
    hospital: "Brain & Spine Clinic",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop",
  },
  {
    id: 6,
    name: "Dr. Anjali Singh",
    specialization: "Dermatologist",
    hospital: "Skin Care Institute",
    image: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=400&h=400&fit=crop",
  },
  {
    id: 7,
    name: "Dr. Vikram Joshi",
    specialization: "Gastroenterologist",
    hospital: "Digestive Health Center",
    image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop",
  },
  {
    id: 8,
    name: "Dr. Meera Nair",
    specialization: "Endocrinologist",
    hospital: "Diabetes & Hormone Clinic",
    image: "https://images.unsplash.com/photo-1643297654416-05795d62e39c?w=400&h=400&fit=crop",
  },
  {
    id: 9,
    name: "Dr. Suresh Reddy",
    specialization: "Pulmonologist",
    hospital: "Respiratory Care Center",
    image: "https://images.unsplash.com/photo-1612349316228-5942a9b489c4?w=400&h=400&fit=crop",
  },
  {
    id: 10,
    name: "Dr. Kavita Mishra",
    specialization: "Oncologist",
    hospital: "Cancer Care Hospital",
    image: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=400&h=400&fit=crop",
  },
];

export default function DoctorReferrals() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 5;
  const totalSlides = Math.ceil(doctors.length / itemsPerPage);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const getVisibleDoctors = () => {
    const start = currentIndex * itemsPerPage;
    return doctors.slice(start, start + itemsPerPage);
  };

  return (
    <section className="py-10 lg:py-12 bg-slate-50">
      <div className="max-w-full mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-slate-900 mb-3">
            Our Referral Network
          </h2>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Previous Button */}
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-lg border border-slate-200 text-sky-600 hover:bg-sky-50 hover:border-sky-400 transition-all duration-300"
            aria-label="Previous"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Cards Container */}
          <div className="mx-16">
            <div className="grid grid-cols-5 gap-6">
              {getVisibleDoctors().map((doctor) => (
                <div 
                  key={doctor.id}
                  className="group cursor-pointer block rounded-xl"
                >
                  {/* Circular Image */}
                  <div className="relative w-28 h-28 mx-auto rounded-full overflow-hidden border-4 border-white shadow-md z-10">
                    <img 
                      src={doctor.image} 
                      alt={doctor.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Nameplate - overlaps image */}
                  <div className="w-full -mt-10 pt-10 pb-4 px-2 bg-white border border-slate-100 text-center hover:border-sky-600 hover:shadow-lg transition-all duration-300 rounded-xl">
                    <h3 className="text-sm font-bold text-slate-900 leading-tight mb-1 group-hover:text-sky-600 transition-colors">
                      {doctor.name}
                    </h3>
                    <p className="text-xs text-sky-600 font-medium">
                      {doctor.specialization}
                    </p>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                      {doctor.hospital}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Next Button */}
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-lg border border-slate-200 text-sky-600 hover:bg-sky-50 hover:border-sky-400 transition-all duration-300"
            aria-label="Next"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Slide Indicators */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-sky-600 w-8"
                  : "bg-sky-200 w-2.5 hover:bg-sky-400"
              }`}
            />
          ))}
        </div>

        
      </div>
    </section>
  );
}