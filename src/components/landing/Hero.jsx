import Link from "next/link";
import FloatingSidebar from "./FloatingSidebar"; 
     
const heroImage = {  
  url: "/images/banners/hero-main.png",  
  alt: "Medical Professional with Blood Sample",  
}; 
     
export default function Hero() {
  return (
    <section className="relative w-full h-[18vh] sm:h-[350px] md:h-[400px] lg:h-[480px] overflow-hidden">
      {/* Floating Sidebar - Sticks to Hero Section */}
      <FloatingSidebar />

      {/* Hero Background - Dark bg for sm+, image with fill for mobile */}
      <div className="absolute inset-0 sm:bg-slate-900">
        <img
          src={heroImage.url}
          alt={heroImage.alt}
          className="w-full h-full sm:object-cover object-fill"
        />
        
        {/* Gradient Overlay - For big screens only */}
        <div className="hidden sm:block absolute inset-0 bg-gradient-to-r from-slate-800/70 via-slate-900/50 to-slate-900/60" />
        <div className="hidden sm:block absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-900/80" />
        
        {/* Animated Sky Accent Elements - For big screens only */}
        <div className="hidden sm:block absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-sky-500/8 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-32 -left-32 w-72 h-72 bg-sky-400/5 rounded-full blur-3xl"></div>
        </div>
      </div>

      {/* Center Content - Hidden on mobile, shown on sm+ */}
      <div className="hidden sm:flex absolute inset-0 z-10 flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white mb-2 sm:mb-3 drop-shadow-lg">
          Your Trusted Partner in <span className="text-sky-400">Health</span>
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-slate-200 mb-3 sm:mb-4 max-w-xl drop-shadow-lg">
          Accurate diagnostics delivered with speed & precision
        </p>
        <Link 
          href="/book"
          className="px-4 sm:px-5 py-1.5 sm:py-2 bg-gradient-to-r from-sky-500 to-sky-600 text-white font-bold rounded-lg hover:from-sky-600 hover:to-sky-700 transition-all duration-300 shadow-xl shadow-sky-500/40 hover:shadow-sky-500/60 hover:-translate-y-1 text-xs sm:text-sm whitespace-nowrap"
        >
          Book Test Now
        </Link>
      </div>

      {/* Scroll Indicator - For big screens only */}
      <div className="hidden sm:block absolute bottom-6 sm:bottom-12 lg:bottom-16 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
