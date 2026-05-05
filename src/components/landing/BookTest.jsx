"use client";

import { useState } from "react";
import Link from "next/link";

export default function BookTest() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    test: "",
    date: "",
    time: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Thank you! We will confirm your booking shortly.");
  };

  return (
    <section id="book-test" className="py-6 sm:py-8 lg:py-10 bg-slate-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-center">
          {/* Left Side - Content & Image */}
          <div>
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-slate-900 mb-2 sm:mb-4">
              Book Your Test Today
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mb-3 sm:mb-4 lg:mb-6">
              Get accurate pathology results from the comfort of your home. 
              Our expert team will collect your sample and deliver results digitally.
            </p>
            
            <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-10 h-10 sm:w-12 sm:w-16 flex items-center justify-center">
                  <svg width="40" height="40" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 sm:w-12 sm:w-14">
                    <circle cx="60" cy="60" r="56" fill="#e8f4fd" stroke="#0284c7" strokeWidth="2"/>
                    <circle cx="60" cy="60" r="32" fill="#fff" stroke="#0284c7" strokeWidth="2.5"/>
                    <circle cx="60" cy="60" r="28" fill="#fff" stroke="#0284c7" strokeWidth="1"/>
                    <line x1="60" y1="32" x2="60" y2="38" stroke="#0284c7" strokeWidth="2.5" strokeLinecap="round"/>
                    <line x1="60" y1="82" x2="60" y2="88" stroke="#0284c7" strokeWidth="2.5" strokeLinecap="round"/>
                    <line x1="32" y1="60" x2="38" y2="60" stroke="#0284c7" strokeWidth="2.5" strokeLinecap="round"/>
                    <line x1="82" y1="60" x2="88" y2="60" stroke="#0284c7" strokeWidth="2.5" strokeLinecap="round"/>
                    <line x1="79" y1="41" x2="75.5" y2="46" stroke="#0284c7" strokeWidth="2" strokeLinecap="round"/>
                    <line x1="41" y1="41" x2="44.5" y2="46" stroke="#0284c7" strokeWidth="2" strokeLinecap="round"/>
                    <line x1="79" y1="79" x2="75.5" y2="74" stroke="#0284c7" strokeWidth="2" strokeLinecap="round"/>
                    <line x1="41" y1="79" x2="44.5" y2="74" stroke="#0284c7" strokeWidth="2" strokeLinecap="round"/>
                    <line x1="60" y1="60" x2="60" y2="40" stroke="#0284c7" strokeWidth="3" strokeLinecap="round"/>
                    <line x1="60" y1="60" x2="76" y2="67" stroke="#FF6B6B" strokeWidth="3" strokeLinecap="round"/>
                    <circle cx="60" cy="60" r="4" fill="#FF6B6B"/>
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-slate-900 text-xs sm:text-sm">Quick Results</p>
                  <p className="text-[10px] sm:text-xs text-slate-500">Results within 24 hours</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-10 h-10 sm:w-12 sm:w-16 flex items-center justify-center">
                  <svg width="40" height="40" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 sm:w-12 sm:w-14">
                    <circle cx="60" cy="60" r="56" fill="#e8f4fd" stroke="#0284c7" strokeWidth="2"/>
                    <path d="M28 64 L60 32 L92 64" stroke="#0284c7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                    <rect x="36" y="62" width="48" height="32" rx="2" fill="#bae6fd" stroke="#0284c7" strokeWidth="2.5"/>
                    <rect x="41" y="68" width="14" height="12" rx="2" fill="#fff" stroke="#0284c7" strokeWidth="1.8"/>
                    <circle cx="60" cy="32" r="7" fill="#FF6B6B" stroke="#fff" strokeWidth="1.5"/>
                    <circle cx="60" cy="31" r="3" fill="#fff"/>
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-slate-900 text-xs sm:text-sm">Home Sample Collection</p>
                  <p className="text-[10px] sm:text-xs text-slate-500">We come to your doorstep</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-10 h-10 sm:w-12 sm:w-16 flex items-center justify-center">
                  <svg width="40" height="40" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 sm:w-12 sm:w-14">
                    <circle cx="60" cy="60" r="56" fill="#e8f4fd" stroke="#0284c7" strokeWidth="2"/>
                    <circle cx="60" cy="60" r="5" fill="#FF6B6B"/>
                    <polyline points="44,63 54,74 76,50" fill="none" stroke="#FF6B6B" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
                    <text x="60" y="84" textAnchor="middle" fontSize="9" fontWeight="800" fill="#0284c7" fontFamily="Arial,sans-serif" letterSpacing="1">NABL</text>
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-slate-900 text-xs sm:text-sm">NABL Accredited</p>
                  <p className="text-[10px] sm:text-xs text-slate-500">ISO certified lab</p>
                </div>
              </div>
            </div>

            <div className="mb-3 sm:mb-6">
              <Link 
                href="/tests" 
                className="inline-flex items-center gap-1 sm:gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-sky-600 text-white text-xs sm:text-sm font-semibold rounded-lg hover:bg-sky-700 transition-colors"
              >
                View All Tests
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 shadow-lg">
            <div className="bg-[#FF6B6B] -mx-3 sm:-mx-4 md:-mx-6 -mt-3 sm:-mt-4 md:-mt-6 px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 rounded-t-xl sm:rounded-t-2xl mb-3 sm:mb-4">
              <h3 className="text-sm sm:text-base md:text-xl font-semibold text-white">
                Book Your Appointment
              </h3>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Full Name"
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="Phone Number"
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <select
                  name="test"
                  value={formData.test}
                  onChange={handleChange}
                  required
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-sky-500 max-h-40 overflow-y-auto"
                >
                  <option value="">Select Test</option>
                  {[
                    { id: 1, name: "Complete Blood Count (CBC)", price: 350 },
                    { id: 2, name: "Liver Function Test (LFT)", price: 800 },
                    { id: 3, name: "Kidney Function Test (KFT)", price: 700 },
                    { id: 4, name: "Thyroid Profile", price: 1200 },
                    { id: 5, name: "Blood Sugar Fasting", price: 200 },
                    { id: 6, name: "Lipid Profile", price: 600 },
                  ].map((test) => (
                    <option key={test.id} value={test.name}>
                      {test.name} - Rs. {test.price}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-sky-500"
                />
                <select
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                  className="px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-sky-500"
                >
                  <option value="">Time</option>
                  <option value="morning">Morning</option>
                  <option value="afternoon">Afternoon</option>
                  <option value="evening">Evening</option>
                </select>
              </div>

              <div className="pt-1 sm:pt-2">
                <button
                  type="submit"
                  className="float-right px-4 sm:px-6 py-2 sm:py-2.5 bg-sky-600 text-white text-xs sm:text-sm font-semibold rounded-lg hover:bg-sky-700"
                >
                  Book Now <span className="text-white">&gt;</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
