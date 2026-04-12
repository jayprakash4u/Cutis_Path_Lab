"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function SpecialOffer() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative py-1.5 sm:py-2 bg-sky-600 border-y border-sky-700 overflow-hidden">

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-0.5 sm:gap-1 items-center transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          
          {/* Left - Offer Badge */}
          <div className="flex flex-col sm:flex-row items-center gap-1">
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="absolute inset-0 bg-sky-500 rounded blur-md opacity-15"></div>
                <div className="relative bg-gradient-to-br from-sky-500 to-sky-600 text-white font-bold text-lg px-3 py-1.5 rounded shadow-sm flex items-center justify-center min-w-max">
                  🏷️ 10% OFF
                </div>
              </div>
            </div>
            <div className="text-white text-center sm:text-left">
              <div className="flex items-center gap-1 justify-center sm:justify-start">
                <svg className="w-3 h-3 text-sky-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-xs font-bold text-white">Limited Time</span>
              </div>
              <p className="text-sky-100 text-xs hidden sm:block">On tests</p>
            </div>
          </div>

          {/* Center - Key Features */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-1">
            <div className="flex items-center gap-1 bg-white/90 px-2 py-1 rounded border border-sky-500 text-slate-900 hover:bg-white hover:border-sky-400 transition-all group">
              <svg className="w-3 h-3 text-sky-600 group-hover:text-sky-700" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
              <span className="text-xs font-semibold">Pickup</span>
            </div>
            <div className="flex items-center gap-1 bg-white/90 px-2 py-1 rounded border border-sky-500 text-slate-900 hover:bg-white hover:border-sky-400 transition-all group">
              <svg className="w-3 h-3 text-sky-600 group-hover:text-sky-700" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              <span className="text-xs font-semibold">24H Reports</span>
            </div>
          </div>

          {/* Right - CTA & Promo Code */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-1">
            <div className="flex items-center gap-1 bg-white/90 px-1.5 py-0.5 rounded border border-sky-500 text-slate-900 hover:bg-white hover:border-sky-400 transition-all cursor-pointer group">
              <span className="text-xs font-medium text-slate-800 group-hover:text-sky-600 hidden sm:block">Code:</span>
              <span className="text-xs font-bold tracking-wide text-sky-600">CUTIS10</span>
              <svg className="w-2 h-2 text-slate-400 group-hover:text-sky-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm4 0a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1z" />
              </svg>
            </div>
            <Link 
              href="/book"
              className="px-3 py-1 bg-gradient-to-r from-sky-500 to-sky-600 text-white font-bold rounded hover:from-sky-600 hover:to-sky-700 transition-all duration-300 shadow-sm hover:shadow-md shadow-sky-500/20 hover:shadow-sky-500/40 text-xs whitespace-nowrap"
            >
              Book
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}



